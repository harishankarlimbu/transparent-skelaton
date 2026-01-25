import { Router } from 'express';
import { geminiService } from '../services/gemini.service.js';
const router = Router();
// POST /api/format - Format script using Gemini
router.post('/', async (req, res) => {
    try {
        const { script } = req.body;
        if (!script || typeof script !== 'string') {
            res.status(400).json({ error: 'Script is required and must be a string' });
            return;
        }
        if (script.trim().length === 0) {
            res.status(400).json({ error: 'Script cannot be empty' });
            return;
        }
        const formattedScript = await geminiService.formatScript(script);
        res.json({ formattedScript });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Format error:', message);
        res.status(500).json({ error: 'Failed to format script', details: message });
    }
});
export const formatRoutes = router;
//# sourceMappingURL=format.routes.js.map