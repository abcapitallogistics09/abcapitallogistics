import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRouter from "./quote";
import contactRouter from "./contact";
import trackingRouter from "./tracking";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRouter);
router.use(contactRouter);
router.use(trackingRouter);

export default router;
