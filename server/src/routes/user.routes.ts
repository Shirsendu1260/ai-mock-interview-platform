import { Router } from 'express';
import { 
	oAuthUserLoginOrRegister, 
	refreshAccessToken,
	getAuthUser,
    signOutUser
} from '../controllers/user.controller.js';
// import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authLimiter, refreshLimiter } from '../middlewares/rateLimiter.middleware.js';



const router = Router();



////////////////////////////////  PUBLIC ROUTES  ////////////////////////////////

router.route('/sign-in/oauth').post(authLimiter, oAuthUserLoginOrRegister);
router.route('/refresh-token').post(refreshLimiter, refreshAccessToken);



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/get-auth-user').get(verifyJWT, getAuthUser);
router.route('/sign-out').post(verifyJWT, signOutUser); 



export default router;
