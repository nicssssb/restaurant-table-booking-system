import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function AddTable() {

    const navigate = useNavigate();

    // =========================================
    // FORM
    // =========================================

    const [form, setForm] = useState({

        tableNumber: "",

        capacity: 2,

        location: "",

        status: "Available"

    });


    const [errors, setErrors] = useState({});


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


        return (
            Object.keys(newErrors).length === 0
        );

    };


    // =========================================
    // SUBMIT
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

            table_number:
                form.tableNumber.trim(),

            capacity:
                Number(form.capacity),

            location:
                form.location.trim(),

            status:
                form.status

        };


        // =====================================
        // CONFIRM
        // =====================================

        const result = await Swal.fire({

            title: "Add Restaurant Table?",

            html: `

                <div
                    style="
                        text-align:left;
                        line-height:1.9;
                    "
                >

                    <strong>
                        Table:
                    </strong>

                    ${form.tableNumber}

                    <br />

                    <strong>
                        Capacity:
                    </strong>

                    ${form.capacity} seats

                    <br />

                    <strong>
                        Location:
                    </strong>

                    ${form.location}

                    <br />

                    <strong>
                        Status:
                    </strong>

                    ${form.status}

                </div>

            `,

            icon: "question",

            showCancelButton: true,

            confirmButtonColor: "#1f6f4a",

            cancelButtonColor: "#6b7280",

            confirmButtonText:
                "Save Table",

            cancelButtonText:
                "Review Again"

        });


        if (!result.isConfirmed) {

            return;

        }


        // =====================================
        // SAVING
        // =====================================

        Swal.fire({

            title: "Saving Table...",

            text: "Please wait.",

            allowOutsideClick: false,

            allowEscapeKey: false,

            didOpen: () => {

                Swal.showLoading();

            }

        });


        try {

            const response =
                await axios.post(

                    "http://localhost/restaurant_reservation_system/server/api/tables/create_table.php",

                    tableData,

                    {
                        headers: {

                            "Content-Type":
                                "application/json"

                        }

                    }

                );


            console.log(
                "Create Table API:",
                response.data
            );


            if (response.data.success) {

                await Swal.fire({

                    title:
                        "Table Added!",

                    text:
                        response.data.message ||
                        "Restaurant table has been successfully added.",

                    icon: "success",

                    confirmButtonColor:
                        "#1f6f4a"

                });


                navigate(
                    "/admin/tables"
                );


                return;

            }


            Swal.fire({

                title:
                    "Failed to Add Table",

                text:
                    response.data.message ||
                    "Unable to save restaurant table.",

                icon: "error",

                confirmButtonColor:
                    "#1f6f4a"

            });


        } catch (error) {

            console.error(
                "Create table error:",
                error
            );


            Swal.fire({

                title:
                    "Server Error",

                text:
                    error.response?.data?.message ||
                    "Unable to connect to the table server.",

                icon: "error",

                confirmButtonColor:
                    "#1f6f4a"

            });

        }

    };


    // =========================================
    // CANCEL
    // =========================================

    const handleCancel = () => {

        navigate(
            "/admin/tables"
        );

    };


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="form-page">


            {/* =====================================
                HEADER
            ===================================== */}

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
                    Add Restaurant Table
                </h1>


                <p>
                    Create a new restaurant table.
                </p>

            </div>


            <form
                className="professional-form"
                onSubmit={handleSubmit}
            >


                {/* =====================================
                    TABLE INFORMATION
                ===================================== */}

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
                                Enter the details of the restaurant table.
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
                                />

                            </div>


                            {errors.tableNumber && (

                                <small className="error-message">

                                    {
                                        errors.tableNumber
                                    }

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
                                />

                            </div>


                            {errors.capacity && (

                                <small className="error-message">

                                    {
                                        errors.capacity
                                    }

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
                                />

                            </div>


                            {errors.location && (

                                <small className="error-message">

                                    {
                                        errors.location
                                    }

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

                                    {
                                        errors.status
                                    }

                                </small>

                            )}

                        </div>

                    </div>

                </div>


                {/* =====================================
                    ACTION BUTTONS
                ===================================== */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleCancel}
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="btn-primary"
                    >

                        <FaSave />

                        Save Table

                    </button>

                </div>

            </form>

        </div>

    );

}

export default AddTable;