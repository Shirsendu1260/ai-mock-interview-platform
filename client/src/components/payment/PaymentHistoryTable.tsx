import { PAYMENTS_CREDITS_PAGE_LIMIT } from "../../constants/app";
import type { PaymentHistoryTableProps } from "../../types/types";
import Card from "../ui/Card";

const PaymentHistoryTable = ({ items, page }: PaymentHistoryTableProps) => {
    return (
        <Card className="mt-6">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                #
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Plan
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Amount
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {
                            items.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-500">
                                        {(page - 1) * PAYMENTS_CREDITS_PAGE_LIMIT + index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700">
                                        {new Date(item.createdAt).toLocaleString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium capitalize text-slate-900">
                                        {item.plan}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        ₹{item.amount}
                                    </td>
                                    <td className="px-4 py-3">
                                        {
                                            item.status === 'paid'
                                            ? (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1
                                                    text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            )
                                            : item.status === 'failed'
                                            ? (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1
                                                    text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200"
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            ) : (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1
                                                    text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200"
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
