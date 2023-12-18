import express from "express";
import userRouter from "./user.js";
const router = express.Router();
router.get('/',(req,res)=>{
    res.status(200).send(`
    <h1 style="text-align:center">Welcome to Backend of Blog App</h1>`)
})
router.use('/user',userRouter)



export default router;