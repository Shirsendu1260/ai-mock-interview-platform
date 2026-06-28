import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../utils/ApiResponse.js";
import type { DashboardStatsResponse, IInterviewHistory } from "../types/types.js";
import { api } from "./axios";

const getRecentInterviews = (): Promise<AxiosResponse<ApiResponse<IInterviewHistory[]>>> => {
    return api.get('/dashboard/recent-interviews');
}

const getDashboardStats = (): Promise<AxiosResponse<ApiResponse<DashboardStatsResponse>>> => {
    return api.get('/dashboard/stats');
}

export { getRecentInterviews, getDashboardStats };
