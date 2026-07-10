import { searchJobs, loadMoreJobs, bookmarkJob, getBookmarkedJobIds, getBookmarkedJobs, removeBookmark } from "../api/job.api.js";
import type { IBookmarkedJobResponse, IBookmarkJob, IJobSearchData, IJobSearchResponse, ILoadMoreJobsResponse } from "../types/types.js";
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

const bookmarkJobHandler = async (job: IBookmarkJob): Promise<ApiResponse<null>> => {
    try {
        const response = await bookmarkJob(job); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const removeBookmarkHandler = async (jobId: string): Promise<ApiResponse<null>> => {
    try {
        const response = await removeBookmark(jobId); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const getBookmarkedJobIdsHandler = async (): Promise<ApiResponse<string[]>> => {
    try {
        const response = await getBookmarkedJobIds(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const getBookmarkedJobsHandler = async (page: number): Promise<ApiResponse<IBookmarkedJobResponse>> => {
    try {
        const response = await getBookmarkedJobs(page); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

export {
    searchJobsHandler,
    loadMoreJobsHandler,
    bookmarkJobHandler,
    removeBookmarkHandler,
    getBookmarkedJobIdsHandler,
    getBookmarkedJobsHandler
};
