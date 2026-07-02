import { createRazorpayPaymentOrder } from "../api/payment.api.js";
import type { ICreateRazorpayPaymentOrderResponse, PaidPlan } from "../types/types.js";
import type { ApiResponse } from "../utils/ApiResponse.js";
import { handleAxiosError } from "../utils/helpers.js";

const createRazorpayPaymentOrderHandler = async (
    plan: PaidPlan
): Promise<ApiResponse<ICreateRazorpayPaymentOrderResponse>> => {
    try {
        const response = await createRazorpayPaymentOrder(plan); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

export { createRazorpayPaymentOrderHandler };
