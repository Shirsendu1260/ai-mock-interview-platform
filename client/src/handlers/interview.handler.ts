import { createInterview } from '../api/interview.api.js';
import { ApiError } from '../utils/ApiError.js';

const createInterviewHandler = async (formData: FormData) => {
    const response = await createInterview(formData); // response is a AxiosResponse

    if(response.data.success) {
        return response.data; // ApiResponse
    }
    else {
        throw new ApiError(response.data.statusCode, response.data.message || 'Something went wrong!');
    }
};

export {
    createInterviewHandler
};
