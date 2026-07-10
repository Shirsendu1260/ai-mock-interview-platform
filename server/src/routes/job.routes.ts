import { Router } from 'express';
import { searchJobs, loadMoreJobs, bookmarkJob, removeBookmark, getBookmarkedJobs, getBookmarkedJobIds } from '../controllers/job.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { jobSearchLimiter, jobBookmarkLimiter } from '../middlewares/rateLimiter.middleware.js';



const router = Router();



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/search').post(verifyJWT, jobSearchLimiter, upload.single('resume'), searchJobs);
router.route('/load-more').post(verifyJWT, jobSearchLimiter, loadMoreJobs);
router.route('/bookmark').post(verifyJWT, jobBookmarkLimiter, bookmarkJob);
router.route('/bookmark/:jobId').delete(verifyJWT, jobBookmarkLimiter, removeBookmark );
router.route('/bookmarks').get(verifyJWT, getBookmarkedJobs );
router.route('/bookmarks/ids').get( verifyJWT, getBookmarkedJobIds );



export default router;
