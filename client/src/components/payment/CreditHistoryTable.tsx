import { PAYMENTS_CREDITS_PAGE_LIMIT } from "../../constants/app";
import type { CreditHistoryTableProps } from "../../types/types";
import Card from "../ui/Card";

const CreditHistoryTable = ({ items, page }: CreditHistoryTableProps) => {
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 text-left">#</th>
                            <th className="text-left">Date</th>
                            <th className="text-left">Credits</th>
                            <th className="text-left">Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            items.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-b last:border-none"
                                >
                                    <td>{(page - 1) * PAYMENTS_CREDITS_PAGE_LIMIT + index + 1}</td>
                                    <td className="py-4">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {
                                            item.type === 'purchase'
                                            ? (
                                                <span>+</span>
                                            )
                                            : (
                                                <span>-</span>
                                            )
                                        }
                                        {item.credits}
                                    </td>
                                    <td>
                                        {
                                            item.type === 'purchase'
                                            ? (
                                                <span
                                                    className="rounded-3xl bg-green-100 px-3 py-1
                                                    text-green-700 text-xs"
                                                >
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                </span>
                                            )
                                            : item.type === 'interview'
                                            ? (
                                                <span
                                                    className="rounded-3xl bg-red-100 px-3 py-1
                                                    text-red-700 text-xs"
                                                >
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                </span>
                                            ) : (
                                                <span
                                                    className="rounded-3xl bg-orange-100 px-3 py-1
                                                    text-orange-700 text-xs"
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
