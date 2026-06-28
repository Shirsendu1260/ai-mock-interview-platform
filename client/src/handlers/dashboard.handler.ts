import { getDashboardStats, getRecentInterviews } from "../api/dashboard.api.js";
import { ApiError } from "../utils/ApiError.js";

const getRecentInterviewsHandler = async () => {
    const response = await getRecentInterviews();

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to recent interviews.'
        );
    }
};

const getDashboardStatsHandler = async () => {
    const response = await getDashboardStats();

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to dashboard statistics.'
        );
    }
};

export { getRecentInterviewsHandler, getDashboardStatsHandler };
