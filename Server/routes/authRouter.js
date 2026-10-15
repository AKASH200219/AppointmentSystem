import express from 'express'
import { getCurrentUser, userLogin } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';


const authRouter = express.Router();
    authRouter.post("/login",userLogin)
    authRouter.get("/getkey",protect,getCurrentUser)
export default authRouter;