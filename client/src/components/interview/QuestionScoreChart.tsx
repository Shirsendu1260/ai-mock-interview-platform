import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { QuestionScoreChartProps } from '../../types/types.js';
import { COLORS } from '../../constants/design.js';

const QuestionScoreChart = ({ qtnData }: QuestionScoreChartProps) => {
    return (
        <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={qtnData}
                    layout="vertical"
                    margin={{
                        top: 10,
                        right: 30,
                        left: 10,
                        bottom: 10
                    }}
                >
                    {/*Light grid behind bars*/}
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />

                    {/*Score axis*/}
                    <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 13, fill: COLORS.muted }} />

                    {/*Question numbers*/}
                    <YAxis dataKey="question" type="category" tick={{ fontSize: 13, fill: COLORS.muted }} width={45} />

                    {/* Hover tooltip */}
                    <Tooltip/>

                    <Bar dataKey="score" radius={[0, 8, 8, 0]} fill={COLORS.accent} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default QuestionScoreChart;
