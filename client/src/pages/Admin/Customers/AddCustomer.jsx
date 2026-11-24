import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import {
    FaArrowLeft,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaSave
} from "react-icons/fa";

import "../../../css/form.css";

function AddCustomer() {

    const navigate = useNavigate();


    // =========================================
    // FORM
    // =========================================

    const [form, setForm] = useState({

        full_name: "",

        contact_number: "",

        email: "",

        address: ""

    });


    // =========================================
    // ERRORS
    // =========================================

    const [errors, setErrors] = useState({});


    // =========================================
    // HANDLE CHANGE
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


        // FULL NAME

        if (!form.full_name.trim()) {

            newErrors.full_name =
                "Please enter the customer's full name.";

        } else if (
            form.full_name.trim().length < 2
        ) {

            newErrors.full_name =
                "Customer name must be at least 2 characters.";

        }


        // CONTACT

        if (!form.contact_number.trim()) {

            newErrors.contact_number =
                "Please enter the contact number.";

        }


        // EMAIL

        if (!form.email.trim()) {

            newErrors.email =
                "Please enter the email address.";

        } else {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    form.email.trim()
                )
            ) {

                newErrors.email =
                    "Please enter a valid email address.";

            }

        }


        // ADDRESS

        if (!form.address.trim()) {

            newErrors.address =
                "Please enter the customer's address.";

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


        // VALIDATE

        if (!validateForm()) {

            Swal.fire({

                title:
                    "Incomplete Customer Information",

                text:
                    "Please complete all required fields.",

                icon:
                    "warning",

                confirmButtonColor:
                    "#1f6f4a"

            });

            return;

        }

// =========================================
// PAYMENT METHOD
// =========================================

const paymentResult = await Swal.fire({

    title: "Payment",

    html: `
        <div style="text-align:left;">

            <p style="
                margin-bottom:15px;
                color:#666;
            ">
                Please select a payment method before
                confirming the reservation.
            </p>

            <label style="
                display:block;
                font-weight:600;
                margin-bottom:8px;
            ">
                Payment Method
            </label>

            <select
                id="paymentMethod"
                class="swal2-input"
                style="width:90%;"
            >

                <option value="">
                    Select payment method
                </option>

                <option value="GCash">
                    GCash
                </option>

                <option value="Credit/Debit Card">
                    Credit / Debit Card
                </option>

                <option value="Cash">
                    Cash
                </option>

            </select>

        </div>
    `,

    showCancelButton: true,

    confirmButtonText:
        "Proceed to Payment",

    cancelButtonText:
        "Cancel",

    confirmButtonColor:
        "#1f6f4a",

    preConfirm: () => {

        const method =
            document.getElementById(
                "paymentMethod"
            ).value;

        if (!method) {

            Swal.showValidationMessage(
                "Please select a payment method."
            );

            return false;
        }

        return method;

    }

});


if (!paymentResult.isConfirmed) {

    return;

}


const paymentMethod =
    paymentResult.value;
    
        // =====================================
        // CONFIRM
        // =====================================

        const result =
            await Swal.fire({

                title:
                    "Add Customer?",

                html: `

                    <div
                        style="
                            text-align:left;
                            line-height:1.9;
                        "
                    >

                        <strong>
                            Name:
                        </strong>

                        ${form.full_name}

                        <br />

                        <strong>
                            Contact:
                        </strong>

                        ${form.contact_number}

                        <br />

                        <strong>
                            Email:
                        </strong>

                        ${form.email}

                        <br />

                        <strong>
                            Address:
                        </strong>

                        ${form.address}

                    </div>

                `,

                icon:
                    "question",

                showCancelButton:
                    true,

                confirmButtonColor:
                    "#1f6f4a",

                cancelButtonColor:
                    "#6b7280",

                confirmButtonText:
                    "Save Customer",

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

            title:
                "Saving Customer...",

            text:
                "Please wait.",

            allowOutsideClick:
                false,

            allowEscapeKey:
                false,

            didOpen: () => {

                Swal.showLoading();

            }

        });


        try {

            // =================================
            // DATA
            // =================================

            const customerData = {

                full_name:
                    form.full_name.trim(),

                contact_number:
                    form.contact_number.trim(),

                email:
                    form.email.trim(),

                address:
                    form.address.trim()

            };


            console.log(
                "Sending customer:",
                customerData
            );


            // =================================
            // API
            // =================================

            const response =
                await axios.post(

                    "http://localhost/restaurant_reservation_system/server/api/customers/create_customer.php",

                    customerData,

                    {

                        headers: {

                            "Content-Type":
                                "application/json"

                        }

                    }

                );


            console.log(
                "Customer API Response:",
                response.data
            );


            // =================================
            // SUCCESS
            // =================================

            if (
                response.data.success
            ) {

                await Swal.fire({

                    title:
                        "Customer Added!",

                    text:
                        response.data.message ||
                        "Customer has been successfully added.",

                    icon:
                        "success",

                    confirmButtonColor:
                        "#1f6f4a"

                });


                navigate(
                    "/admin/customers"
                );


                return;

            }


            // =================================
            // API ERROR
            // =================================

            Swal.fire({

                title:
                    "Unable to Add Customer",

                text:
                    response.data.message ||
                    "Failed to create customer.",

                icon:
                    "error",

                confirmButtonColor:
                    "#1f6f4a"

            });


        } catch (error) {

            console.error(
                "Add customer error:",
                error
            );


            // =================================
            // DUPLICATE
            // =================================

            if (
                error.response &&
                error.response.status === 409
            ) {

                Swal.fire({

                    title:
                        "Customer Already Exists",

                    text:
                        error.response.data.message ||
                        "A customer with the same information already exists.",

                    icon:
                        "warning",

                    confirmButtonColor:
                        "#1f6f4a"

                });


                return;

            }


            // =================================
            // VALIDATION ERROR
            // =================================

            if (
                error.response &&
                error.response.status === 400
            ) {

                Swal.fire({

                    title:
                        "Invalid Customer Information",

                    text:
                        error.response.data.message ||
                        "Please check the customer information.",

                    icon:
                        "warning",

                    confirmButtonColor:
                        "#1f6f4a"

                });


                return;

            }


            // =================================
            // SERVER ERROR
            // =================================

            Swal.fire({

                title:
                    "Server Error",

                text:
                    error.response?.data?.message ||
                    "Unable to connect to the customer server.",

                icon:
                    "error",

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
            "/admin/customers"
        );

    };


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="form-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="form-page-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={handleCancel}
                >

                    <FaArrowLeft />

                    Back to Customers

                </button>


                <h1>
                    Add Customer
                </h1>


                <p>
                    Add a new restaurant customer.
                </p>

            </div>


            {/* =================================
                FORM
            ================================= */}

            <form
                className="professional-form"
                onSubmit={handleSubmit}
            >


                {/* =================================
                    CUSTOMER INFORMATION
                ================================= */}

                <div className="form-section">

                    <div className="form-section-header">

                        <div className="section-icon">

                            <FaUser />

                        </div>


                        <div>

                            <h2>
                                Customer Information
                            </h2>

                            <p>
                                Enter the customer's basic information.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        {/* FULL NAME */}

                        <div className="form-group">

                            <label>
                                Full Name <span>*</span>
                            </label>


                            <div className="input-icon-wrapper">

                                <FaUser />


                                <input
                                    type="text"
                                    name="full_name"
                                    value={
                                        form.full_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter full name"
                                />

                            </div>


                            {errors.full_name && (

                                <small className="error-message">

                                    {
                                        errors.full_name
                                    }

                                </small>

                            )}

                        </div>


                        {/* CONTACT */}

                        <div className="form-group">

                            <label>
                                Contact Number <span>*</span>
                            </label>


                            <div className="input-icon-wrapper">

                                <FaPhone />


                                <input
                                    type="text"
                                    name="contact_number"
                                    value={
                                        form.contact_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter contact number"
                                />

                            </div>


                            {errors.contact_number && (

                                <small className="error-message">

                                    {
                                        errors.contact_number
                                    }

                                </small>

                            )}

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email Address <span>*</span>
                            </label>


                            <div className="input-icon-wrapper">

                                <FaEnvelope />


                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter email address"
                                />

                            </div>


                            {errors.email && (

                                <small className="error-message">

                                    {
                                        errors.email
                                    }

                                </small>

                            )}

                        </div>


                        {/* ADDRESS */}

                        <div className="form-group">

                            <label>
                                Address <span>*</span>
                            </label>


                            <div className="input-icon-wrapper">

                                <FaMapMarkerAlt />


                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter complete address"
                                />

                            </div>


                            {errors.address && (

                                <small className="error-message">

                                    {
                                        errors.address
                                    }

                                </small>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================
                    ACTIONS
                ================================= */}

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

                        Save Customer

                    </button>

                </div>

            </form>

        </div>

    );

}

export default AddCustomer;

