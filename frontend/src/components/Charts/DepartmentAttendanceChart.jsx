import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

const DepartmentAttendanceBarChart = ({ data }) => {
    return (
        <div>
            <h3 className="text-(--text-secondary) text-2xl font-medium ml-2 mb-3">
                Department-wise Attendance (Today)
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DepartmentAttendanceBarChart;
