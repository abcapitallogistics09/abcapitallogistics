import { Router, type IRouter } from "express";
import { db, quotesTable } from "@workspace/db";
import { SubmitQuoteBody } from "@workspace/api-zod";

const router: IRouter = Router();

function generateReference(): string {
  const prefix = "ABCL";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

router.post("/quote", async (req, res): Promise<void> => {
  const parsed = SubmitQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const referenceNumber = generateReference();

  await db.insert(quotesTable).values({
    referenceNumber,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company ?? null,
    origin: parsed.data.origin,
    destination: parsed.data.destination,
    freightType: parsed.data.freightType,
    cargoType: parsed.data.cargoType,
    weight: parsed.data.weight,
    volume: parsed.data.volume ?? null,
    incoterms: parsed.data.incoterms ?? null,
    hazardous: parsed.data.hazardous ?? false,
    message: parsed.data.message ?? null,
  });

  req.log.info({ referenceNumber }, "Quote request submitted");

  res.status(201).json({
    success: true,
    referenceNumber,
    message: "Your quote request has been received. Our team will contact you within 24 hours.",
  });
});

export default router;
