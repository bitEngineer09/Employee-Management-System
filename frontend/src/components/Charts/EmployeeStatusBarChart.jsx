import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const EmployeeStatusBarChart = ({ data }) => {
  return (
    <div>
      <h3 className="text-(--text-secondary) text-2xl ml-2 font-medium mb-3">Employee Status Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />

          <Bar
            dataKey="value"
            barSize={70}
            radius={[6, 6, 0, 0]}
          >
            <Cell fill="#4f46e5" />
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
            <Cell fill="#f59e0b" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeStatusBarChart;
