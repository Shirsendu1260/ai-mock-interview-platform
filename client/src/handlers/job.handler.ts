import { searchJobs, loadMoreJobs } from "../api/job.api.js";
import type { IJobSearchResponse, ILoadMoreJobsResponse } from "../types/types.js";
import type { ApiResponse } from "../utils/ApiResponse.js";
import { handleAxiosError } from "../utils/helpers.js";

const searchJobsHandler = async (): Promise<ApiResponse<IJobSearchResponse>> => {
    try {
        const response = await searchJobs(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const loadMoreJobsHandler = async (): Promise<ApiResponse<ILoadMoreJobsResponse>> => {
    try {
        const response = await loadMoreJobs(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

export { searchJobsHandler, getDashboardStatsHandler };
