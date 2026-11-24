import { useState, useEffect, useCallback } from "react";
import CustomerSidebar from "../Components/CustomerSidebar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import {
    FaUtensils,
    FaCalendarAlt,
    FaClock,
    FaHourglassHalf,
    FaCheckCircle,
    FaPlus,
    FaHistory,
    FaUser,
    FaSignOutAlt,
    FaEye,
    FaTimesCircle
} from "react-icons/fa";

import "../../../css/customer-dashboard.css";


function CustomerDashboard() {

    const navigate = useNavigate();


    // =========================================================
    // CUSTOMER
    // =========================================================

    const [customer, setCustomer] = useState(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return {};
        }

        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Invalid user data:", error);
            return {};
        }

    });


    // =========================================================
    // CUSTOMER ID
    // =========================================================
    // Supports both:
    // customer.customer_id
    // customer.id

    const customerId =
        customer?.customer_id ||
        customer?.id ||
        null;


    // =========================================================
    // CUSTOMER NAME
    // =========================================================

    const customerName =
        customer?.full_name ||
        customer?.name ||
        "Customer";


    // =========================================================
    // RESERVATION DATA
    // =========================================================

    const [reservationStats, setReservationStats] = useState({

        total: 0,
        upcoming: 0,
        pending: 0,
        completed: 0

    });


    const [upcomingReservation, setUpcomingReservation] = useState(null);


    const [recentReservations, setRecentReservations] = useState([]);


    const [loadingReservations, setLoadingReservations] = useState(true);


    // =========================================================
    // LOAD CUSTOMER RESERVATIONS
    // =========================================================

    const loadReservations = useCallback(async () => {

        if (!customerId) {

            console.error(
                "Customer ID is missing:",
                customer
            );

            setReservationStats({
                total: 0,
                upcoming: 0,
                pending: 0,
                completed: 0
            });

            setUpcomingReservation(null);

            setRecentReservations([]);

            setLoadingReservations(false);

            return;
        }


        try {

            setLoadingReservations(true);


            console.log(
                "Loading reservations for customer ID:",
                customerId
            );


            const response = await axios.get(
                "http://localhost/restaurant_reservation_system/server/api/reservations/get_customer_dashboard.php",
                {
                    params: {
                        customer_id: customerId
                    }
                }
            );


            console.log(
                "Customer Dashboard Response:",
                response.data
            );


            if (response.data?.success) {


                // =================================================
                // STATISTICS
                // =================================================

                setReservationStats({

                    total:
                        Number(
                            response.data?.stats?.total
                        ) || 0,

                    upcoming:
                        Number(
                            response.data?.stats?.upcoming
                        ) || 0,

                    pending:
                        Number(
                            response.data?.stats?.pending
                        ) || 0,

                    completed:
                        Number(
                            response.data?.stats?.completed
                        ) || 0

                });


                // =================================================
                // UPCOMING RESERVATION
                // =================================================

                const upcoming =
                    response.data?.upcomingReservation;


                if (upcoming) {

                    setUpcomingReservation({

                        id:
                            upcoming.reservation_id ||
                            upcoming.id ||
                            "N/A",

                        date:
                            upcoming.reservation_date ||
                            upcoming.date ||
                            "N/A",

                        time:
                            upcoming.reservation_time ||
                            upcoming.time ||
                            "N/A",

                        guests:
                            upcoming.guests ||
                            0,

                        table:
                            upcoming.table_number ||
                            upcoming.table_name ||
                            upcoming.table ||
                            `Table ${upcoming.table_id || "N/A"}`,

                        status:
                            upcoming.status ||
                            "Pending"

                    });

                } else {

                    setUpcomingReservation(null);

                }


                // =================================================
                // RECENT RESERVATIONS
                // =================================================

                const recent =
                    response.data?.recentReservations || [];


                const formattedRecent =
                    recent.map((reservation) => ({

                        id:
                            reservation.reservation_id ||
                            reservation.id ||
                            "N/A",

                        date:
                            reservation.reservation_date ||
                            reservation.date ||
                            "N/A",

                        time:
                            reservation.reservation_time ||
                            reservation.time ||
                            "N/A",

                        table:
                            reservation.table_number ||
                            reservation.table_name ||
                            reservation.table ||
                            `Table ${reservation.table_id || "N/A"}`,

                        guests:
                            reservation.guests ||
                            0,

                        status:
                            reservation.status ||
                            "Pending"

                    }));


                setRecentReservations(formattedRecent);


            } else {

                console.error(
                    "Dashboard API error:",
                    response.data?.message
                );


                setReservationStats({
                    total: 0,
                    upcoming: 0,
                    pending: 0,
                    completed: 0
                });

                setUpcomingReservation(null);

                setRecentReservations([]);

            }


        } catch (error) {

            console.error(
                "Failed to load customer reservations:",
                error
            );


            setReservationStats({
                total: 0,
                upcoming: 0,
                pending: 0,
                completed: 0
            });

            setUpcomingReservation(null);

            setRecentReservations([]);


        } finally {

            setLoadingReservations(false);

        }

    }, [customerId]);


    // =========================================================
    // LOAD DATA WHEN DASHBOARD OPENS
    // =========================================================

    useEffect(() => {

        loadReservations();

    }, [loadReservations]);


    // =========================================================
    // REFRESH WHEN CUSTOMER RETURNS TO DASHBOARD
    // =========================================================

    useEffect(() => {

        const handleFocus = () => {

            loadReservations();

        };


        window.addEventListener(
            "focus",
            handleFocus
        );


        return () => {

            window.removeEventListener(
                "focus",
                handleFocus
            );

        };

    }, [loadReservations]);


    // =========================================================
    // NAVIGATION
    // =========================================================

    const goToReservation = () => {

        navigate("/customer/reservation");

    };


    const goToReservations = () => {

        navigate("/customer/reservations");

    };


    const goToHistory = () => {

        navigate("/customer/history");

    };


    const goToProfile = () => {

        navigate("/customer/profile");

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = async () => {

        const result = await Swal.fire({

            title: "Logout?",

            text: "Are you sure you want to logout?",

            icon: "question",

            showCancelButton: true,

            confirmButtonColor: "#8b5e3c",

            cancelButtonColor: "#6b7280",

            confirmButtonText: "Yes, Logout",

            cancelButtonText: "Cancel"

        });


        if (!result.isConfirmed) {

            return;

        }


        localStorage.removeItem("user");


        await Swal.fire({

            icon: "success",

            title: "Logged Out",

            text: "You have been successfully logged out.",

            confirmButtonColor: "#8b5e3c",

            timer: 1200,

            showConfirmButton: false

        });


        navigate("/portal");

    };


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (!status) {

            return "";

        }


        return status
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date || date === "N/A") {

            return "N/A";

        }


        const parsedDate =
            new Date(`${date}T00:00:00`);


        if (isNaN(parsedDate.getTime())) {

            return date;

        }


        return parsedDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    };


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (time) => {

        if (!time || time === "N/A") {

            return "N/A";

        }


        const parts = time.split(":");


        if (parts.length < 2) {

            return time;

        }


        let hour =
            parseInt(parts[0], 10);


        const minute =
            parts[1];


        const ampm =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 || 12;


        return `${hour}:${minute} ${ampm}`;

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="customer-dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="customer-sidebar">


                {/* LOGO */}

                <div className="customer-sidebar-logo">

                    <div className="customer-logo-icon">

                        <FaUtensils />

                    </div>


                    <div>

                        <h2>
                            Amora Dining
                        </h2>

                        <span>
                            Customer Portal
                        </span>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="customer-nav">


                    <p className="customer-nav-title">
                        MAIN MENU
                    </p>


                    <button
                        type="button"
                        className="customer-nav-link active"
                    >

                        <FaCalendarAlt />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    <button
                        type="button"
                        className="customer-nav-link"
                        onClick={goToReservation}
                    >

                        <FaPlus />

                        <span>
                            Make Reservation
                        </span>

                    </button>


                    <button
                        type="button"
                        className="customer-nav-link"
                        onClick={goToReservations}
                    >

                        <FaClock />

                        <span>
                            My Reservations
                        </span>

                    </button>


                    <button
                        type="button"
                        className="customer-nav-link"
                        onClick={goToHistory}
                    >

                        <FaHistory />

                        <span>
                            Reservation History
                        </span>

                    </button>


                    <p className="customer-nav-title account-title">
                        ACCOUNT
                    </p>


                    <button
                        type="button"
                        className="customer-nav-link"
                        onClick={goToProfile}
                    >

                        <FaUser />

                        <span>
                            My Profile
                        </span>

                    </button>

                </nav>


                {/* LOGOUT */}

                <div className="customer-sidebar-bottom">

                    <button
                        type="button"
                        className="customer-logout"
                        onClick={handleLogout}
                    >

                        <FaSignOutAlt />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="customer-main">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="customer-header">

                    <div>

                        

                        <h1>
                            Welcome back, {customerName}!
                        </h1>


                        <p>
                            Manage your reservations and plan your next
                            dining experience.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="customer-profile-button"
                        onClick={goToProfile}
                    >

                        <div className="customer-avatar">

                            <FaUser />

                        </div>


                        <div>

                            <strong>
                                {customerName}
                            </strong>

                            <span>
                                Customer
                            </span>

                        </div>

                    </button>

                </header>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="customer-stats">


                    {/* TOTAL */}

                    <div className="customer-stat-card">

                        <div className="customer-stat-icon total">

                            <FaCalendarAlt />

                        </div>


                        <div>

                            <span>
                                Total Reservations
                            </span>


                            <strong>

                                {loadingReservations
                                    ? "..."
                                    : reservationStats.total}

                            </strong>

                        </div>

                    </div>


                    {/* UPCOMING */}

                    <div className="customer-stat-card">

                        <div className="customer-stat-icon upcoming">

                            <FaClock />

                        </div>


                        <div>

                            <span>
                                Upcoming
                            </span>


                            <strong>

                                {loadingReservations
                                    ? "..."
                                    : reservationStats.upcoming}

                            </strong>

                        </div>

                    </div>


                    {/* PENDING */}

                    <div className="customer-stat-card">

                        <div className="customer-stat-icon pending">

                            <FaHourglassHalf />

                        </div>


                        <div>

                            <span>
                                Pending
                            </span>


                            <strong>

                                {loadingReservations
                                    ? "..."
                                    : reservationStats.pending}

                            </strong>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="customer-stat-card">

                        <div className="customer-stat-icon completed">

                            <FaCheckCircle />

                        </div>


                        <div>

                            <span>
                                Completed
                            </span>


                            <strong>

                                {loadingReservations
                                    ? "..."
                                    : reservationStats.completed}

                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    MAIN CONTENT GRID
                ================================================= */}

                <section className="customer-dashboard-grid">


                    {/* =================================================
                        UPCOMING RESERVATION
                    ================================================= */}

                    <div className="customer-panel upcoming-panel">


                        <div className="customer-panel-header">

                            <div>

                                <span>
                                    YOUR NEXT VISIT
                                </span>

                                <h2>
                                    Upcoming Reservation
                                </h2>

                            </div>


                            <FaCalendarAlt />

                        </div>


                        {loadingReservations ? (

                            <div className="empty-reservation">

                                <div className="empty-reservation-icon">

                                    <FaHourglassHalf />

                                </div>


                                <h3>
                                    Loading Reservation...
                                </h3>


                                <p>
                                    Please wait while we load your reservation.
                                </p>

                            </div>

                        ) : upcomingReservation ? (

                            <div className="upcoming-card">


                                <div className="upcoming-top">

                                    <span className="reservation-id">

                                        RES-
                                        {upcomingReservation.id}

                                    </span>


                                    <span
                                        className={`reservation-status ${getStatusClass(
                                            upcomingReservation.status
                                        )}`}
                                    >

                                        <span></span>

                                        {upcomingReservation.status}

                                    </span>

                                </div>


                                <div className="upcoming-date">

                                    <strong>

                                        {formatDate(
                                            upcomingReservation.date
                                        )}

                                    </strong>


                                    <span>

                                        {formatTime(
                                            upcomingReservation.time
                                        )}

                                    </span>

                                </div>


                                <div className="upcoming-details">


                                    <div>

                                        <FaClock />

                                        <span>

                                            {formatTime(
                                                upcomingReservation.time
                                            )}

                                        </span>

                                    </div>


                                    <div>

                                        <FaUtensils />

                                        <span>

                                            {upcomingReservation.table}

                                        </span>

                                    </div>


                                    <div>

                                        <FaUser />

                                        <span>

                                            {upcomingReservation.guests}
                                            {" "}
                                            Guests

                                        </span>

                                    </div>

                                </div>


                                <div className="upcoming-actions">


                                    <button
                                        type="button"
                                        className="view-button"
                                        onClick={goToReservations}
                                    >

                                        <FaEye />

                                        View Reservation

                                    </button>


                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() =>
                                            Swal.fire({

                                                icon: "info",

                                                title: "Cancel Reservation",

                                                text:
                                                    "You can cancel your reservation from My Reservations.",

                                                confirmButtonColor:
                                                    "#8b5e3c"

                                            })
                                        }
                                    >

                                        <FaTimesCircle />

                                        Cancel

                                    </button>

                                </div>

                            </div>

                        ) : (

                            <div className="empty-reservation">


                                <div className="empty-reservation-icon">

                                    <FaCalendarAlt />

                                </div>


                                <h3>
                                    No Upcoming Reservation
                                </h3>


                                <p>
                                    You don't have any upcoming reservations yet.
                                    Make a reservation to book your table.
                                </p>


                                <button
                                    type="button"
                                    onClick={goToReservation}
                                >

                                    <FaPlus />

                                    Make a Reservation

                                </button>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <div className="customer-panel quick-panel">


                        <div className="customer-panel-header">

                            <div>

                                <span>
                                    QUICK ACCESS
                                </span>


                                <h2>
                                    What would you like to do?
                                </h2>

                            </div>

                        </div>


                        <div className="quick-actions">


                            <button
                                type="button"
                                onClick={goToReservation}
                            >

                                <div className="quick-icon">

                                    <FaPlus />

                                </div>


                                <div>

                                    <strong>
                                        Make a Reservation
                                    </strong>

                                    <span>
                                        Book your next table
                                    </span>

                                </div>

                            </button>


                            <button
                                type="button"
                                onClick={goToReservations}
                            >

                                <div className="quick-icon">

                                    <FaClock />

                                </div>


                                <div>

                                    <strong>
                                        My Reservations
                                    </strong>

                                    <span>
                                        View your active bookings
                                    </span>

                                </div>

                            </button>


                            <button
                                type="button"
                                onClick={goToHistory}
                            >

                                <div className="quick-icon">

                                    <FaHistory />

                                </div>


                                <div>

                                    <strong>
                                        Reservation History
                                    </strong>

                                    <span>
                                        View your previous bookings
                                    </span>

                                </div>

                            </button>


                            <button
                                type="button"
                                onClick={goToProfile}
                            >

                                <div className="quick-icon">

                                    <FaUser />

                                </div>


                                <div>

                                    <strong>
                                        My Profile
                                    </strong>

                                    <span>
                                        Manage your account
                                    </span>

                                </div>

                            </button>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    RECENT RESERVATIONS
                ================================================= */}

                <section className="customer-panel recent-panel">


                    <div className="customer-panel-header">

                        <div>

                            <span>
                                RESERVATION ACTIVITY
                            </span>


                            <h2>
                                Recent Reservations
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="view-all-button"
                            onClick={goToHistory}
                        >

                            View All

                        </button>

                    </div>


                    {loadingReservations ? (

                        <div className="empty-recent">

                            <div className="empty-recent-icon">

                                <FaHourglassHalf />

                            </div>


                            <h3>
                                Loading Reservations...
                            </h3>


                            <p>
                                Please wait while we load your reservation activity.
                            </p>

                        </div>

                    ) : recentReservations.length > 0 ? (

                        <div className="recent-table-wrapper">

                            <table className="recent-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Reservation
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Time
                                        </th>

                                        <th>
                                            Table
                                        </th>

                                        <th>
                                            Guests
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {recentReservations.map(
                                        (reservation) => (

                                            <tr
                                                key={
                                                    reservation.id
                                                }
                                            >

                                                <td>

                                                    <strong>

                                                        RES-
                                                        {reservation.id}

                                                    </strong>

                                                </td>


                                                <td>

                                                    {formatDate(
                                                        reservation.date
                                                    )}

                                                </td>


                                                <td>

                                                    {formatTime(
                                                        reservation.time
                                                    )}

                                                </td>


                                                <td>

                                                    {reservation.table}

                                                </td>


                                                <td>

                                                    {reservation.guests}

                                                </td>


                                                <td>

                                                    <span
                                                        className={`table-status ${getStatusClass(
                                                            reservation.status
                                                        )}`}
                                                    >

                                                        {
                                                            reservation.status
                                                        }

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="empty-recent">


                            <div className="empty-recent-icon">

                                <FaHistory />

                            </div>


                            <h3>
                                No Reservation History
                            </h3>


                            <p>
                                Your reservation activity will appear here
                                once you make a reservation.
                            </p>


                            <button
                                type="button"
                                onClick={goToReservation}
                            >

                                <FaPlus />

                                Make Your First Reservation

                            </button>

                        </div>

                    )}

                </section>


                {/* =================================================
                    FOOTER
                ================================================= */}

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


export default CustomerDashboard;