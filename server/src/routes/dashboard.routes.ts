import { Router } from 'express';
import { getInterviewStats } from '../controllers/dashboard.controller.js';
// import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';



const router = Router();



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/stats').get(verifyJWT, getInterviewStats);



export default router;
