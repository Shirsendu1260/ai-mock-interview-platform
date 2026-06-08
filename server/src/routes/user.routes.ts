import { Router } from 'express';
import { 
	oAuthUserLoginOrRegister, 
    signOutUser
} from '../controllers/user.controller.js';
// import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';



const router = Router();



////////////////////////////////  PUBLIC ROUTES  ////////////////////////////////

router.route('/sign-in/oauth').post(authLimiter, oAuthUserLoginOrRegister);



////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/sign-out').post(verifyJWT, signOutUser); 



export default router;
