import { Router } from 'express';
import {
    createInterview,
    getInterview,
    getInterviewQuestion,
    saveInterviewQuestionAnswer,
    submitInterview,
    getInterviewResult,
    getOngoingInterview,
    getInterviewHistory,
    downloadInterviewReport
} from '../controllers/interview.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const router = Router();



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/ongoing').get(verifyJWT, getOngoingInterview);
router.route('/history').get(verifyJWT, getInterviewHistory);
router.route('/create').post(verifyJWT, upload.single('resume'), createInterview);
router.route('/:interviewId').get(verifyJWT, getInterview);
router.route('/:interviewId/questions/:position').get(verifyJWT, getInterviewQuestion);
router.route('/:interviewId/questions/:position').patch(verifyJWT, saveInterviewQuestionAnswer);
router.route('/:interviewId/submit').post(verifyJWT, submitInterview);
router.route('/:interviewId/result').get(verifyJWT, getInterviewResult);
router.route('/:interviewId/report').get(verifyJWT, downloadInterviewReport);



export default router;
