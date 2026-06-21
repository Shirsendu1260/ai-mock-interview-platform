import { Router } from 'express';
import {
    createInterview,
    getInterview,
    getInterviewQuestion
} from '../controllers/user.controller.js';
// import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const router = Router();



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/create').post(verifyJWT, createInterview);
router.route('/:interviewId').get(verifyJWT, getInterview);
router.route('/:interviewId/questions/:position').get(verifyJWT, getInterviewQuestion);



export default router;
