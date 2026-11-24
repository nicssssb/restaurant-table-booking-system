import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import {
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaChair,
    FaEye,
    FaSyncAlt,
    FaHistory
} from "react-icons/fa";

import CustomerSidebar from "../Components/CustomerSidebar";

import "../../../css/customer-reservations.css";


function ReservationHistory() {

    // =========================================================
    // CUSTOMER
    // =========================================================

    const [customer, setCustomer] = useState(null);


    // =========================================================
    // RESERVATION HISTORY
    // =========================================================

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);


    // =========================================================
    // GET LOGGED-IN CUSTOMER
    // =========================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {

            window.location.href =
                "/customer/login";

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


            window.location.href =
                "/customer/login";

        }

    }, []);


    // =========================================================
    // FETCH RESERVATION HISTORY
    // =========================================================

    const fetchHistory = async () => {

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
                            customer_id:
                                customerId
                        }
                    }

                );


            if (response.data.success) {

                const allReservations =
                    Array.isArray(
                        response.data.data
                    )
                        ? response.data.data
                        : [];


                // =============================================
                // COMPLETED RESERVATIONS ONLY
                // =============================================

                const completedReservations =
                    allReservations.filter(
                        (reservation) =>

                            String(
                                reservation.status
                            )
                                .trim()
                                .toLowerCase() ===
                            "completed"
                    );


                // =============================================
                // NEWEST FIRST
                // =============================================

                completedReservations.sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                `${a.reservation_date}T${a.reservation_time}`
                            );


                        const dateB =
                            new Date(
                                `${b.reservation_date}T${b.reservation_time}`
                            );


                        return dateB - dateA;

                    }
                );


                setHistory(
                    completedReservations
                );

            } else {

                setHistory([]);


                Swal.fire({

                    icon: "error",

                    title:
                        "Unable to Load History",

                    text:
                        response.data.message ||
                        "Unable to load reservation history.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

            }


        } catch (error) {

            console.error(
                "Load reservation history error:",
                error
            );


            setHistory([]);


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
    // LOAD HISTORY
    // =========================================================

    useEffect(() => {

        if (customer) {

            fetchHistory();

        }

    }, [customer]);


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
    // VIEW RESERVATION DETAILS
    // =========================================================

    const handleView = (reservation) => {

        Swal.fire({

            title:
                "Reservation Details",

            html: `

                <div style="
                    text-align: left;
                    line-height: 1.9;
                    font-size: 14px;
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

                    ${reservation.guests || "-"}

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

                    ${reservation.status || "Completed"}

                    <br />

                    <strong>
                        Payment:
                    </strong>

                    ${
                        reservation.payment_status ||
                        "Unpaid"
                    }

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
                SHARED CUSTOMER SIDEBAR
            ===================================================== */}

            <CustomerSidebar />


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="customer-main">


                <div className="customer-reservations-page">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="customer-reservations-header">


                        <div>

                            <h1>
                                Reservation History
                            </h1>


                            <p>
                                View your completed restaurant reservations.
                            </p>

                        </div>


                        {/* REFRESH */}

                        <div className="customer-reservations-actions">

                            <button
                                type="button"
                                className="refresh-reservations-button"
                                onClick={fetchHistory}
                                disabled={loading}
                            >

                                <FaSyncAlt />

                                Refresh

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        LOADING STATE
                    ================================================= */}

                    {loading ? (

                        <div className="empty-reservations">


                            <div className="empty-icon loading-icon">

                                <FaSyncAlt />

                            </div>


                            <h2>
                                Loading History...
                            </h2>


                            <p>
                                Please wait while we load your completed reservations.
                            </p>

                        </div>


                    ) : history.length === 0 ? (


                        /* =================================================
                            EMPTY STATE
                        ================================================= */

                        <div className="empty-reservations">


                            <div className="empty-icon">

                                <FaHistory />

                            </div>


                            <h2>
                                No Completed Reservations
                            </h2>


                            <p>
                                Your completed reservations will appear here.
                            </p>

                        </div>


                    ) : (


                        /* =================================================
                            HISTORY LIST
                        ================================================= */

                        <div className="reservations-list">


                            {history.map(
                                (reservation) => (

                                    <article
                                        className="customer-reservation-card"
                                        key={
                                            reservation.reservation_id
                                        }
                                    >


                                        {/* =================================
                                            CARD HEADER
                                        ================================= */}

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


                                            {/* COMPLETED STATUS */}

                                            <span
                                                className="
                                                    reservation-status
                                                    status-completed
                                                "
                                            >

                                                Completed

                                            </span>

                                        </div>


                                        {/* =================================
                                            RESERVATION INFORMATION
                                        ================================= */}

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
                                                            reservation.guests ||
                                                            "-"
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


                                        {/* =================================
                                            LOCATION
                                        ================================= */}

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


                                        {/* =================================
                                            ACTIONS
                                        ================================= */}

                                        <div className="reservation-card-actions">


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

                                        </div>


                                    </article>

                                )
                            )}


                        </div>

                    )}


                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <footer className="customer-footer">

                    <span>
                        © 2026 Amora Dining
                    </span>

                    <span>
                        Restaurant Reservation System
                    </span>

                </footer>


            </main>


        </div>

    );

}


export default ReservationHistory;