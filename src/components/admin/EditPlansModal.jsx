import React from "react";
import "../../CSS/EditPlanModal.css";

export default function EditPlanModal({ formData, handleChange, handleUpdate, setIsOpen }) {
    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-card">

                <h3>Edit Plan</h3>

                <form onSubmit={handleUpdate}>
                    {Object.keys(formData).map((key) => (
                        <div key={key}>
                            <label>{key.replace(/_/g, " ")}</label>

                            {key === "type" ? (
                                <select value={formData[key]} onChange={handleChange} name={key}>
                                    <option value="Free">Free</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Advance">Advance</option>
                                    <option value="Pro">Pro</option>
                                </select>
                            ) : (
                                <input
                                    value={
                                        key === "created_at" || key === "updated_at"
                                            ? new Date(formData[key]).toLocaleDateString("en-GB")
                                            : formData[key]
                                    }
                                    name={key}
                                    onChange={handleChange}
                                    disabled={key === "created_at" || key === "updated_at" || key === "id"}
                                />
                            )}
                        </div>
                    ))}

                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary">Update</button>
                        <button type="button" className="btn btn-danger" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </form>

            </div>
        </div>
    );
}

