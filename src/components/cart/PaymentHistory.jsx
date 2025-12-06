import React, { useEffect, useState, useRef } from "react";

export default function PaymentHistory({ onClose }) {
  const [history, setHistory] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // Load 2 at a time

  const modalRef = useRef(null); // ⭐ Reference for outside click detection

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        const res = await fetch(`https://backend-q0wc.onrender.com/payments/${user_id}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };

    fetchHistory();
  }, []);

  // ⭐ Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onClose) onClose(); // call parent function to close modal
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
    >
      <div
        ref={modalRef} // ⭐ This tracks the modal box
        className="bg-white w-[400px] p-6 rounded shadow-lg relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-2xl font-bold text-gray-500"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Payment History</h2>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {history.length === 0 && <p>No payment history yet.</p>}

          {history.slice(0, visibleCount).map((p) => (
            <div
              key={p.id}
              className={`p-4 border rounded ${
                p.status === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p>
                <strong>Plan:</strong> {p.plan_name}
              </p>
              <p>
                <strong>Amount:</strong> £{p.amount} {p.currency}
              </p>
              <p>
                <strong>Status:</strong> {p.status}
              </p>
              <p>
  <strong>Date:</strong>{" "}
  {new Date(p.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  })}
</p>

            </div>
          ))}

          {visibleCount < history.length && (
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
