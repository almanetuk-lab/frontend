import React from "react";
import "../../CSS/EditPlanModal.css";

export default function DeleteConfirmModal({ setShowDelete, confirmDelete }) {
    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-card">

                <h3>Are you sure to delete?</h3>

                <div className="modal-buttons">
                    <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
                    <button className="btn btn-primary" onClick={() => setShowDelete(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
