import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import {
    FaArrowLeft,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaEdit
} from "react-icons/fa";

import "../../../css/form.css";

function ViewCustomer() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =========================================
    // STATE
    // =========================================

    const [customer, setCustomer] = useState(null);

    const [loading, setLoading] = useState(true);


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

                    setCustomer(
                        response.data.data
                    );

                } else {

                    Swal.fire({

                        title: "Customer Not Found",

                        text:
                            response.data.message ||
                            "Unable to find customer.",

                        icon: "error",

                        confirmButtonColor:
                            "#1f6f4a"

                    }).then(() => {

                        navigate(
                            "/admin/customers"
                        );

                    });

                }

            } catch (error) {

                console.error(
                    "Load customer error:",
                    error
                );


                Swal.fire({

                    title: "Server Error",

                    text:
                        error.response?.data?.message ||
                        "Unable to load customer information.",

                    icon: "error",

                    confirmButtonColor:
                        "#1f6f4a"

                }).then(() => {

                    navigate(
                        "/admin/customers"
                    );

                });

            } finally {

                setLoading(false);

            }

        };


        fetchCustomer();

    }, [id, navigate]);


    // =========================================
    // BACK
    // =========================================

    const handleBack = () => {

        navigate(
            "/admin/customers"
        );

    };


    // =========================================
    // EDIT
    // =========================================

    const handleEdit = () => {

        navigate(
            `/admin/customers/edit/${id}`
        );

    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const dateObject =
            new Date(
                `${date}T00:00:00`
            );


        if (isNaN(dateObject.getTime())) {
            return date;
        }


        return dateObject.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="form-page">

                <div className="form-page-header">

                    <button
                        type="button"
                        className="back-button"
                        onClick={handleBack}
                    >

                        <FaArrowLeft />

                        Back to Customers

                    </button>


                    <h1>
                        Customer Details
                    </h1>

                    <p>
                        Loading customer information...
                    </p>

                </div>


                <div className="table-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading customer...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // NO CUSTOMER
    // =========================================

    if (!customer) {

        return (

            <div className="form-page">

                <div className="form-page-header">

                    <button
                        type="button"
                        className="back-button"
                        onClick={handleBack}
                    >

                        

                        Back to Customers

                    </button>


                    <h1>
                        Customer Not Found
                    </h1>

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

               


                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h1>
                            Customer Details
                        </h1>

                        <p>
                            View customer information.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleEdit}
                    >

                        <FaEdit />

                        Edit Customer

                    </button>

                </div>

            </div>


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
                            Registered customer details.
                        </p>

                    </div>

                </div>


                <div className="form-grid">


                    {/* FULL NAME */}

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>


                        <div className="input-icon-wrapper">

                            <FaUser />

                            <input
                                type="text"
                                value={
                                    customer.full_name || ""
                                }
                                readOnly
                            />

                        </div>

                    </div>


                    {/* CONTACT */}

                    <div className="form-group">

                        <label>
                            Contact Number
                        </label>


                        <div className="input-icon-wrapper">

                            <FaPhone />

                            <input
                                type="text"
                                value={
                                    customer.contact_number || ""
                                }
                                readOnly
                            />

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>


                        <div className="input-icon-wrapper">

                            <FaEnvelope />

                            <input
                                type="text"
                                value={
                                    customer.email || ""
                                }
                                readOnly
                            />

                        </div>

                    </div>


                    {/* CREATED DATE */}

                    <div className="form-group">

                        <label>
                            Registered Date
                        </label>


                        <div className="input-icon-wrapper">

                            <FaCalendarAlt />

                            <input
                                type="text"
                                value={
                                    formatDate(
                                        customer.created_at?.split(" ")[0]
                                    )
                                }
                                readOnly
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================
                CUSTOMER SUMMARY
            ===================================== */}

            <div className="form-section">

                <div className="form-section-header">

                    <div className="section-icon">

                        <FaUser />

                    </div>


                    <div>

                        <h2>
                            Customer Summary
                        </h2>

                        <p>
                            Basic customer record information.
                        </p>

                    </div>

                </div>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px"
                    }}
                >

                    <div
                        style={{
                            padding: "20px",
                            borderRadius: "12px",
                            background: "#f8fafc",
                            border: "1px solid #e5e7eb"
                        }}
                    >

                        <small>
                            Customer ID
                        </small>

                        <strong
                            style={{
                                display: "block",
                                marginTop: "8px",
                                fontSize: "22px"
                            }}
                        >
                            #{customer.customer_id}
                        </strong>

                    </div>


                    <div
                        style={{
                            padding: "20px",
                            borderRadius: "12px",
                            background: "#f8fafc",
                            border: "1px solid #e5e7eb"
                        }}
                    >

                        <small>
                            Customer Name
                        </small>

                        <strong
                            style={{
                                display: "block",
                                marginTop: "8px",
                                fontSize: "18px"
                            }}
                        >
                            {customer.full_name}
                        </strong>

                    </div>


                    <div
                        style={{
                            padding: "20px",
                            borderRadius: "12px",
                            background: "#f8fafc",
                            border: "1px solid #e5e7eb"
                        }}
                    >

                        <small>
                            Contact
                        </small>

                        <strong
                            style={{
                                display: "block",
                                marginTop: "8px",
                                fontSize: "18px"
                            }}
                        >
                            {customer.contact_number || "-"}
                        </strong>

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
                    onClick={handleBack}
                >

                    <FaArrowLeft />

                    Back to Customers

                </button>


                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleEdit}
                >

                    <FaEdit />

                    Edit Customer

                </button>

            </div>

        </div>

    );

}

export default ViewCustomer;