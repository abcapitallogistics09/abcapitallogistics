import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages, aiSettings, aiKnowledge } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { eq, asc } from "drizzle-orm";
import { CreateOpenaiConversationBody, SendOpenaiMessageBody } from "@workspace/api-zod";

const router = Router();

const DEFAULT_SYSTEM_PROMPT = `You are the AI logistics assistant for AB Capital Logistics, a premier freight forwarding company based in Douala, Cameroon, serving Central Africa and beyond.

Your role is to help visitors with:
- Information about services: Air Freight, Ocean Freight, Road Freight, Customs Clearance, Warehousing, 3PL Solutions, and Ship Agency
- Shipping routes, transit times, and trade lanes (especially Cameroon, Central Africa, Dubai, China, Europe)
- Customs procedures and documentation for imports/exports through Douala Port
- Getting a freight quote (direct them to /quote or offer to collect details)
- Shipment tracking (direct them to /tracking with tracking number ABCL-XXXX format)
- Contact and office information:
  - Address: 3MGF+F5M Bonabéri, Douala, Cameroon
  - Phone: +237 677-238-818
  - Email: info@abcapitallogistics.com
  - WhatsApp: +237 677-238-818
- Industries served: Oil & Gas, FMCG, Telecom, Agriculture, Mining, Healthcare, Retail, Manufacturing, Construction

Be warm, professional, and concise. If you don't know something specific (like real-time rates), acknowledge it and offer to connect them with the team via WhatsApp or the contact form. Always offer to help with related logistics questions. Keep responses focused and practical — this is a business context.

When users want a quote, ask for: origin, destination, freight type (air/sea/road), cargo description, and approximate weight/volume.`;

async function buildSystemPrompt(): Promise<string> {
  try {
    const [promptRow] = await db.select().from(aiSettings).where(eq(aiSettings.key, "system_prompt"));
    const basePrompt = promptRow?.value ?? DEFAULT_SYSTEM_PROMPT;

    const knowledgeRows = await db
      .select()
      .from(aiKnowledge)
      .where(eq(aiKnowledge.active, true))
      .orderBy(asc(aiKnowledge.category));

    if (knowledgeRows.length === 0) return basePrompt;

    const knowledgeBlock = knowledgeRows
      .map((k) => `Q: ${k.question}\nA: ${k.answer}`)
      .join("\n\n");

    return `${basePrompt}\n\n--- ADDITIONAL KNOWLEDGE BASE ---\nUse the following company-specific Q&A to give accurate, detailed answers:\n\n${knowledgeBlock}`;
  } catch {
    return DEFAULT_SYSTEM_PROMPT;
  }
}

router.post("/openai/conversations", async (req, res) => {
  const parsed = CreateOpenaiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [conv] = await db
    .insert(conversations)
    .values({ title: parsed.data.title ?? "New Chat" })
    .returning();
  res.status(201).json(conv);
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid conversation id" });
    return;
  }

  const parsed = SendOpenaiMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);

  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  await db.insert(messages).values({
    conversationId: id,
    role: "user",
    content: parsed.data.content,
  });

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  const systemPrompt = await buildSystemPrompt();

  const chatMessages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "OpenAI streaming error");
    res.write(`data: ${JSON.stringify({ error: "AI service error" })}\n\n`);
    res.end();
  }
});

export default router;
