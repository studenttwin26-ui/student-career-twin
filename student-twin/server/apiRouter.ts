import express, { Request, Response } from 'express';
import { 
  analyzeResumeWithGemini, 
  generateMockInterviewResponse, 
  generateLearningRoadmap,
  synthesizeCareerTwinWithGemini 
} from './geminiService';
import { calculateReadinessScore } from '../src/data/mockData';

const router = express.Router();

router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true }));

function sendSafeJson(res: Response, statusCode: number, payload: any) {
  try {
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(statusCode).json(payload);
    }
    if (typeof (res as any).json === 'function') {
      (res as any).statusCode = statusCode;
      return (res as any).json(payload);
    }
  } catch (e) {
    console.warn('res.json invocation failed, using direct response end:', e);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(payload));
}

// Health and Diagnostics
router.get('/health', (_req: Request, res: Response) => {
  return sendSafeJson(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    service: 'Student Twin Career Engine & AI Mentorship Backend'
  });
});

// Resume ATS Analyzer API
const handleResumeAnalysis = async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole } = req.body || {};
    if (!resumeText) {
      return sendSafeJson(res, 400, { error: 'Resume content is required' });
    }

    const analysis = await analyzeResumeWithGemini(resumeText, targetRole || 'Software Engineer');
    return sendSafeJson(res, 200, { success: true, ...analysis, data: analysis });
  } catch (error: any) {
    console.error('Error in resume analysis:', error);
    return sendSafeJson(res, 500, { error: 'Failed to analyze resume' });
  }
};

router.post('/ai/resume-analyze', handleResumeAnalysis);
router.post('/ai/resume-analyzer', handleResumeAnalysis);

// AI Mock Interview API
router.post('/ai/mock-interview', async (req: Request, res: Response) => {
  try {
    const { targetRole, category, difficulty, conversation, latestUserAnswer } = req.body || {};
    
    if (!targetRole) {
      return sendSafeJson(res, 400, { error: 'Target role is required' });
    }

    const aiResponse = await generateMockInterviewResponse({
      targetRole,
      category: category || 'Technical',
      difficulty: difficulty || 'Medium',
      conversation: conversation || [],
      latestUserAnswer
    });

    return sendSafeJson(res, 200, { success: true, data: aiResponse });
  } catch (error: any) {
    console.error('Error in /api/ai/mock-interview:', error);
    return sendSafeJson(res, 500, { error: 'Failed to process interview message' });
  }
});

// AI Personalized Roadmap API
router.post('/ai/roadmap', async (req: Request, res: Response) => {
  try {
    const { targetRole, currentSkills, weaknesses } = req.body || {};

    const roadmapSteps = await generateLearningRoadmap({
      targetRole: targetRole || 'Software Development Engineer',
      currentSkills: currentSkills || [],
      weaknesses: weaknesses || []
    });

    return sendSafeJson(res, 200, { success: true, data: roadmapSteps });
  } catch (error: any) {
    console.error('Error in /api/ai/roadmap:', error);
    return sendSafeJson(res, 500, { error: 'Failed to generate learning roadmap' });
  }
});

// AI Career Twin Synthesis API
const handleCareerTwinSynthesis = async (req: Request, res: Response) => {
  try {
    const { 
      fullName, 
      department, 
      cgpa, 
      targetRole, 
      skills, 
      projects, 
      certifications, 
      scoreBreakdown, 
      readinessScore 
    } = req.body || {};

    const synthesis = await synthesizeCareerTwinWithGemini({
      fullName: fullName || 'Candidate',
      department: department || 'Computer Science & Engineering',
      cgpa: Number(cgpa) || 8.0,
      targetRole: targetRole || 'Full-Stack Software Engineer',
      skills: Array.isArray(skills) ? skills : [],
      projects: Array.isArray(projects) ? projects : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      scoreBreakdown,
      readinessScore: Number(readinessScore) || 75
    });

    return sendSafeJson(res, 200, { success: true, data: synthesis, ...synthesis });
  } catch (error: any) {
    console.error('Error in /api/ai/career-twin:', error);
    return sendSafeJson(res, 500, { error: 'Failed to synthesize career twin' });
  }
};

router.post('/ai/career-twin', handleCareerTwinSynthesis);
router.post('/ai/twin-synthesis', handleCareerTwinSynthesis);

// Trusted Readiness Score Calculation API
router.post('/score/calculate', (req: Request, res: Response) => {
  try {
    const { profile, latestAssessmentPct, atsScore, interviewScore } = req.body || {};
    const result = calculateReadinessScore(profile || {}, latestAssessmentPct, atsScore, interviewScore);
    return sendSafeJson(res, 200, { success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/score/calculate:', error);
    return sendSafeJson(res, 500, { error: 'Failed to calculate readiness score' });
  }
});

export default router;
