import { Router } from 'express';
import {
    createInterview,
    getInterview,
    getInterviewQuestion
} from '../controllers/interview.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const router = Router();



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/create').post(verifyJWT, upload.single('resume'), createInterview);
router.route('/:interviewId').get(verifyJWT, getInterview);
router.route('/:interviewId/questions/:position').get(verifyJWT, getInterviewQuestion);



export default router;
