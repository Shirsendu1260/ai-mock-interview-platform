import {
    createInterview,
    getInterview,
    getInterviewQuestion,
    saveInterviewAnswer,
    submitInterview,
    getInterviewResult,
    getOngoingInterview,
    getInterviewHistory
} from '../api/interview.api.js';
import type { ICreateInterviewResponse, IInterview, IInterviewHistoryResponse, IInterviewQuestion, IInterviewResult, IOngoingInterview, ISubmitInterviewResponse } from '../types/types.js';
import type { ApiResponse } from '../utils/ApiResponse.js';
import { handleAxiosError } from '../utils/helpers.js';

const createInterviewHandler = async (formData: FormData): Promise<ApiResponse<ICreateInterviewResponse>> => {
    try {
        const response = await createInterview(formData); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const getInterviewHandler = async (interviewId: string): Promise<ApiResponse<IInterview>> => {
    try {
        const response = await getInterview(interviewId); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const getInterviewQuestionHandler = async (
    interviewId: string,
    position: number
): Promise<ApiResponse<IInterviewQuestion>> => {
    try {
        const response = await getInterviewQuestion(interviewId, position); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const saveInterviewAnswerHandler = async (
    interviewId: string,
    position: number,
    answer: string
): Promise<ApiResponse<null>> => {
    try {
        const response = await saveInterviewAnswer(
            interviewId,
            position,
            { answer }
        ); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const submitInterviewHandler = async (interviewId: string): Promise<ApiResponse<ISubmitInterviewResponse>> => {
    try {
        const response = await submitInterview(interviewId); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const getInterviewResultHandler = async (interviewId: string): Promise<ApiResponse<IInterviewResult>> => {
    try {
        const response = await getInterviewResult(interviewId); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const getOngoingInterviewHandler = async (): Promise<ApiResponse<IOngoingInterview | null>> => {
    try {
        const response = await getOngoingInterview(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

const getInterviewHistoryHandler = async (page: number): Promise<ApiResponse<IInterviewHistoryResponse>> => {
    try {
        const response = await getInterviewHistory(page); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        throw handleAxiosError(error);
    }
};

export {
    createInterviewHandler,
    getInterviewHandler,
    getInterviewQuestionHandler,
    saveInterviewAnswerHandler,
    submitInterviewHandler,
    getInterviewResultHandler,
    getOngoingInterviewHandler,
    getInterviewHistoryHandler
};
