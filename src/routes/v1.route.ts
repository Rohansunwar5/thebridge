import { Router } from 'express';
import { health, helloWorld } from '../controllers/health.controller';
import { asyncHandler } from '../utils/asynchandler';
import creatorAuthRouter from './creator-auth.route';
import brandAuthRouter from './brand-auth.route';

const v1Router = Router();

v1Router.get('/', asyncHandler(helloWorld));
v1Router.get('/health', asyncHandler(health));
v1Router.use('/creator/auth', creatorAuthRouter);
v1Router.use('/brand/auth', brandAuthRouter);

export default v1Router;
