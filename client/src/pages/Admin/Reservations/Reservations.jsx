import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaTimes,
    FaCalendarAlt,
    FaUsers,
    FaChair,
    FaPhone,
    FaSyncAlt
} from "react-icons/fa";

import "../../../css/reservations.css";


function Reservations() {

    const navigate = useNavigate();


    // =========================================
    // STATE
    // =========================================

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");


    // =========================================
    // GET RESERVATIONS
    // =========================================

    const fetchReservations = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                "http://localhost/restaurant_reservation_system/server/api/reservations/get_reservations.php"
            );

            console.log("Reservations API:", response.data);


            if (response.data.success) {

                setReservations(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );

            } else {

                setReservations([]);

                Swal.fire({
                    title: "Unable to Load Reservations",
                    text:
                        response.data.message ||
                        "Failed to load reservations.",
                    icon: "error",
                    confirmButtonColor: "#1f6f4a"
                });
            }

        } catch (error) {

            console.error(
                "Reservation loading error:",
                error
            );

            setReservations([]);

            Swal.fire({
                title: "Server Error",
                text:
                    error.response?.data?.message ||
                    "Unable to connect to the reservation server.",
                icon: "error",
                confirmButtonColor: "#1f6f4a"
            });

        } finally {

            setLoading(false);
        }
    };


    // Load reservations when page opens
    useEffect(() => {
        fetchReservations();
    }, []);


    // =========================================
    // FILTER RESERVATIONS
    // =========================================

    const filteredReservations = useMemo(() => {

        return reservations.filter((reservation) => {

            const searchValue = search
                .toLowerCase()
                .trim();


            // SEARCH
            const matchesSearch =
                !searchValue ||

                String(reservation.customer_name || "")
                    .toLowerCase()
                    .includes(searchValue) ||

                String(reservation.contact_number || "")
                    .toLowerCase()
                    .includes(searchValue) ||

                String(reservation.table_number || "")
                    .toLowerCase()
                    .includes(searchValue);


            // STATUS FILTER
            const matchesStatus =
                statusFilter === "All" ||
                reservation.status === statusFilter;


            // PAYMENT FILTER
            const matchesPayment =
                paymentFilter === "All" ||
                reservation.payment_status === paymentFilter;


            // DATE FILTER
            const matchesDate =
                !dateFilter ||
                reservation.reservation_date === dateFilter;


            // ALL CONDITIONS MUST BE TRUE
            return (
                matchesSearch &&
                matchesStatus &&
                matchesPayment &&
                matchesDate
            );
        });

    }, [
        reservations,
        search,
        statusFilter,
        paymentFilter,
        dateFilter
    ]);


    // =========================================
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {

        switch (String(status).toLowerCase()) {

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


    // =========================================
    // PAYMENT CLASS
    // =========================================

    const getPaymentClass = (status) => {

        switch (String(status).toLowerCase()) {

            case "paid":
                return "payment-paid";

            case "partial":
                return "payment-partial";

            case "refunded":
                return "payment-refunded";

            case "unpaid":
            default:
                return "payment-unpaid";
        }
    };


    // =========================================
    // CANCEL RESERVATION
    // =========================================

    const handleCancel = async (reservation) => {

        // Confirmation dialog
        const result = await Swal.fire({

            title: "Cancel Reservation?",

            html: `
            
                <div style="text-align:left">

                    <strong>Customer:</strong>
                    ${reservation.customer_name}

                    <br />

                    <strong>Date:</strong>
                    ${reservation.reservation_date}

                    <br />

                    <strong>Time:</strong>
                    ${reservation.reservation_time}

                    <br />

                    <strong>Table:</strong>
                    ${reservation.table_number}

                </div>
          `,

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",

            confirmButtonText: "Yes, Cancel Reservation",
            cancelButtonText: "Keep Reservation"
        });


        // Stop if user does not confirm
        if (!result.isConfirmed) {
            return;
        }


        // =========================================
        // CANCEL RESERVATION API
        // =========================================

        try {

            Swal.fire({
                title: "Cancelling Reservation...",
                text: "Please wait.",
                allowOutsideClick: false,
                allowEscapeKey: false,

                didOpen: () => {
                    Swal.showLoading();
                }
            });


            const response = await axios.post(
                "http://localhost/restaurant_reservation_system/server/api/reservations/cancel_reservation.php",

                {
                    reservation_id:
                        Number(reservation.reservation_id)
                },

                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


            // Check API response
            if (response.data.success) {

                await Swal.fire({
                    title: "Reservation Cancelled",
                    text:
                        response.data.message ||
                        "The reservation has been cancelled successfully.",
                    icon: "success",
                    confirmButtonColor: "#1f6f4a"
                });


                // Reload reservations from database
                fetchReservations();

            } else {

                Swal.fire({
                    title: "Cancellation Failed", //error message
                    text:
                        response.data.message || // message mula sa server
                        "Unable to cancel reservation.", //deafult message
                    icon: "error",
                    confirmButtonColor: "#1f6f4a"
                });
            }

        } catch (error) {

            console.error(
                "Cancel Reservation Error:",
                error
            );

            Swal.fire({
                title: "Server Error",
                text:
                    error.response?.data?.message ||
                    "Unable to connect to the reservation server.",
                icon: "error",
                confirmButtonColor: "#1f6f4a"
            });
        }
    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const dateObject = new Date(
            `${date}T00:00:00` //Kino-convert nito ang date string into a JavaScript Date object para ma-format ito.
        );

        return dateObject.toLocaleDateString( //Kino-convert nito ang date object sa readable date format.
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    };


    // =========================================
    // FORMAT TIME
    // =========================================

    const formatTime = (time) => { //ginagawang readable ang oras

        if (!time) {
            return "-";
        }

        const [hours, minutes] = time //Hinahati nito ang time sa hours at minutes, at kino-convert ang mga ito sa number.
            .split(":")
            .map(Number);


        const date = new Date(); //Gumagawa ito ng bagong JavaScript Date object na gagamitin para ma-format ang oras.

        date.setHours(//Sine-set nito ang hours at minutes ng Date object gamit ang nakuha nating time.
            hours,
            minutes,
            0
        );


        return date.toLocaleTimeString( //Kino-convert nito ang time sa mas madaling basahin na format.
            "en-US",//Ginagamit nito ang US format ng oras.
            {
                hour: "numeric",
                minute: "2-digit"//
            }
        );
    };


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="reservations-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="reservations-header">

                <div>

                    <h1>
                        Reservations
                    </h1>

                    <p>
                        Manage restaurant reservations
                        and bookings.
                    </p>

                </div>


                <Link
                    to="/admin/reservations/add"
                    className="add-reservation-btn"
                >

                    <FaPlus />

                    Add Reservation

                </Link>

            </div>


            {/* =================================
                SUMMARY
            ================================= */}

            <div className="reservation-summary">


                {/* TOTAL */}

                <div className="summary-card">

                    <div>

                        <span>
                            Total Reservations
                        </span>

                        <strong>
                            {reservations.length}
                        </strong>

                    </div>

                    

                </div>


                {/* PENDING */}

                <div className="summary-card">

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {
                                reservations.filter(
                                    (item) =>
                                        item.status ===
                                        "Pending"
                                ).length
                            }
                        </strong>

                    </div>

                </div>


                {/* CONFIRMED */}

                <div className="summary-card">

                    <div>

                        <span>
                            Confirmed
                        </span>

                        <strong>
                            {
                                reservations.filter(
                                    (item) =>
                                        item.status ===
                                        "Confirmed"
                                ).length
                            }
                        </strong>

                    </div>

                </div>


                {/* COMPLETED */}

                <div className="summary-card">

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {
                                reservations.filter(
                                    (item) =>
                                        item.status ===
                                        "Completed"
                                ).length
                            }
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================
                FILTERS
            ================================= */}

            <div className="reservation-filters">


                {/* SEARCH */}

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search customer, contact, or table..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* DATE */}

                <div className="filter-item">

                    <FaCalendarAlt />

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) =>
                            setDateFilter(e.target.value)
                        }
                    />

                </div>


                {/* STATUS */}

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="All">
                        All Status
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Confirmed">
                        Confirmed
                    </option>

                    <option value="Completed">
                        Completed
                    </option>

                    <option value="Cancelled">
                        Cancelled
                    </option>

                </select>


                {/* PAYMENT */}

                <select
                    value={paymentFilter}
                    onChange={(e) =>
                        setPaymentFilter(e.target.value)
                    }
                >

                    <option value="All">
                        All Payments
                    </option>

                    <option value="Unpaid">
                        Unpaid
                    </option>

                    <option value="Partial">
                        Partial
                    </option>

                    <option value="Paid">
                        Paid
                    </option>

                    <option value="Refunded">
                        Refunded
                    </option>

                </select>


                {/* REFRESH */}

                <button
                    type="button"
                    className="refresh-btn"
                    onClick={fetchReservations}
                    title="Refresh"
                >

                    <FaSyncAlt />

                </button>

            </div>


            {/* =================================
                TABLE
            ================================= */}

            <div className="reservation-table-wrapper">


                {/* LOADING */}

                {loading ? (

                    <div className="table-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading reservations...
                        </p>

                    </div>


                ) : filteredReservations.length === 0 ? (

                    /* EMPTY */

                    <div className="empty-reservations">

                        <FaCalendarAlt />

                        <h3>
                            No Reservations Found
                        </h3>

                        <p>
                            There are no reservations
                            matching your filters.
                        </p>


                        <Link
                            to="/admin/reservations/add"
                            className="empty-add-btn"
                        >

                            <FaPlus />

                            Add Reservation

                        </Link>

                    </div>


                ) : (

                    /* RESERVATION TABLE */

                    <table className="reservations-table">

                        <thead>

                            <tr>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Date & Time
                                </th>

                                <th>
                                    Guests
                                </th>

                                <th>
                                    Table
                                </th>

                                <th>
                                    Payment
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredReservations.map(
                                (reservation) => (

                                    <tr
                                        key={
                                            reservation.reservation_id
                                        }
                                    >


                                        {/* CUSTOMER */}

                                        <td>

                                            <div className="customer-cell">

                                                <div className="customer-avatar">

                                                    {
                                                        reservation.customer_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                    }

                                                </div>


                                                <div>

                                                    <strong>
                                                        {
                                                            reservation.customer_name
                                                        }
                                                    </strong>

                                                    <small>

                                                        <FaPhone />

                                                        {
                                                            reservation.contact_number
                                                        }

                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            <div className="date-cell">

                                                <strong>

                                                    <FaCalendarAlt />

                                                    {
                                                        formatDate(
                                                            reservation.reservation_date
                                                        )
                                                    }

                                                </strong>

                                                <small>

                                                    {
                                                        formatTime(
                                                            reservation.reservation_time
                                                        )
                                                    }

                                                </small>

                                            </div>

                                        </td>


                                        {/* GUESTS */}

                                        <td>

                                            <span className="guests-cell">

                                                <FaUsers />

                                                {
                                                    reservation.guests
                                                }

                                            </span>

                                        </td>


                                        {/* TABLE */}

                                        <td>

                                            <div className="table-cell">

                                                <FaChair />

                                                <div>

                                                    <strong>
                                                        {
                                                            reservation.table_number
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            reservation.table_location
                                                        }
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* PAYMENT */}

                                        <td>

                                            <span
                                                className={
                                                    `payment-badge ${
                                                        getPaymentClass(
                                                            reservation.payment_status
                                                        )
                                                    }`
                                                }
                                            >

                                                {
                                                    reservation.payment_status
                                                }

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={
                                                    `status-badge ${
                                                        getStatusClass(
                                                            reservation.status
                                                        )
                                                    }`
                                                }
                                            >

                                                {
                                                    reservation.status
                                                }

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="action-buttons">


                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    className="action-view"
                                                    title="View Reservation"

                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/reservations/view/${reservation.reservation_id}`
                                                        )
                                                    }
                                                >

                                                    <FaEye />

                                                </button>


                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    className="action-edit"
                                                    title="Edit Reservation"

                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/reservations/edit/${reservation.reservation_id}`
                                                        )
                                                    }
                                                >

                                                    <FaEdit />

                                                </button>


                                                {/* CANCEL */}

                                                <button
                                                    type="button"
                                                    className="action-cancel"
                                                    title="Cancel Reservation"

                                                    onClick={() =>
                                                        handleCancel(
                                                            reservation
                                                        )
                                                    }
                                                >

                                                    <FaTimes />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =================================
                FOOTER
            ================================= */}

            {!loading &&
                filteredReservations.length > 0 && (

                    <div className="reservation-footer">

                        Showing{" "}

                        <strong>
                            {
                                filteredReservations.length
                            }
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {
                                reservations.length
                            }
                        </strong>

                        {" "}reservations

                    </div>

                )}

        </div>
    );
}


export default Reservations;