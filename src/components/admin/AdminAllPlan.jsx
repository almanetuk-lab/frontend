// import React, { useState, useEffect } from "react";
// import "../../CSS/AdminPlans.css";
// import axios from "axios";
// //import AddNewPlan from "../../components/adminPlans/AddPlansForm";
// //import EditPlanModal from "../../components/adminPlans/EditPlansModal";
// //import DeleteConfirmModal from "../../components/adminPlans/DeleteConfirmModal";
// import EditPlanModal from "../../components/admin/EditPlansModal";
// import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
// const BASE_URL = "http://localhost:3435/api/admin/plans";
import React, { useState, useEffect } from "react";
import "../../CSS/AdminPlans.css";
import axios from "axios";
// import AddNewPlan from "../../components/adminPlans/AddPlansForm";
import EditPlanModal from "./EditPlansModal";
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
// const BASE_URL = "http://localhost:3435/api/admin/plans";


// export default function AdminPlans({ editingId, setEditingId, plans, setPlans }) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [showDelete, setShowDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);

//     const [formData, setFormData] = useState({
//         name: "",
//         price: 0,
//         duration: 0,
//         video_call_limit: 0,
//         people_search_limit: 0,
//         people_message_limit: 0,
//         audio_call_limit: 0,
//         people_details_visibility: false,
//         type: "",
//     });

//     const fetchPlans = async () => {
//         const res = await axios.get(BASE_URL);
//         setPlans(res.data);
//     };

//     useEffect(() => {
//         fetchPlans();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const openEdit = (plan) => {
//         setFormData(plan);
//         setEditingId(plan.id);
//         setIsOpen(true);
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         await axios.put(`${BASE_URL}/${editingId}`, formData);
//         setIsOpen(false);
//         setEditingId(null);
//         fetchPlans();
//     };

//     const openDelete = (id) => {
//         setDeleteId(id);
//         setShowDelete(true);
//     };

//     const confirmDelete = async () => {
//         await axios.delete(`${BASE_URL}/${deleteId}`);
//         setShowDelete(false);
//         fetchPlans();
//     };

//     return (
//                <>
//             <button className="add-new-plan">Add New Plan</button>

//         <div className="admin-container">

//             {/* Add New Plan */}
//             {/* <AddNewPlan
//                 handleSubmit={handleSubmit}
//                 handleChange={handleChange}
//                 formData={formData}
//                 editingId={editingId}
//                 setEditingId={setEditingId}
//             /> */}

//             {/* All Plans */}
//             <div className="cards-container">
//                 {plans.map((plan) => (
//                     <div key={plan.id} className="plan-card">
//                         <h3>{plan.name} — &#163;{plan.price}</h3>

//                         <ul>
//                             <li>Duration: {plan.duration}</li>
//                             <li>Video Calls: {plan.video_call_limit}</li>
//                             <li>Search Limit: {plan.people_search_limit}</li>
//                             <li>Message Limit: {plan.people_message_limit}</li>
//                             <li>Audio Calls: {plan.audio_call_limit}</li>
//                             <li>Details Visibility: {plan.people_details_visibility}</li>
//                         </ul>

//                         <div className="functional-buttons">
//                             <button className="btn btn-primary" onClick={() => openEdit(plan)}>Edit</button>
//                             <button className="btn btn-danger" onClick={() => openDelete(plan.id)}>Delete</button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {isOpen && (
//                 <EditPlanModal
//                     formData={formData}
//                     handleChange={handleChange}
//                     handleUpdate={handleUpdate}
//                     setIsOpen={setIsOpen}
//                 />
//             )}

//             {showDelete && (
//                 <DeleteConfirmModal
//                     setShowDelete={setShowDelete}
//                     confirmDelete={confirmDelete}
//                 />
//             )}
//         </div>
//         </>
//     );
// }

import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3435/api/admin/plans";

export default function AdminPlans({ editingId, setEditingId, plans, setPlans }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        duration: 0,
        video_call_limit: 0,
        people_search_limit: 0,
        people_message_limit: 0,
        audio_call_limit: 0,
        people_details_visibility: false,
        type: "",
    });

    const fetchPlans = async () => {
        const res = await axios.get(BASE_URL);
        setPlans(res.data);
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openEdit = (plan) => {
        setFormData(plan);
        setEditingId(plan.id);
        setIsOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await axios.put(`${BASE_URL}/${editingId}`, formData);
        setIsOpen(false);
        setEditingId(null);
        fetchPlans();
    };

    const openDelete = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    };

    const confirmDelete = async () => {
        await axios.delete(`${BASE_URL}/${deleteId}`);
        setShowDelete(false);
        fetchPlans();
    };

    let addNewPlanForm = () => {
        navigate("/admin-plans-new");
    }

    return (


        <div className="admin-container">
            <button className="add-new-plan" onClick={addNewPlanForm}>Add New Plan</button>
            {/* Add New Plan */}
            {/* <AddNewPlan
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                formData={formData}
                editingId={editingId}
                setEditingId={setEditingId}
            /> */}

            {/* All Plans */}
            <div className="all-plans-container">
                <div className="cards-container">
                    {plans.map((plan) => (
                        <div key={plan.id} className="plan-card">
                            <h3>{plan.name} — &#163;{plan.price}</h3>

                            <ul>
                                <li>Duration: {plan.duration}</li>
                                <li>Video Calls: {plan.video_call_limit}</li>
                                <li>Search Limit: {plan.people_search_limit}</li>
                                <li>Message Limit: {plan.people_message_limit}</li>
                                <li>Audio Calls: {plan.audio_call_limit}</li>
                                <li>Details Visibility: {plan.people_details_visibility}</li>
                            </ul>

                            <div className="functional-buttons">
                                <button className="btn btn-primary" onClick={() => openEdit(plan)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => openDelete(plan.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                {isOpen && (
                    <EditPlanModal
                        formData={formData}
                        handleChange={handleChange}
                        handleUpdate={handleUpdate}
                        setIsOpen={setIsOpen}
                    />
                )}

                {showDelete && (
                    <DeleteConfirmModal
                        setShowDelete={setShowDelete}
                        confirmDelete={confirmDelete}
                    />
                )}
            </div>
        </div>

    );
}