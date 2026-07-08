import { searchJobs, loadMoreJobs } from "../api/job.api.js";
import type { IJobSearchData, IJobSearchResponse, ILoadMoreJobsResponse } from "../types/types.js";
import type { ApiResponse } from "../utils/ApiResponse.js";
import { handleAxiosError } from "../utils/helpers.js";

const searchJobsHandler = async (formData: FormData): Promise<ApiResponse<IJobSearchResponse>> => {
    try {
        const response = await searchJobs(formData); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const loadMoreJobsHandler = async (
    searchData: IJobSearchData,
    page: number
): Promise<ApiResponse<ILoadMoreJobsResponse>> => {
    try {
        const response = await loadMoreJobs(searchData, page); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

export { searchJobsHandler, loadMoreJobsHandler };
