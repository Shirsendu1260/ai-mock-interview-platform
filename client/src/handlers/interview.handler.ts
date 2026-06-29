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
import { handleAxiosError } from '../utils/helpers.js';

const createInterviewHandler = async (formData: FormData) => {
    try {
        const response = await createInterview(formData); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const getInterviewHandler = async (interviewId: string) => {
    try {
        const response = await getInterview(interviewId); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const getInterviewQuestionHandler = async (interviewId: string, position: number) => {
    try {
        const response = await getInterviewQuestion(interviewId, position); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const saveInterviewAnswerHandler = async (interviewId: string, position: number, answer: string) => {
    try {
        const response = await saveInterviewAnswer(
            interviewId,
            position,
            { answer }
        ); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const submitInterviewHandler = async (interviewId: string) => {
    try {
        const response = await submitInterview(interviewId); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const getInterviewResultHandler = async (interviewId: string) => {
    try {
        const response = await getInterviewResult(interviewId); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const getOngoingInterviewHandler = async () => {
    try {
        const response = await getOngoingInterview(); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
    }
};

const getInterviewHistoryHandler = async (page: number) => {
    try {
        const response = await getInterviewHistory(page); // response is a AxiosResponse
        return response.data; // ApiResponse
    }
    catch(error) {
        handleAxiosError(error);
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
