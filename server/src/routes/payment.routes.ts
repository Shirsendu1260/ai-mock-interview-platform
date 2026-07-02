import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createRazorpayOrder } from '../controllers/payment.controller.js';


const router = Router();


////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/create-order').post(verifyJWT, createRazorpayOrder);


export default router;
