import { getDashboardStats, getRecentInterviews } from "../api/dashboard.api.js";
import { handleAxiosError } from "../utils/helpers.js";

const getRecentInterviewsHandler = async () => {
    try {
        const response = await getRecentInterviews(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const getDashboardStatsHandler = async () => {
    try {
        const response = await getDashboardStats(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

export { getRecentInterviewsHandler, getDashboardStatsHandler };
