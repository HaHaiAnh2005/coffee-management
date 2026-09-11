import { Router } from 'express';
import chatbotController from '../controllers/chatbot.controller';

const router = Router();

router.post('/chat', (req, res) => chatbotController.chat(req, res));
router.get('/quick-prompts', (req, res) => chatbotController.getQuickPrompts(req, res));

export default router;
