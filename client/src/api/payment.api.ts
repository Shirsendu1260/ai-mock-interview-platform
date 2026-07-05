import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../utils/ApiResponse.js";
import { api } from "./axios";
import type {
    ICreateRazorpayPaymentOrderResponse,
    ICreditHistoryResponse,
    IPaymentHistoryResponse,
    PaidPlan
} from "../types/types.js";
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

const getPaymentHistory = (
    page: number
): Promise<AxiosResponse<ApiResponse<IPaymentHistoryResponse>>> => {
    return api.get(`/payments/history?page=${page}`);
};

const getCreditHistory = (
    page: number
): Promise<AxiosResponse<ApiResponse<ICreditHistoryResponse>>> => {
    return api.get(`/payments/credit-history?page=${page}`);
};

export {
    createRazorpayPaymentOrder,
    verifyRazorpayPayment,
    getPaymentHistory,
    getCreditHistory
};
