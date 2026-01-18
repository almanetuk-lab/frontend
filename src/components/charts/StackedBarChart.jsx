// src/components/Charts/StackedBarChart.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Plan ke liye alag alag colors
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

const StackedBarChart = ({ data, title }) => {
  // Data me se saare unique plan names nikalne padenge keys ke liye
  // Example data row: { label: "Jan", Basic: 10, Premium: 5 }
  // Keys will be ["Basic", "Premium"]
  
  if (!data || data.length === 0) return null;

  const dataKeys = Object.keys(data[0]).filter(key => key !== "label");

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h3 className="font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            
            {/* Har Plan ke liye ek Bar component banega */}
            {dataKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                stackId="a" // stackId same hone se ye ek ke upar ek aayenge
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChart;