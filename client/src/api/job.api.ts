import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../utils/ApiResponse.js";
import type { IJobSearchResponse, ILoadMoreJobsResponse } from "../types/types.js";
import { api } from "./axios";

const searchJobs = (): Promise<AxiosResponse<ApiResponse<IJobSearchResponse>>> => {
    return api.post('/jobs/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

const loadMoreJobs = (): Promise<AxiosResponse<ApiResponse<ILoadMoreJobsResponse>>> => {
    return api.post('/jobs/load-more');
}

export { searchJobs, loadMoreJobs };
