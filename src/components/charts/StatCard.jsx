const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default StatCard;
