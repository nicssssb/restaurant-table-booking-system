import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import {
    FaArrowLeft,
    FaChair,
    FaUsers,
    FaMapMarkerAlt,
    FaSave
} from "react-icons/fa";

import "../../../css/form.css";

function EditTable() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        tableNumber: "",
        capacity: 2,
        location: "",
        status: "Available"
    });

    const [errors, setErrors] = useState({});


    // =========================================
    // LOAD TABLE
    // =========================================

    useEffect(() => {

        const fetchTable = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    `http://localhost/restaurant_reservation_system/server/api/tables/get_table.php?id=${id}`
                );

                console.log(
                    "Get Table API:",
                    response.data
                );

                if (response.data.success) {

                    const table = response.data.data;

                    setForm({
                        tableNumber:
                            table.table_number || "",

                        capacity:
                            table.capacity || 2,

                        location:
                            table.location || "",

                        status:
                            table.status || "Available"
                    });

                } else {

                    Swal.fire({
                        title: "Unable to Load Table",
                        text:
                            response.data.message ||
                            "Table not found.",
                        icon: "error",
                        confirmButtonColor: "#1f6f4a"
                    });

                    navigate("/admin/tables");

                }

            } catch (error) {

                console.error(
                    "Load table error:",
                    error
                );

                Swal.fire({
                    title: "Server Error",
                    text:
                        error.response?.data?.message ||
                        "Unable to load table.",
                    icon: "error",
                    confirmButtonColor: "#1f6f4a"
                });

                navigate("/admin/tables");

            } finally {

                setLoading(false);

            }

        };


        if (id) {
            fetchTable();
        }

    }, [id, navigate]);


    // =========================================
    // INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

    };


    // =========================================
    // VALIDATION
    // =========================================

    const validateForm = () => {

        const newErrors = {};

        if (!form.tableNumber.trim()) {

            newErrors.tableNumber =
                "Please enter a table number.";

        }

        if (
            !form.capacity ||
            Number(form.capacity) < 1
        ) {

            newErrors.capacity =
                "Capacity must be at least 1.";

        }

        if (!form.location.trim()) {

            newErrors.location =
                "Please enter the table location.";

        }

        if (!form.status) {

            newErrors.status =
                "Please select a table status.";

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };


    // =========================================
    // UPDATE TABLE
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            Swal.fire({
                title: "Incomplete Form",
                text:
                    "Please complete all required fields.",
                icon: "warning",
                confirmButtonColor: "#1f6f4a"
            });

            return;

        }


        const tableData = {

            table_id: Number(id),

            table_number:
                form.tableNumber.trim(),

            capacity:
                Number(form.capacity),

            location:
                form.location.trim(),

            status:
                form.status

        };


        const result = await Swal.fire({

            title: "Update Table?",

            html: `
                <div style="text-align:left; line-height:1.9">

                    <strong>Table:</strong>
                    ${form.tableNumber}

                    <br />

                    <strong>Capacity:</strong>
                    ${form.capacity} seats

                    <br />

                    <strong>Location:</strong>
                    ${form.location}

                    <br />

                    <strong>Status:</strong>
                    ${form.status}

                </div>
            `,

            icon: "question",

            showCancelButton: true,

            confirmButtonColor: "#1f6f4a",

            cancelButtonColor: "#6b7280",

            confirmButtonText: "Update Table",

            cancelButtonText: "Review Again"

        });


        if (!result.isConfirmed) {
            return;
        }


        try {

            setSaving(true);

            Swal.fire({
                title: "Updating Table...",
                text: "Please wait.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });


            const response = await axios.post(
                "http://localhost/restaurant_reservation_system/server/api/tables/update_table.php",
                tableData,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


            console.log(
                "Update Table API:",
                response.data
            );


            if (response.data.success) {

                await Swal.fire({
                    title: "Table Updated!",
                    text:
                        response.data.message ||
                        "Table has been updated successfully.",
                    icon: "success",
                    confirmButtonColor: "#1f6f4a"
                });

                navigate("/admin/tables");

                return;

            }


            Swal.fire({
                title: "Update Failed",
                text:
                    response.data.message ||
                    "Unable to update table.",
                icon: "error",
                confirmButtonColor: "#1f6f4a"
            });

        } catch (error) {

            console.error(
                "Update table error:",
                error
            );

            Swal.fire({
                title: "Server Error",
                text:
                    error.response?.data?.message ||
                    "Unable to update table.",
                icon: "error",
                confirmButtonColor: "#1f6f4a"
            });

        } finally {

            setSaving(false);

        }

    };


    // =========================================
    // CANCEL
    // =========================================

    const handleCancel = () => {

        navigate("/admin/tables");

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="form-page">

                <div className="table-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading table...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="form-page">

            <div className="form-page-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={handleCancel}
                >

                    <FaArrowLeft />

                    Back to Tables

                </button>

                <h1>
                    Edit Restaurant Table
                </h1>

                <p>
                    Update the restaurant table information.
                </p>

            </div>


            <form
                className="professional-form"
                onSubmit={handleSubmit}
            >

                <div className="form-section">

                    <div className="form-section-header">

                        <div className="section-icon">
                            <FaChair />
                        </div>

                        <div>

                            <h2>
                                Table Information
                            </h2>

                            <p>
                                Update the details of this restaurant table.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        {/* TABLE NUMBER */}

                        <div className="form-group">

                            <label>
                                Table Number <span>*</span>
                            </label>

                            <div className="input-icon-wrapper">

                                <FaChair />

                                <input
                                    type="text"
                                    name="tableNumber"
                                    value={
                                        form.tableNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: T-01"
                                    disabled={saving}
                                />

                            </div>

                            {errors.tableNumber && (

                                <small className="error-message">
                                    {errors.tableNumber}
                                </small>

                            )}

                        </div>


                        {/* CAPACITY */}

                        <div className="form-group">

                            <label>
                                Capacity <span>*</span>
                            </label>

                            <div className="input-icon-wrapper">

                                <FaUsers />

                                <input
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    max="50"
                                    value={
                                        form.capacity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                />

                            </div>

                            {errors.capacity && (

                                <small className="error-message">
                                    {errors.capacity}
                                </small>

                            )}

                        </div>


                        {/* LOCATION */}

                        <div className="form-group">

                            <label>
                                Location <span>*</span>
                            </label>

                            <div className="input-icon-wrapper">

                                <FaMapMarkerAlt />

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        form.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Indoor, Garden, Patio"
                                    disabled={saving}
                                />

                            </div>

                            {errors.location && (

                                <small className="error-message">
                                    {errors.location}
                                </small>

                            )}

                        </div>


                        {/* STATUS */}

                        <div className="form-group">

                            <label>
                                Status <span>*</span>
                            </label>

                            <select
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={saving}
                            >

                                <option value="Available">
                                    Available
                                </option>

                                <option value="Reserved">
                                    Reserved
                                </option>

                                <option value="Occupied">
                                    Occupied
                                </option>

                                <option value="Maintenance">
                                    Maintenance
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                            {errors.status && (

                                <small className="error-message">
                                    {errors.status}
                                </small>

                            )}

                        </div>

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={saving}
                    >

                        <FaSave />

                        {saving
                            ? "Updating..."
                            : "Update Table"}

                    </button>

                </div>

            </form>

        </div>

    );

}

export default EditTable;