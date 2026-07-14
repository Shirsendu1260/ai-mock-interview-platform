import { api } from './axios.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import type { AxiosResponse } from 'axios';
import type {
    ICreateInterviewResponse,
    IInterview,
    IInterviewHistoryFilters,
    IInterviewHistoryResponse,
    IInterviewQuestion,
    IInterviewResult,
    IOngoingInterview,
    ISaveAnswerPayload,
    ISubmitInterviewResponse
} from '../types/types.js';

const createInterview = (
    formData: FormData
): Promise<AxiosResponse<ApiResponse<ICreateInterviewResponse>>> => {
    return api.post('/interviews/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

const getInterview = (
    interviewId: string
): Promise<AxiosResponse<ApiResponse<IInterview>>> => {
    return api.get(`/interviews/${interviewId}`);
};

const getInterviewQuestion = (
    interviewId: string,
    position: number
): Promise<AxiosResponse<ApiResponse<IInterviewQuestion>>> => {
    return api.get(`/interviews/${interviewId}/questions/${position}`);
};

const saveInterviewAnswer = (
    interviewId: string,
    position: number,
    payload: ISaveAnswerPayload
): Promise<AxiosResponse<ApiResponse<null>>> => {
    return api.patch(`/interviews/${interviewId}/questions/${position}`, payload);
};

const submitInterview = (
    interviewId: string
): Promise<AxiosResponse<ApiResponse<ISubmitInterviewResponse>>> => {
    return api.post(`/interviews/${interviewId}/submit`);
};

const getInterviewResult = (
    interviewId: string
): Promise<AxiosResponse<ApiResponse<IInterviewResult>>> => {
    return api.get(`/interviews/${interviewId}/result`);
};

const getOngoingInterview = (
): Promise<AxiosResponse<ApiResponse<IOngoingInterview | null>>> => {
    return api.get('/interviews/ongoing');
};

const getInterviewHistory = (
    filters: IInterviewHistoryFilters
): Promise<AxiosResponse<ApiResponse<IInterviewHistoryResponse>>> => {
    return api.get('/interviews/history', {
        params: filters
    });
};

const downloadInterviewReport = (interviewId: string): Promise<AxiosResponse<Blob>> => {
    // Blob simply means Some binary file
    // Could be PDF, image. zip, excel etc.
    return api.get(`/interviews/${interviewId}/report`, {
        responseType: "blob"
    });
};

export {
    createInterview,
    getInterview,
    getInterviewQuestion,
    saveInterviewAnswer,
    submitInterview,
    getInterviewResult,
    getOngoingInterview,
    getInterviewHistory,
    downloadInterviewReport
};
