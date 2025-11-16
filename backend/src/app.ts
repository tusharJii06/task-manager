import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/tasks/task.routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use(errorHandler);
