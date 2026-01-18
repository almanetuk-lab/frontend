import { useState } from "react";

const DateRangePicker = ({ onGenerate }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleGenerateClick = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
      return;
    }
    // Parent function ko dates pass karein
    onGenerate(fromDate, toDate);
  };

  return (
    <div className="flex gap-4 items-end bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleGenerateClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded h-10 mb-[1px]"
      >
        Generate Report
      </button>
    </div>
  );
};

export default DateRangePicker;