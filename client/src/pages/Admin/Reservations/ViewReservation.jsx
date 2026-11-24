import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import {
    FaArrowLeft,
    FaUser,
    FaPhone,
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaChair,
    FaStickyNote,
    FaMoneyBillWave,
    FaEdit,
    FaTimes,
    FaCheckCircle
} from "react-icons/fa";

import "../../../css/form.css";

function ViewReservation() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================================
    // LOAD RESERVATION
    // =========================================

    useEffect(() => {

        const fetchReservation = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    `http://localhost/restaurant_reservation_system/server/api/reservations/get_reservation.php?id=${id}`
                );

                console.log(
                    "Reservation:",
                    response.data
                );


                if (
                    response.data.success &&
                    response.data.data
                ) {

                    setReservation(
                        response.data.data
                    );

                } else {

                    Swal.fire({
                        title: "Reservation Not Found",
                        text:
                            response.data.message ||
                            "The reservation could not be found.",
                        icon: "warning",
                        confirmButtonColor: "#1f6f4a"
                    }).then(() => {

                        navigate(
                            "/admin/reservations"
                        );

                    });

                }

            } catch (error) {

                console.error(
                    "Reservation Error:",
                    error
                );

                Swal.fire({
                    title: "Server Error",
                    text:
                        error.response?.data?.message ||
                        "Unable to load reservation.",
                    icon: "error",
                    confirmButtonColor: "#1f6f4a"
                }).then(() => {

                    navigate(
                        "/admin/reservations"
                    );

                });

            } finally {

                setLoading(false);

            }

        };


        fetchReservation();

    }, [id, navigate]);


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const dateObject =
            new Date(`${date}T00:00:00`);

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
    // FORMAT TIME
    // =========================================

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        const [hours, minutes] =
            time.split(":").map(Number);

        const date = new Date();

        date.setHours(
            hours,
            minutes,
            0
        );

        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    };


    // =========================================
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {

        switch (
            String(status)
                .toLowerCase()
        ) {

            case "confirmed":
                return "status-confirmed";

            case "completed":
                return "status-completed";

            case "cancelled":
                return "status-cancelled";

            default:
                return "status-pending";

        }

    };


    // =========================================
    // PAYMENT CLASS
    // =========================================

    const getPaymentClass = (status) => {

        switch (
            String(status)
                .toLowerCase()
        ) {

            case "paid":
                return "payment-paid";

            case "partial":
                return "payment-partial";

            case "refunded":
                return "payment-refunded";

            default:
                return "payment-unpaid";

        }

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
                        Loading reservation...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // NO DATA
    // =========================================

    if (!reservation) {
        return null;
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

                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/admin/reservations"
                        )
                    }
                >

                    <FaArrowLeft />

                    Back to Reservations

                </button>


                <h1>
                    Reservation Details
                </h1>


                <p>
                    View complete reservation information.
                </p>

            </div>


            {/* =====================================
                RESERVATION HEADER CARD
            ===================================== */}

            <div className="form-section">

                <div className="form-section-header">

                    <div className="section-icon">

                        <FaCheckCircle />

                    </div>


                    <div>

                        <h2>
                            Reservation #
                            {reservation.reservation_id}
                        </h2>

                        <p>
                            Created on{" "}
                            {reservation.created_at
                                ? formatDate(
                                    reservation.created_at
                                        .split(" ")[0]
                                )
                                : "-"
                            }
                        </p>

                    </div>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >

                    <span
                        className={`status-badge ${getStatusClass(
                            reservation.status
                        )}`}
                    >
                        {reservation.status}
                    </span>


                    <span
                        className={`payment-badge ${getPaymentClass(
                            reservation.payment_status
                        )}`}
                    >
                        {reservation.payment_status}
                    </span>

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
                            Customer details for this reservation.
                        </p>

                    </div>

                </div>


                <div className="form-grid">


                    <div className="form-group">

                        <label>
                            Customer Name
                        </label>

                        <div className="input-icon-wrapper">

                            <FaUser />

                            <input
                                type="text"
                                value={
                                    reservation.customer_name ||
                                    "-"
                                }
                                readOnly
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Contact Number
                        </label>

                        <div className="input-icon-wrapper">

                            <FaPhone />

                            <input
                                type="text"
                                value={
                                    reservation.contact_number ||
                                    "-"
                                }
                                readOnly
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================
                RESERVATION DETAILS
            ===================================== */}

            <div className="form-section">

                <div className="form-section-header">

                    <div className="section-icon">

                        <FaCalendarAlt />

                    </div>


                    <div>

                        <h2>
                            Reservation Details
                        </h2>

                        <p>
                            Date, time, guests, and table information.
                        </p>

                    </div>

                </div>


                <div className="form-grid">


                    {/* DATE */}

                    <div className="form-group">

                        <label>
                            Reservation Date
                        </label>

                        <div className="input-icon-wrapper">

                            <FaCalendarAlt />

                            <input
                                type="text"
                                value={formatDate(
                                    reservation.reservation_date
                                )}
                                readOnly
                            />

                        </div>

                    </div>


                    {/* TIME */}

                    <div className="form-group">

                        <label>
                            Reservation Time
                        </label>

                        <div className="input-icon-wrapper">

                            <FaClock />

                            <input
                                type="text"
                                value={formatTime(
                                    reservation.reservation_time
                                )}
                                readOnly
                            />

                        </div>

                    </div>


                    {/* GUESTS */}

                    <div className="form-group">

                        <label>
                            Number of Guests
                        </label>

                        <div className="input-icon-wrapper">

                            <FaUsers />

                            <input
                                type="text"
                                value={
                                    reservation.guests
                                }
                                readOnly
                            />

                        </div>

                    </div>


                    {/* TABLE */}

                    <div className="form-group">

                        <label>
                            Table
                        </label>

                        <div className="input-icon-wrapper">

                            <FaChair />

                            <input
                                type="text"
                                value={
                                    reservation.table_number ||
                                    "-"
                                }
                                readOnly
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================
                SPECIAL REQUEST
            ===================================== */}

            <div className="form-section">

                <div className="form-section-header">

                    <div className="section-icon">

                        <FaStickyNote />

                    </div>


                    <div>

                        <h2>
                            Special Request
                        </h2>

                        <p>
                            Customer requests and additional notes.
                        </p>

                    </div>

                </div>


                <div className="form-group">

                    <label>
                        Special Request
                    </label>

                    <textarea
                        value={
                            reservation.special_request ||
                            "No special request."
                        }
                        readOnly
                        rows="4"
                    />

                </div>

            </div>


            {/* =====================================
                PAYMENT & STATUS
            ===================================== */}

            <div className="form-section">

                <div className="form-section-header">

                    <div className="section-icon">

                        <FaMoneyBillWave />

                    </div>


                    <div>

                        <h2>
                            Payment & Status
                        </h2>

                        <p>
                            Current payment and reservation status.
                        </p>

                    </div>

                </div>


                <div className="form-grid">

                    <div className="form-group">

                        <label>
                            Payment Status
                        </label>

                        <select
                            value={
                                reservation.payment_status ||
                                "Unpaid"
                            }
                            disabled
                            onChange={() => {}}
                        >

                            <option>
                                Unpaid
                            </option>

                            <option>
                                Partial
                            </option>

                            <option>
                                Paid
                            </option>

                            <option>
                                Refunded
                            </option>

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Reservation Status
                        </label>

                        <select
                            value={
                                reservation.status ||
                                "Pending"
                            }
                            disabled
                            onChange={() => {}}
                        >

                            <option>
                                Pending
                            </option>

                            <option>
                                Confirmed
                            </option>

                            <option>
                                Completed
                            </option>

                            <option>
                                Cancelled
                            </option>

                        </select>

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
                    onClick={() =>
                        navigate(
                            "/admin/reservations"
                        )
                    }
                >

                    <FaArrowLeft />

                    Back

                </button>


                {String(
                    reservation.status
                ).toLowerCase() !== "cancelled" &&
                String(
                    reservation.status
                ).toLowerCase() !== "completed" && (

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                            navigate(
                                `/admin/reservations/edit/${reservation.reservation_id}`
                            )
                        }
                    >

                        <FaEdit />

                        Edit Reservation

                    </button>

                )}

            </div>

        </div>

    );

}

export default ViewReservation;