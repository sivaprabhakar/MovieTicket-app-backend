import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.js';
import bookingsRouter from './routes/bookings.js';
import movieRouter from './routes/movie.js';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/user', userRouter); // Mount the userRouter
app.use('/booking', bookingsRouter);
app.use('/movie', movieRouter);

app.listen(PORT, () => console.log(`Connected to port ${PORT}`));
