import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    createRazorpayOrder,
    razorpayWebhook,
    verifyRazorpayPayment,
    getPaymentHistory,
    getCreditTransactionHistory
} from '../controllers/payment.controller.js';
import express from 'express';


const router = Router();


////////////////////////////////  AUTHENTICATED ROUTES  ////////////////////////////////

router.route('/create-order').post(verifyJWT, createRazorpayOrder);
router.route('/verify').post(verifyJWT, verifyRazorpayPayment);
router.route('/webhook').post(razorpayWebhook);
router.route('/history').get(verifyJWT, getPaymentHistory);
router.route('/credit-history').get(verifyJWT, getCreditTransactionHistory);


export default router;
