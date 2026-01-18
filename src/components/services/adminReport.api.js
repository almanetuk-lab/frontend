import axios from "axios";


const API_URL = "https://backend-q0wc.onrender.com/api/admin/reports";

export const fetchAdminReport = async (fromDate, toDate, groupBy) => {
  const response = await axios.get(API_URL, {
    params: {
      fromDate: fromDate,
      toDate: toDate,
      groupBy, // week | month
    },
  });

  return response.data;
};

