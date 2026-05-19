import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User, ExternalLink } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationResponse {
  id: number;
  title: string;
  createdAt: string;
}

async function createConversation(): Promise<ConversationResponse> {
  const res = await fetch("/api/openai/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Website Chat" }),
  });
  return res.json() as Promise<ConversationResponse>;
}

async function* streamMessage(
  conversationId: number,
  content: string
): AsyncGenerator<string> {
  const res = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok || !res.body) throw new Error("Stream failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const parsed = JSON.parse(line.slice(6)) as { content?: string; done?: boolean; error?: string };
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.done) return;
        if (parsed.content) yield parsed.content;
      } catch {
        // skip malformed lines
      }
    }
  }
}

const SUGGESTED_QUESTIONS = [
  "What shipping services do you offer?",
  "How do I track my shipment?",
  "Get a freight quote",
  "Customs clearance in Cameroon",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreeted = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && !hasGreeted.current) {
      hasGreeted.current = true;
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm the AB Capital Logistics AI assistant. I can help you with freight quotes, shipment tracking, customs clearance, and any questions about our services in Cameroon and Central Africa. How can I help you today?",
        },
      ]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      setError(null);
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setStreaming(true);

      try {
        let convId = conversationId;
        if (!convId) {
          const conv = await createConversation();
          convId = conv.id;
          setConversationId(convId);
        }

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        let accumulated = "";
        for await (const chunk of streamMessage(convId, trimmed)) {
          accumulated += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: accumulated };
            return updated;
          });
        }
      } catch {
        setError("Sorry, something went wrong. Please try again or contact us directly.");
        setMessages((prev) => prev.filter((m) => m.content !== ""));
      } finally {
        setStreaming(false);
      }
    },
    [conversationId, streaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const showSuggestions = messages.length <= 1 && !streaming;

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#0B1F3A] hover:bg-[#123D6B] text-white rounded-full shadow-2xl flex items-center justify-center transition-colors duration-200"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI chat assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-[#F28C28] animate-ping opacity-50" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-44 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            style={{ height: "500px" }}
          >
            {/* Header */}
            <div className="bg-[#0B1F3A] px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#F28C28] flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">AB Capital AI Assistant</p>
                <p className="text-blue-200 text-xs">Logistics expert · Always available</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "user" ? "bg-[#F28C28]" : "bg-[#0B1F3A]"}`}>
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#0B1F3A] text-white rounded-tr-sm"
                        : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.content || (
                      <span className="flex gap-1 items-center py-0.5">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Suggested questions */}
              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-white border border-[#0B1F3A]/20 text-[#0B1F3A] rounded-full px-3 py-1.5 hover:bg-[#0B1F3A] hover:text-white transition-colors duration-150 font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* WhatsApp handoff */}
            <div className="px-4 py-2 border-t border-gray-100 bg-white shrink-0">
              <a
                href="https://wa.me/237677238818"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp for urgent requests
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-gray-100 bg-white shrink-0 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about shipping, customs, quotes…"
                disabled={streaming}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0B1F3A] focus:ring-1 focus:ring-[#0B1F3A]/20 placeholder:text-gray-400 disabled:opacity-60 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className="w-10 h-10 rounded-xl bg-[#0B1F3A] hover:bg-[#123D6B] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {streaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
