import express from 'express';
import upload from '../middleware/multer.js';
import { RegisterUser, userinfo } from '../controller/userController.js';

const userRouter = express.Router()
    userRouter.post("/userreg",upload.single("image"),RegisterUser);
    userRouter.get("/userinfo/:userid",userinfo);
export default userRouter;
