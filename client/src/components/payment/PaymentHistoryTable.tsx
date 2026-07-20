import { PAYMENTS_CREDITS_PAGE_LIMIT } from "../../constants/app";
import type { PaymentHistoryTableProps } from "../../types/types";
import Card from "../ui/Card";

const PaymentHistoryTable = ({ items, page }: PaymentHistoryTableProps) => {
    return (
        <Card className="mt-6">
            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr className="bg-background">
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                #
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Receipt ID
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Plan
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Amount
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {
                            items.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-primary/5"
                                >
                                    <td className="px-4 py-3 text-sm text-muted">
                                        {(page - 1) * PAYMENTS_CREDITS_PAGE_LIMIT + index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark">
                                        {item.receipt}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark">
                                        {new Date(item.createdAt).toLocaleString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium capitalize text-dark">
                                        {item.plan}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-dark">
                                        ₹{(item.amount / 100).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {
                                            item.status === 'paid'
                                            ? (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1
                                                    text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-500/20"
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            )
                                            : item.status === 'failed'
                                            ? (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1
                                                    text-xs font-medium text-red-700 ring-1 ring-inset ring-red-500/20"
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            ) : (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1
                                                    text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-500/20"
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default PaymentHistoryTable;
