import React from "react";

export default function AddNewPlan({ handleSubmit, handleChange, formData, editingId, setEditingId }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mt-10">

            <h3 className="text-2xl font-semibold text-center mb-6">
                {editingId ? "Edit Plan" : "Add New Plan"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                {formData && Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label
                            htmlFor={key}
                            className="block font-semibold mb-1 capitalize"
                        >
                            {key === "duration"
                                ? key.replace(/_/g, " in Months")
                                : key.replace(/_/g, " ")
                            }
                        </label>

                        {/* TYPE SELECT */}
                        {key === "type" ? (
                            <select
                                name="type"
                                id={key}
                                value={formData[key]}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select</option>
                                <option value="Free">Free</option>
                                <option value="Basic">Basic</option>
                                <option value="Advance">Advance</option>
                                <option value="Pro">Pro</option>
                            </select>

                        
                        )  : (
                            <input
                                type={key === "name" ? "text" : "number"}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                id={key}
                                required
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        )}
                    </div>
                ))}

                {/* PRIMARY SUBMIT BUTTON */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition shadow mt-4"
                >
                    {editingId ? "Update Plan" : "Create Plan"}
                </button>

                {/* CANCEL BUTTON (Only in Edit Mode) */}
                {editingId && (
                    <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-medium transition shadow mt-3"
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
}
