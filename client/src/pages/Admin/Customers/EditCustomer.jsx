import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

function EditCustomer() {

    const navigate = useNavigate();
    const { id } = useParams();


    // =========================================
    // FORM
    // =========================================

    const [form, setForm] = useState({

        full_name: "",
        contact_number: "",
        email: "",
        address: ""

    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});


    // =========================================
    // LOAD CUSTOMER
    // =========================================

    useEffect(() => {

        const fetchCustomer = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    `http://localhost/restaurant_reservation_system/server/api/customers/get_customer.php?id=${id}`
                );


                console.log(
                    "Customer API:",
                    response.data
                );


                if (response.data.success) {

                    const customer =
                        response.data.data;


                    setForm({

                        full_name:
                            customer.full_name || "",

                        contact_number:
                            customer.contact_number || "",

                        email:
                            customer.email || "",

                        address:
                            customer.address || ""

                    });

                } else {

                    await Swal.fire({

                        title: "Customer Not Found",

                        text:
                            response.data.message ||
                            "Unable to find the customer.",

                        icon: "error",

                        confirmButtonColor: "#1f6f4a"

                    });


                    navigate("/admin/customers");

                }

            } catch (error) {

                console.error(
                    "Load customer error:",
                    error
                );


                await Swal.fire({

                    title: "Server Error",

                    text:
                        error.response?.data?.message ||
                        "Unable to load customer information.",

                    icon: "error",

                    confirmButtonColor: "#1f6f4a"

                });


                navigate("/admin/customers");

            } finally {

                setLoading(false);

            }

        };


        if (id) {

            fetchCustomer();

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


        if (!form.full_name.trim()) {

            newErrors.full_name =
                "Full name is required.";

        }


        if (!form.contact_number.trim()) {

            newErrors.contact_number =
                "Contact number is required.";

        }


        if (
            form.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email.trim()
            )
        ) {

            newErrors.email =
                "Please enter a valid email address.";

        }


        if (!form.address.trim()) {

            newErrors.address =
                "Address is required.";

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


        const result = await Swal.fire({

            title: "Update Customer?",

            html: `
                <div style="text-align:left; line-height:1.8;">

                    <strong>Name:</strong>
                    ${form.full_name}

                    <br />

                    <strong>Contact:</strong>
                    ${form.contact_number}

                    <br />

                    <strong>Email:</strong>
                    ${form.email || "N/A"}

                    <br />

                    <strong>Address:</strong>
                    ${form.address}

                </div>
            `,

            icon: "question",

            showCancelButton: true,

            confirmButtonColor: "#1f6f4a",

            cancelButtonColor: "#6b7280",

            confirmButtonText: "Yes, Update",

            cancelButtonText: "Review Again"

        });


        if (!result.isConfirmed) {

            return;

        }


        // =====================================
        // SAVE
        // =====================================

        setSaving(true);


        try {

            const customerData = {

                customer_id:
                    Number(id),

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
                "Updating customer:",
                customerData
            );


            const response =
                await axios.post(

                    "http://localhost/restaurant_reservation_system/server/api/customers/update_customer.php",

                    customerData,

                    {
                        headers: {

                            "Content-Type":
                                "application/json"

                        }

                    }

                );


            console.log(
                "Update Customer API:",
                response.data
            );


            if (response.data.success) {

                await Swal.fire({

                    title: "Customer Updated!",

                    text:
                        response.data.message ||
                        "Customer information has been successfully updated.",

                    icon: "success",

                    confirmButtonColor: "#1f6f4a"

                });


                navigate(
                    "/admin/customers"
                );


            } else {

                Swal.fire({

                    title: "Update Failed",

                    text:
                        response.data.message ||
                        "Unable to update customer.",

                    icon: "error",

                    confirmButtonColor: "#1f6f4a"

                });

            }

        } catch (error) {

            console.error(
                "Update customer error:",
                error
            );


            Swal.fire({

                title: "Server Error",

                text:
                    error.response?.data?.message ||
                    "Unable to connect to the customer server.",

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

        navigate(
            "/admin/customers"
        );

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="form-page">

                <div className="form-page-header">

                    <h1>
                        Edit Customer
                    </h1>

                    <p>
                        Loading customer information...
                    </p>

                </div>


                <div
                    style={{
                        padding: "40px",
                        textAlign: "center"
                    }}
                >

                    Loading customer...

                </div>

            </div>

        );

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="form-page">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="form-page-header">

              


                <h1>
                    Edit Customer
                </h1>


                <p>
                    Update customer information.
                </p>

            </div>


            {/* =====================================
                FORM
            ===================================== */}

            <form
                className="professional-form"
                onSubmit={handleSubmit}
            >


                {/* =====================================
                    CUSTOMER INFORMATION
                ===================================== */}

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
                                Update the customer's details.
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
                                    value={form.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />

                            </div>


                            {errors.full_name && (

                                <small className="error-message">

                                    {errors.full_name}

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
                                    value={form.contact_number}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                />

                            </div>


                            {errors.contact_number && (

                                <small className="error-message">

                                    {errors.contact_number}

                                </small>

                            )}

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>


                            <div className="input-icon-wrapper">

                                <FaEnvelope />


                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />

                            </div>


                            {errors.email && (

                                <small className="error-message">

                                    {errors.email}

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
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                />

                            </div>


                            {errors.address && (

                                <small className="error-message">

                                    {errors.address}

                                </small>

                            )}

                        </div>

                    </div>

                </div>


                {/* =====================================
                    ACTIONS
                ===================================== */}

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
                            : "Update Customer"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

}

export default EditCustomer;