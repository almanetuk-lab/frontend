
// import React from "react";

// const DateRangePicker = ({
//   fromDate,
//   toDate,
//   setFromDate,
//   setToDate,
//   onGenerate,
// }) => {
//   return (
//     <div className="flex gap-4 items-end bg-white p-4 rounded shadow">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           From
//         </label>
//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           className="border p-2 rounded"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           To
//         </label>
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           className="border p-2 rounded"
//         />
//       </div>

//       <button
//         onClick={onGenerate}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded h-10"
//       >
//         Generate Report
//       </button>
//     </div>
//   );
// };

// export default DateRangePicker;

import React from "react";

const DateRangePicker = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onGenerate,
}) => {
  return (
    <div className="flex gap-4 items-end bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* ✅ type="button" added (prevents accidental form-submit refresh) */}
      <button
        type="button"
        onClick={onGenerate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded h-10"
      >
        Generate Report
      </button>
    </div>
  );
};

export default DateRangePicker;