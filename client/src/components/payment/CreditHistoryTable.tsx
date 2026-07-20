import { PAYMENTS_CREDITS_PAGE_LIMIT } from "../../constants/app";
import type { CreditHistoryTableProps } from "../../types/types";
import Card from "../ui/Card";

const CreditHistoryTable = ({ items, page }: CreditHistoryTableProps) => {
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
                                Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Credits
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Type
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
                                        {new Date(item.createdAt).toLocaleString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold">
                                        {
                                            item.type === 'purchase'
                                            ? (
                                                <span className="text-emerald-600">+</span>
                                            )
                                            : (
                                                <span className="text-red-600">-</span>
                                            )
                                        }
                                        <span className="text-dark">{item.credits}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {
                                            item.type === 'purchase'
                                            ? (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1
                                                    text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-500/20"
                                                >
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                </span>
                                            )
                                            : item.type === 'interview'
                                            ? (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1
                                                    text-xs font-medium text-red-700 ring-1 ring-inset ring-red-500/20"
                                                >
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                </span>
                                            ) : (
                                                <span
                                                    className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1
                                                    text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-500/20"
                                                >
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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

export default CreditHistoryTable;
