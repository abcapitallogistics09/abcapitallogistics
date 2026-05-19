import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.insert(contactsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    company: parsed.data.company ?? null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  req.log.info({ email: parsed.data.email }, "Contact form submitted");

  res.status(201).json({
    success: true,
    message: "Thank you for your message. We will respond within 1 business day.",
  });
});

export default router;
