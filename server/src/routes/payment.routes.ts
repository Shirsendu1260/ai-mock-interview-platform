import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createRazorpayOrder, razorpayWebhook, verifyRazorpayPayment } from '../controllers/payment.controller.js';
import express from 'express';


const router = Router();


////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/create-order').post(verifyJWT, createRazorpayOrder);
router.route('/verify').post(verifyJWT, verifyRazorpayPayment);
router.route('/webhook').post(express.raw({ type: 'application/json' }), razorpayWebhook);


export default router;
