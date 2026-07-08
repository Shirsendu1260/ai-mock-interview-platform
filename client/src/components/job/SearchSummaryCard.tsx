import Card from "../ui/Card.jsx";
import type { SearchSummaryCardProps } from "../../types/types.js";

const SearchSummaryCard = ({ searchData }: SearchSummaryCardProps) => {
    return (
        <Card className="space-y-4">
            <div>
                <p className="text-sm text-muted">Detected Role</p>
                <h3 className="text-lg font-semibold text-dark">
                    {searchData.role}
                </h3>
            </div>

            <div>
                <p className="mb-2 text-sm text-muted">Detected Skills</p>
                <div className="flex flex-wrap gap-2">
                    {searchData.skills.map(skill => (
                        <span
                            key={skill}
                            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-sm text-muted">Searching In</p>
                <p className="font-medium text-dark">
                    {
                        searchData.district
                            ? `${searchData.district}, ${searchData.state}, India`
                            : searchData.state
                            ? `${searchData.state}, India`
                            : 'India'
                    }
                </p>
            </div>
        </Card>
    );
};

export default SearchSummaryCard;
