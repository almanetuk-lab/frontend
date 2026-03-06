


// src/components/settings/SubscriptionSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentHistory from "../../components/cart/PaymentHistory";

export default function SubscriptionSettings({ userData }) {
  const navigate = useNavigate();
  const [planStatus, setPlanStatus] = useState({
    loading: true,
    active: false,
    daysLeft: 0,
    planName: "",
    startDate: null,
    endDate: null,
    amount: 0,
    currency: "INR"
  });
  
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch current plan details
  useEffect(() => {
    const fetchPlanStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const user_id = localStorage.getItem("user_id");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";
        
        // Fetch current plan status
        const planRes = await fetch(`${API_BASE_URL}/api/me/plan-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const planData = await planRes.json();

        // Fetch latest payment for plan details
        const paymentRes = await fetch(`${API_BASE_URL}/payments/${user_id}`);
        const paymentData = await paymentRes.json();
        
        // Get the most recent successful payment
        const latestPayment = paymentData?.find(p => p.status === "success") || null;

        setPlanStatus({
          loading: false,
          active: !!planData?.active,
          daysLeft: planData?.days_left || 0,
          planName: latestPayment?.plan_name || (planData?.active ? "Premium Plan" : "Free Plan"),
          startDate: latestPayment?.created_at ? new Date(latestPayment.created_at) : null,
          endDate: latestPayment?.end_date ? new Date(latestPayment.end_date) : null,
          amount: latestPayment?.amount || 0,
          currency: latestPayment?.currency || "INR"
        });

        // Set billing history from payments
        setBillingHistory(paymentData || []);
        setLoadingHistory(false);
        
      } catch (error) {
        console.error("Error fetching plan data:", error);
        setPlanStatus({ 
          loading: false, 
          active: false, 
          daysLeft: 0,
          planName: "Free Plan",
          startDate: null,
          endDate: null,
          amount: 0,
          currency: "INR"
        });
        setLoadingHistory(false);
      }
    };

    fetchPlanStatus();
  }, []);

  // Format date function
  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Get status color based on days left
  const getStatusColor = (daysLeft) => {
    if (daysLeft <= 3) return "bg-orange-50 text-orange-700 border-orange-200";
    if (daysLeft <= 7) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  // Loader Component with light blue theme
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        {/* Spinner */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-blue-600">Loading subscription details...</p>
        <p className="text-sm text-blue-400 mt-1">Please wait a moment</p>
      </div>
      {/* Progress bar */}
      <div className="w-48 h-2 bg-blue-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-400 animate-progress"></div>
      </div>
    </div>
  );

  if (planStatus.loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header with icon */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-50 rounded-xl">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subscription & Plans</h2>
          <p className="text-sm text-gray-500">Manage your subscription and view billing history</p>
        </div>
      </div>

      {/* Current Plan Status Banner - More subtle */}
      <div className="mb-6">
        <div
          className={`p-4 rounded-xl border ${
            planStatus.active 
              ? getStatusColor(planStatus.daysLeft)
              : "bg-gray-50 text-gray-700 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {planStatus.active ? (
                <>
                  <div className="p-2 bg-white rounded-full">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Active Plan</p>
                    <p className="text-sm opacity-80">{planStatus.daysLeft} days remaining</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-white rounded-full">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Plan Expired</p>
                    <p className="text-sm opacity-80">Upgrade to continue using premium features</p>
                  </div>
                </>
              )}
            </div>
            {planStatus.active && (
              <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-medium">
                {planStatus.daysLeft} days left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Plan Details Card - Light blue gradient */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 mb-8 border border-blue-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Current Plan</span>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{planStatus.planName}</h3>
          </div>
          <button
            onClick={() => navigate("/dashboard/plans")}
            className="px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm border border-blue-200"
          >
            {planStatus.active ? "Change Plan" : "Upgrade Now"}
          </button>
        </div>
        
        {planStatus.active && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Start Date</span>
              </div>
              <p className="text-gray-800 font-semibold">{formatDate(planStatus.startDate)}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">End Date</span>
              </div>
              <p className="text-gray-800 font-semibold">{formatDate(planStatus.endDate)}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Days Left</span>
              </div>
              <p className="text-gray-800 font-semibold">{planStatus.daysLeft} days</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Amount Paid</span>
              </div>
              <p className="text-gray-800 font-semibold">₹{planStatus.amount} {planStatus.currency}</p>
            </div>
          </div>
        )}
      </div>

      {/* Billing History with View All Button - Light design */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="font-medium text-gray-700">Billing History</h3>
          </div>
          <button
            onClick={() => setShowPaymentHistory(true)}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <div className="relative">
                <div className="w-8 h-8 border-3 border-blue-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : billingHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-3 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No billing history yet</p>
              <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Plan</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    {/* <th className="pb-3 font-medium">Invoice</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {billingHistory.slice(0, 3).map((payment) => (
                    <tr key={payment.id} className="text-sm">
                      <td className="py-3 text-gray-600">
                        {new Date(payment.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-gray-800">{payment.plan_name}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-gray-800">₹{payment.amount}</span>
                        <span className="text-gray-400 text-xs ml-1">{payment.currency}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === "success"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            payment.status === "success" ? "bg-green-500" : "bg-red-500"
                          }`}></span>
                          {payment.status === "success" ? "Paid" : "Failed"}
                        </span>
                      </td>
                      <td className="py-3">
                        {payment.status === "success" && (
                          <button className="text-blue-500 hover:text-blue-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /> */}
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment History Modal */}
      {showPaymentHistory && (
        <PaymentHistory onClose={() => setShowPaymentHistory(false)} />
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}





