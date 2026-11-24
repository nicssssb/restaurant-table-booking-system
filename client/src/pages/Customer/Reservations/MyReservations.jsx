import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import {
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaChair,
    FaEye,
    FaTimesCircle,
    FaCheckCircle,
    FaHourglassHalf,
    FaBan,
    FaSyncAlt,
    FaPlus
} from "react-icons/fa";

import CustomerSidebar from "../Components/CustomerSidebar.jsx";

import "../../../css/customer-reservations.css";


function MyReservations() {

    const navigate = useNavigate();


    // =========================================================
    // CUSTOMER
    // =========================================================

    const [customer, setCustomer] = useState(null);


    // =========================================================
    // RESERVATIONS
    // =========================================================

    const [reservations, setReservations] = useState([]);

    const [loading, setLoading] = useState(true);


    // =========================================================
    // GET CUSTOMER FROM LOCAL STORAGE
    // =========================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {

            navigate("/customer/login");

            return;
        }


        try {

            const user =
                JSON.parse(storedUser);


            setCustomer(user);

        } catch (error) {

            console.error(
                "Invalid customer data:",
                error
            );


            localStorage.removeItem("user");

            navigate("/customer/login");

        }

    }, [navigate]);


    // =========================================================
    // LOAD RESERVATIONS
    // =========================================================

    const fetchReservations = async () => {

        if (!customer) {
            return;
        }


        const customerId =
            customer.customer_id ||
            customer.id;


        if (!customerId) {

            console.error(
                "Customer ID not found:",
                customer
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);


            const response =
                await axios.get(

                    "http://localhost/restaurant_reservation_system/server/api/reservations/get_customer_reservations.php",

                    {
                        params: {
                            customer_id: customerId
                        }
                    }

                );


            if (response.data.success) {

                setReservations(

                    Array.isArray(
                        response.data.data
                    )
                        ? response.data.data
                        : []

                );

            } else {

                setReservations([]);


                Swal.fire({

                    icon: "error",

                    title:
                        "Unable to Load Reservations",

                    text:
                        response.data.message ||
                        "Unable to load your reservations.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

            }


        } catch (error) {

            console.error(
                "Load reservations error:",
                error
            );


            setReservations([]);


            Swal.fire({

                icon: "error",

                title:
                    "Server Error",

                text:
                    error.response?.data?.message ||
                    "Unable to connect to the reservation server.",

                confirmButtonColor:
                    "#8b5e3c"

            });


        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOAD WHEN CUSTOMER IS AVAILABLE
    // =========================================================

    useEffect(() => {

        if (customer) {

            fetchReservations();

        }

    }, [customer]);


    // =========================================================
    // PAGE NAVIGATION
    // =========================================================

    const goToDashboard = () => {

        navigate("/customer/dashboard");

    };


    const goToReservation = () => {

        navigate("/customer/reservation");

    };


    // =========================================================
    // STATUS CLASS
    // =========================================================

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


            case "pending":

            default:

                return "status-pending";

        }

    };


    // =========================================================
    // STATUS ICON
    // =========================================================

    const getStatusIcon = (status) => {

        switch (
            String(status)
                .toLowerCase()
        ) {

            case "confirmed":

                return <FaCheckCircle />;


            case "completed":

                return <FaCheckCircle />;


            case "cancelled":

                return <FaBan />;


            case "pending":

            default:

                return <FaHourglassHalf />;

        }

    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        const dateObject =
            new Date(
                `${date}T00:00:00`
            );


        return dateObject.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    };


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (time) => {

        if (!time) {

            return "-";

        }


        const [
            hours,
            minutes
        ] =
            time
                .split(":")
                .map(Number);


        const date =
            new Date();


        date.setHours(
            hours,
            minutes,
            0,
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


    // =========================================================
    // CANCEL RESERVATION
    // =========================================================

    const handleCancel = async (reservation) => {

        const result =
            await Swal.fire({

                icon:
                    "warning",

                title:
                    "Cancel Reservation?",

                html: `

                    <div style="
                        text-align:left;
                        line-height:1.8;
                    ">

                        <strong>Date:</strong>
                        ${formatDate(
                            reservation.reservation_date
                        )}

                        <br />

                        <strong>Time:</strong>
                        ${formatTime(
                            reservation.reservation_time
                        )}

                        <br />

                        <strong>Table:</strong>
                        ${reservation.table_number || "-"}

                    </div>

                `,

                showCancelButton:
                    true,

                confirmButtonColor:
                    "#dc2626",

                cancelButtonColor:
                    "#6b7280",

                confirmButtonText:
                    "Yes, Cancel",

                cancelButtonText:
                    "Keep Reservation"

            });


        if (!result.isConfirmed) {

            return;

        }


        try {

            Swal.fire({

                title:
                    "Cancelling Reservation...",

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


            const response =
                await axios.post(

                    "http://localhost/restaurant_reservation_system/server/api/reservations/cancel_reservation.php",

                    {
                        reservation_id:
                            Number(
                                reservation.reservation_id
                            )
                    },

                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            if (response.data.success) {

                await Swal.fire({

                    icon:
                        "success",

                    title:
                        "Reservation Cancelled",

                    text:
                        response.data.message ||
                        "Your reservation has been cancelled.",

                    confirmButtonColor:
                        "#8b5e3c"

                });


                fetchReservations();


            } else {

                Swal.fire({

                    icon:
                        "error",

                    title:
                        "Cancellation Failed",

                    text:
                        response.data.message ||
                        "Unable to cancel reservation.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

            }


        } catch (error) {

            console.error(
                "Cancel reservation error:",
                error
            );


            Swal.fire({

                icon:
                    "error",

                title:
                    "Server Error",

                text:
                    error.response?.data?.message ||
                    "Unable to connect to the reservation server.",

                confirmButtonColor:
                    "#8b5e3c"

            });

        }

    };


    // =========================================================
    // VIEW RESERVATION
    // =========================================================

    const handleView = (reservation) => {

        Swal.fire({

            title:
                "Reservation Details",

            html: `

                <div style="
                    text-align:left;
                    line-height:1.9;
                    font-size:14px;
                ">

                    <strong>
                        Reservation ID:
                    </strong>

                    RES-${reservation.reservation_id}

                    <br />

                    <strong>
                        Date:
                    </strong>

                    ${formatDate(
                        reservation.reservation_date
                    )}

                    <br />

                    <strong>
                        Time:
                    </strong>

                    ${formatTime(
                        reservation.reservation_time
                    )}

                    <br />

                    <strong>
                        Guests:
                    </strong>

                    ${reservation.guests}

                    <br />

                    <strong>
                        Table:
                    </strong>

                    ${reservation.table_number || "-"}

                    <br />

                    <strong>
                        Location:
                    </strong>

                    ${reservation.location || "-"}

                    <br />

                    <strong>
                        Status:
                    </strong>

                    ${reservation.status || "Pending"}

                    <br />

                    <strong>
                        Payment:
                    </strong>

                    ${reservation.payment_status || "Unpaid"}

                    <br />

                    <strong>
                        Special Request:
                    </strong>

                    ${
                        reservation.special_request ||
                        "None"
                    }

                </div>

            `,

            confirmButtonColor:
                "#8b5e3c",

            confirmButtonText:
                "Close"

        });

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="customer-dashboard">


            {/* =====================================================
                SHARED SIDEBAR
            ===================================================== */}

            <CustomerSidebar />


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="customer-main">


                <div className="customer-reservations-page">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="customer-reservations-header">


                        <div>

                            <h1>
                                My Reservations
                            </h1>


                            <p>
                                View and manage your restaurant reservations.
                            </p>

                        </div>


                        {/* HEADER ACTIONS */}

                        <div className="customer-reservations-actions">


                            {/* REFRESH */}

                            <button
                                type="button"
                                className="refresh-reservations-button"
                                onClick={fetchReservations}
                                title="Refresh Reservations"
                                disabled={loading}
                            >

                                <FaSyncAlt />

                                Refresh

                            </button>


                            {/* NEW RESERVATION */}

                            <button
                                type="button"
                                className="new-reservation-button"
                                onClick={goToReservation}
                            >

                                <FaPlus />

                                Make Reservation

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="empty-reservations loading-reservations">


                            <div className="empty-icon loading-icon">

                                <FaSyncAlt />

                            </div>


                            <h2>
                                Loading Reservations...
                            </h2>


                            <p>
                                Please wait while we load your reservations.
                            </p>

                        </div>


                    ) : reservations.length === 0 ? (


                        /* =================================================
                            EMPTY STATE
                        ================================================= */

                        <div className="empty-reservations">


                            <div className="empty-icon">

                                <FaCalendarAlt />

                            </div>


                            <h2>
                                No Reservations Yet
                            </h2>


                            <p>
                                You don't have any reservations.
                                Make your first reservation today.
                            </p>


                            <button
                                type="button"
                                onClick={goToReservation}
                            >

                                <FaPlus />

                                Make a Reservation

                            </button>

                        </div>


                    ) : (


                        /* =================================================
                            RESERVATION LIST
                        ================================================= */

                        <div className="reservations-list">


                            {reservations.map(
                                (reservation) => (

                                    <div
                                        className="customer-reservation-card"
                                        key={
                                            reservation.reservation_id
                                        }
                                    >


                                        {/* =====================================
                                            CARD TOP
                                        ===================================== */}

                                        <div className="reservation-card-top">


                                            <div>

                                                <span className="reservation-id">

                                                    RES-
                                                    {
                                                        reservation.reservation_id
                                                    }

                                                </span>


                                                <h2>

                                                    {
                                                        reservation.table_number ||
                                                        "Table"
                                                    }

                                                </h2>

                                            </div>


                                            {/* STATUS */}

                                            <span
                                                className={`
                                                    reservation-status
                                                    ${getStatusClass(
                                                        reservation.status
                                                    )}
                                                `}
                                            >

                                                {
                                                    getStatusIcon(
                                                        reservation.status
                                                    )
                                                }

                                                {
                                                    reservation.status ||
                                                    "Pending"
                                                }

                                            </span>

                                        </div>


                                        {/* =====================================
                                            DETAILS
                                        ===================================== */}

                                        <div className="reservation-details">


                                            {/* DATE */}

                                            <div>

                                                <FaCalendarAlt />

                                                <span>

                                                    <small>
                                                        Date
                                                    </small>

                                                    <strong>

                                                        {
                                                            formatDate(
                                                                reservation.reservation_date
                                                            )
                                                        }

                                                    </strong>

                                                </span>

                                            </div>


                                            {/* TIME */}

                                            <div>

                                                <FaClock />

                                                <span>

                                                    <small>
                                                        Time
                                                    </small>

                                                    <strong>

                                                        {
                                                            formatTime(
                                                                reservation.reservation_time
                                                            )
                                                        }

                                                    </strong>

                                                </span>

                                            </div>


                                            {/* GUESTS */}

                                            <div>

                                                <FaUsers />

                                                <span>

                                                    <small>
                                                        Guests
                                                    </small>

                                                    <strong>

                                                        {
                                                            reservation.guests
                                                        }

                                                    </strong>

                                                </span>

                                            </div>


                                            {/* TABLE */}

                                            <div>

                                                <FaChair />

                                                <span>

                                                    <small>
                                                        Table
                                                    </small>

                                                    <strong>

                                                        {
                                                            reservation.table_number ||
                                                            "-"
                                                        }

                                                    </strong>

                                                </span>

                                            </div>

                                        </div>


                                        {/* =====================================
                                            LOCATION
                                        ===================================== */}

                                        {reservation.location && (

                                            <div className="reservation-location">

                                                <strong>
                                                    Location:
                                                </strong>

                                                {" "}

                                                {
                                                    reservation.location
                                                }

                                            </div>

                                        )}


                                        {/* =====================================
                                            ACTIONS
                                        ===================================== */}

                                        <div className="reservation-card-actions">


                                            {/* VIEW */}

                                            <button
                                                type="button"
                                                className="view-reservation-button"
                                                onClick={() =>
                                                    handleView(
                                                        reservation
                                                    )
                                                }
                                            >

                                                <FaEye />

                                                View Details

                                            </button>


                                            {/* CANCEL */}

                                            {
                                                String(
                                                    reservation.status
                                                ).toLowerCase() !==
                                                    "cancelled" &&

                                                String(
                                                    reservation.status
                                                ).toLowerCase() !==
                                                    "completed" &&

                                                (

                                                    <button
                                                        type="button"
                                                        className="cancel-reservation-button"
                                                        onClick={() =>
                                                            handleCancel(
                                                                reservation
                                                            )
                                                        }
                                                    >

                                                        <FaTimesCircle />

                                                        Cancel

                                                    </button>

                                                )
                                            }

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                </div>


            </main>


        </div>

    );

}


export default MyReservations;