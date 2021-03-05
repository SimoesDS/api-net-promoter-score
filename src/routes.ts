import { Router } from 'express';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveyController();

router.post('/users', userController.create);

router.get('/surveys', surveysController.show);
router.post('/surveys', surveysController.create);

export { router };