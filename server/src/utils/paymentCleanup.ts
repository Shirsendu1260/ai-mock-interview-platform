import { db } from "../config/db.js";
import { and, eq, lt } from "drizzle-orm";
import { payments } from "../db/schema/payments.js";

export const cleanupExpiredCreatedPayments = async () => {
    // Get the date/time from 24 hrs ago
    const time24HrsAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await db.delete(payments)
                            .where(and(
                                eq(payments.status, 'created'), // payments only created
                                lt(payments.createdAt, time24HrsAgo) // older/less than 24 hrs
                            ));

    console.log(`Deleted ${result.rowCount} expired payments.`);
};
