import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../utils/ApiResponse.js";
import { api } from "./axios";
import type { ICreateRazorpayPaymentOrderResponse, PaidPlan } from "../types/types.js";
import type { RazorpayPaymentSuccessResponse } from "../types/razorpay.js";

const createRazorpayPaymentOrder = (
    plan: PaidPlan
): Promise<AxiosResponse<ApiResponse<ICreateRazorpayPaymentOrderResponse>>> => {
    return api.post('/payments/create-order', { plan });
};

const verifyRazorpayPayment = (
    paymentDetails: RazorpayPaymentSuccessResponse
): Promise<AxiosResponse<ApiResponse<{}>>> => {
    return api.post('/payments/verify', paymentDetails);
};

export { createRazorpayPaymentOrder, verifyRazorpayPayment };
