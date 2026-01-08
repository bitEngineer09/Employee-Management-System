import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const AttendanceSummaryPieChart = ({ data, header }) => {

    const COLORS = [
        "#22c55e", // present
        "#ef4444", // absent
        "#f59e0b", // leave
    ];

    return (
        <div>
            <h3 className="text-(--text-secondary) text-2xl ml-2 mb-3 font-medium">
                {header}
            </h3>

            <div className="flex items-center">
                <ResponsiveContainer width="50%" height={240}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            paddingAngle={2}
                            cornerRadius={2}
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Right Side Numbers (Image style) */}
                <div className="w-1/2 space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index] }}
                                />
                                <span className="text-(--text-secondary)">
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-white font-semibold">
                                {item.value || 0}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendanceSummaryPieChart;
