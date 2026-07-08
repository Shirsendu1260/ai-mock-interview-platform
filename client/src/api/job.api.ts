import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../utils/ApiResponse.js";
import type { IJobSearchData, IJobSearchResponse, ILoadMoreJobsResponse } from "../types/types.js";
import { api } from "./axios";

const searchJobs = (formData: FormData): Promise<AxiosResponse<ApiResponse<IJobSearchResponse>>> => {
    return api.post('/jobs/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

const loadMoreJobs = (
    searchData: IJobSearchData,
    page: number
): Promise<AxiosResponse<ApiResponse<ILoadMoreJobsResponse>>> => {
    return api.post('/jobs/load-more', { searchData, page });
};

export { searchJobs, loadMoreJobs };
