import { api } from './axios.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import type { AxiosResponse } from 'axios';
import type { CreateInterviewResponse } from '../types/types.js';

const createInterview = (formData: FormData): Promise<AxiosResponse<ApiResponse<CreateInterviewResponse>>> => {
    return api.post('/interviews/create', formData);
};

export {
    createInterview
};
