import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://backend-q0wc.onrender.com/api/admin/plans";
// import AddNewPlan from ''
import AddNewPlan from "../admin/AddPlanForm";


export default function AdminAddNewPlan() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        duration: 0,
        video_call_limit: 0,
        people_search_limit: 0,
        people_message_limit: 0,
        audio_call_limit: 0,
        type: "",
    });
    const [editingId, setEditingId] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingId) {
            await axios.post(BASE_URL, formData);
        } else {
            setIsOpen(true);
        }

        setFormData({
            name: "",
            price: "",
            duration: "",
            video_call_limit: "",
            people_search_limit: "",
            people_message_limit: "",
            audio_call_limit: "",
            type: "",
        });

        navigate("/admin-dashboard");

        fetchPlans();
    };

    return (
        <>
            <AddNewPlan handleChange={handleChange} handleSubmit={handleSubmit} editingId={editingId} setEditingId={setEditingId} formData={formData} />
        </>
    )
}