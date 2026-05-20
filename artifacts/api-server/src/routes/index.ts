import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRouter from "./quote";
import contactRouter from "./contact";
import trackingRouter from "./tracking";
import openaiRouter from "./openai";
import adminRouter from "./admin";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRouter);
router.use(contactRouter);
router.use(trackingRouter);
router.use(openaiRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
