import { count } from 'drizzle-orm';
import { PAYMENTS_CREDITS_PAGE_LIMIT } from '../constants.js';

export const calculatePagination = (page: number, totalItems: number) => {
    const totalPages = Math.ceil(totalItems / PAYMENTS_CREDITS_PAGE_LIMIT);

    return {
        page,
        limit: PAYMENTS_CREDITS_PAGE_LIMIT,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
    };
};

export { count };
