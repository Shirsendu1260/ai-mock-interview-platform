import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../utils/ApiResponse.js";
import type { IBookmarkedJobResponse, IBookmarkJob, IJobSearchData, IJobSearchResponse, ILoadMoreJobsResponse } from "../types/types.js";
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

const bookmarkJob = (job: IBookmarkJob): Promise<AxiosResponse<ApiResponse<null>>> => {
    return api.post('/jobs/bookmark', job);
};

const removeBookmark = (jobId: string): Promise<AxiosResponse<ApiResponse<null>>> => {
    return api.delete(`/jobs/bookmark/${jobId}`);
};

const getBookmarkedJobIds = (): Promise<AxiosResponse<ApiResponse<string[]>>> => {
    return api.get('/jobs/bookmarks/ids');
};

const getBookmarkedJobs = (page: number): Promise<AxiosResponse<ApiResponse<IBookmarkedJobResponse>>> => {
    return api.get('/jobs/bookmarks', {
        params: { page }
    });
};

export { searchJobs, loadMoreJobs, bookmarkJob, removeBookmark, getBookmarkedJobIds, getBookmarkedJobs };
