import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/payment.controller.js';


const router = Router();


////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/create-order').post(verifyJWT, createRazorpayOrder);
router.route('/verify').post(verifyJWT, verifyRazorpayPayment);


export default router;
