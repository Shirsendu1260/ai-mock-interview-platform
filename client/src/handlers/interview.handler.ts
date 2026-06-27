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
import { ApiError } from '../utils/ApiError.js';

const createInterviewHandler = async (formData: FormData) => {
    const response = await createInterview(formData); // response is a AxiosResponse

    if(response.data.success) {
        return response.data; // ApiResponse
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to create interview.'
        );
    }
};

const getInterviewHandler = async (interviewId: string) => {
    const response = await getInterview(interviewId);

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to fetch interview.'
        );
    }
};

const getInterviewQuestionHandler = async (interviewId: string, position: number) => {
    const response = await getInterviewQuestion(interviewId, position);

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to fetch question.'
        );
    }
};

const saveInterviewAnswerHandler = async (interviewId: string, position: number, answer: string) => {
    const response = await saveInterviewAnswer(interviewId, position, { answer });

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to save answer.'
        );
    }
};

const submitInterviewHandler = async (interviewId: string) => {
    const response = await submitInterview(interviewId);

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to submit interview.'
        );
    }
};

const getInterviewResultHandler = async (interviewId: string) => {
    const response = await getInterviewResult(interviewId);

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to fetch result.'
        );
    }
};

const getOngoingInterviewHandler = async () => {
    const response = await getOngoingInterview();

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to fetch ongoing interview.'
        );
    }
};

const getInterviewHistoryHandler = async (page: number) => {
    const response = await getInterviewHistory(page);

    if(response.data.success) {
        return response.data;
    }
    else {
        throw new ApiError(
            response.data.statusCode,
            response.data.message || 'Failed to fetch interview history.'
        );
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
