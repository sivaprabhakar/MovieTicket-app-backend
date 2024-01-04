import express from 'express';
import { verifyToken, deleteUserById, getAllUsers, getBookingsOfUser, loginUser, signUp, updateUser, getUserById } from '../controllers/users.js';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.post('/signup', signUp);
userRouter.put('/:id', verifyToken, updateUser);
userRouter.delete('/:id', deleteUserById);
userRouter.post('/login', loginUser);
userRouter.get('/booking/:id', verifyToken, getBookingsOfUser);
userRouter.get('/:id',getUserById)
export default userRouter;