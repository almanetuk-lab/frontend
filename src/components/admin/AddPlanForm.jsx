import React from "react";

export default function AddNewPlan({ handleSubmit, handleChange, formData, editingId, setEditingId }) {
    return (
        <div className="form-card">
            <h3>{editingId ? "Edit Plan" : "Add New Plan"}</h3>

            <form onSubmit={handleSubmit}>
                {formData && Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label htmlFor={key}>{key === "duration" ? key.replace(/_/g, " in Months") : key.replace(/_/g, " ")}</label>
                        {key === "type" ? (
                            <select name="type" id={key} value={formData[key]} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="Free">Free</option>
                                <option value="Basic">Basic</option>
                                <option value="Advance">Advance</option>
                                <option value="Pro">Pro</option>
                            </select>
                        ) :
                            key === "people_details_visibility" ? (
                                <select name="people_details_visibility" id={key} value={formData[key]} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="1">Visible</option>
                                    <option value="0">Hidden</option>
                                </select>
                            ) : (
                                <input
                                    type={key === "name" ? "text" : "number"}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    id={key}
                                    required
                                />
                            )}
                    </div>
                ))}

                <button type="submit">{editingId ? "Update Plan" : "Create Plan"}</button>

                {editingId && (
                    <button type="button" onClick={() => setEditingId(null)}>
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
}