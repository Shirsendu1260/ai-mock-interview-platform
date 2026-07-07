import { Router } from 'express';
import { searchJobs, loadMoreJobs } from '../controllers/job.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { jobSearchLimiter } from '../middlewares/rateLimiter.middleware.js';



const router = Router();



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/search').post(verifyJWT, jobSearchLimiter, upload.single('resume'), searchJobs);
router.route('/load-more').post(verifyJWT, jobSearchLimiter, loadMoreJobs);



export default router;
