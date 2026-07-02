import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../utils/ApiResponse.js";
import { api } from "./axios";
import type { ICreateRazorpayPaymentOrderResponse, PaidPlan } from "../types/types.js";

const createRazorpayPaymentOrder = (
    plan: PaidPlan
): Promise<AxiosResponse<ApiResponse<ICreateRazorpayPaymentOrderResponse>>> => {
    return api.post('/payments/create-order', { plan });
}

export { createRazorpayPaymentOrder };
