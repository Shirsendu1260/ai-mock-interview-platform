import { getDashboardStats, getRecentInterviews } from "../api/dashboard.api.js";
import type { DashboardStatsResponse, IInterviewHistory } from "../types/types.js";
import type { ApiResponse } from "../utils/ApiResponse.js";
import { handleAxiosError } from "../utils/helpers.js";

const getRecentInterviewsHandler = async (): Promise<ApiResponse<IInterviewHistory[]>> => {
    try {
        const response = await getRecentInterviews(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        // If any error occurs, pass it to the central error handler 'handleAxiosError'
        // 'throw' ensures TS knows this 'catch' block never returns normally, only 'try' block returns
        throw handleAxiosError(error);
    }
};

const getDashboardStatsHandler = async (): Promise<ApiResponse<DashboardStatsResponse>> => {
    try {
        const response = await getDashboardStats(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

export { getRecentInterviewsHandler, getDashboardStatsHandler };
