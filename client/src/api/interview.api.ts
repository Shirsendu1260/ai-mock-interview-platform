import { api } from './axios.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import type { AxiosResponse } from 'axios';
import type { ICreateInterviewResponse } from '../types/types.js';

const createInterview = (formData: FormData): Promise<AxiosResponse<ApiResponse<ICreateInterviewResponse>>> => {
    return api.post('/interviews/create', formData);
};

export {
    createInterview
};
