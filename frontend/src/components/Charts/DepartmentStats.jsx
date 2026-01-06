import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const DepartmentStats = ({ data }) => {

    return (
        <div>
            <h3 className="text-(--text-secondary) text-2xl font-medium ml-10 mb-3">Employees by Department</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="department" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="employees" fill="#6E026F" radius={[6,6,0,0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DepartmentStats;
