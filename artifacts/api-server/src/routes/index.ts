import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRouter from "./quote";
import contactRouter from "./contact";
import trackingRouter from "./tracking";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRouter);
router.use(contactRouter);
router.use(trackingRouter);
router.use(openaiRouter);

export default router;
