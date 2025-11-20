import React from "react";

export default function EditPlanModal({
  formData,
  handleChange,
  handleUpdate,
  setIsOpen,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-5 overflow-y-auto">
      <div className="bg-white w-[400px] max-w-[90%] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 animate-[fadeIn_0.3s_ease]">
        <h3 className="text-center text-xl font-semibold mb-5">Edit Plan</h3>

        <form onSubmit={handleUpdate}>
          {Object.keys(formData).filter(key => key !== "created_at" && key !== "updated_at" && key !== "id")
          .map((key) => ( 

            <div key={key} className="flex flex-col">
              <label
                htmlFor={key}
                className="text-sm font-semibold text-gray-700 mb-1 capitalize"
              >
                {key.replaceAll("_", " ")}
              </label>

              {key === "type" ? (
                <select
                  name="type"
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  <option value="Free">Free</option>
                  <option value="Basic">Basic</option>
                  <option value="Advance">Advance</option>
                  <option value="Pro">Pro</option>
                </select>
              ) : key === "people_details_visibility" ? (
                <select
                  name="people_details_visibility"
                  id={key}
                  value={
                    formData[key] === true || formData[key] === "true"
                      ? "true"
                      : "false"
                  }
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              ) : (
                <input
                  type={key === "name" ? "text" : "number"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  id={key}
                  required
                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                />
              )}
            </div>
          ))}

          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition shadow"
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-medium transition shadow"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
