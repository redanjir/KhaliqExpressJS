import userRoutes from "./users.mjs";
import productRoutes from "./products.mjs";
import { Router } from "express";

const router = Router();

router.use(userRoutes);
router.use(productRoutes);

export default router;