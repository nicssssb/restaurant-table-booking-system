import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import {
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaChair,
    FaCommentAlt,
    FaCheckCircle,
    FaArrowLeft,
    FaArrowRight
} from "react-icons/fa";

import "../../../css/customer-reservation.css";
import CustomerSidebar from "../Components/CustomerSidebar";

function MakeReservation() {

    const navigate = useNavigate();


    // =========================================================
    // CUSTOMER
    // =========================================================

    const [customer] = useState(() => {

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

    const customerId =
        customer?.customer_id ||
        customer?.id ||
        null;

    const customerName =
        customer?.full_name ||
        customer?.name ||
        "Customer";


    // =========================================================
    // FORM
    // =========================================================

    const [form, setForm] = useState({

        date: "",
        time: "",
        guests: 1,
        table: "",
        specialRequest: ""

    });

    const [step, setStep] = useState(1);


    // =========================================================
    // TABLES
    // =========================================================

    const [tables, setTables] = useState([]);

    const [loadingTables, setLoadingTables] = useState(false);


    // =========================================================
    // LOAD AVAILABLE TABLES
    // =========================================================

    useEffect(() => {

        const loadTables = async () => {

            if (!form.date || !form.time) {

                setTables([]);

                return;

            }

            try {

                setLoadingTables(true);

                const response = await axios.get(

                    "http://localhost/restaurant_reservation_system/server/api/tables/get_available_tables.php",

                    {
                        params: {
                            date: form.date,
                            time: form.time
                        }
                    }

                );

                let tableData = [];

                if (Array.isArray(response.data)) {

                    tableData = response.data;

                }

                else if (
                    response.data &&
                    Array.isArray(response.data.tables)
                ) {

                    tableData = response.data.tables;

                }

                else if (
                    response.data &&
                    Array.isArray(response.data.data)
                ) {

                    tableData = response.data.data;

                }

                else if (
                    response.data &&
                    Array.isArray(response.data.results)
                ) {

                    tableData = response.data.results;

                }


                const normalizedTables = tableData.map((table) => ({

                    table_id:
                        table.table_id ??
                        table.id,

                    table_number:
                        table.table_number ??
                        table.tableNumber ??
                        table.number,

                    capacity:
                        Number(
                            table.capacity ?? 0
                        ),

                    location:
                        table.location ??
                        "Indoor",

                    status:
                        table.status ??
                        "Available"

                }));


                setTables(normalizedTables);


            } catch (error) {

                console.error(
                    "LOAD TABLES ERROR:",
                    error
                );

                setTables([]);

                Swal.fire({

                    icon: "error",

                    title: "Unable to Load Tables",

                    text:
                        "The system could not load the available tables.",

                    confirmButtonColor: "#8b5e3c"

                });

            } finally {

                setLoadingTables(false);

            }

        };


        loadTables();

    }, [form.date, form.time]);


    // =========================================================
    // FILTER AVAILABLE TABLES
    // =========================================================

    const availableTables = tables.filter((table) => {

        const status =
            String(
                table.status ?? "Available"
            )
                .trim()
                .toLowerCase();

        const capacity =
            Number(table.capacity);

        const guests =
            Number(form.guests);

        const isAvailable =
            status === "" ||
            status === "available" ||
            status === "null";

        return (
            isAvailable &&
            capacity >= guests
        );

    });


    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: value,

            ...(name === "date" ||
                name === "time" ||
                name === "guests"
                ? { table: "" }
                : {})

        }));

    };


    // =========================================================
    // NEXT
    // =========================================================

    const handleNext = () => {

        // STEP 1

        if (step === 1) {

            if (!form.date || !form.time) {

                Swal.fire({

                    icon: "warning",

                    title:
                        "Reservation Schedule Required",

                    text:
                        "Please select your preferred date and time.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

                return;

            }


            const selectedDate =
                new Date(form.date);

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            if (selectedDate < today) {

                Swal.fire({

                    icon: "warning",

                    title:
                        "Invalid Date",

                    text:
                        "Please select today or a future date.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

                return;

            }

        }


        // STEP 2

        if (step === 2) {

            if (
                !form.guests ||
                Number(form.guests) < 1
            ) {

                Swal.fire({

                    icon: "warning",

                    title:
                        "Number of Guests Required",

                    text:
                        "Please enter the number of guests.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

                return;

            }

        }


        // STEP 3

        if (step === 3) {

            if (!form.table) {

                Swal.fire({

                    icon: "warning",

                    title:
                        "Select a Table",

                    text:
                        "Please choose an available table.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

                return;

            }

        }


        setStep(
            (prev) => prev + 1
        );

    };


    // =========================================================
    // BACK
    // =========================================================

    const handleBack = () => {

        if (step === 1) {

            navigate(
                "/customer/dashboard"
            );

            return;

        }

        setStep(
            (prev) => prev - 1
        );

    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!customerId) {

            Swal.fire({

                icon: "error",

                title:
                    "Customer Account Not Found",

                text:
                    "Please log in again before making a reservation.",

                confirmButtonColor:
                    "#8b5e3c"

            });

            return;

        }


        const selectedTable =
            tables.find(
                (table) =>
                    Number(table.table_id) ===
                    Number(form.table)
            );


        if (!selectedTable) {

            Swal.fire({

                icon: "error",

                title:
                    "Table Not Found",

                text:
                    "The selected table is no longer available.",

                confirmButtonColor:
                    "#8b5e3c"

            });

            return;

        }


        // =====================================================
        // CONFIRMATION
        // =====================================================

        const result =
            await Swal.fire({

                icon: "question",

                title:
                    "Confirm Reservation?",

                html: `

                    <div
                        style="
                            text-align:left;
                            line-height:1.9;
                        "
                    >

                        <strong>Date:</strong>
                        ${form.date}

                        <br />

                        <strong>Time:</strong>
                        ${form.time}

                        <br />

                        <strong>Guests:</strong>
                        ${form.guests}

                        <br />

                        <strong>Table:</strong>
                        ${selectedTable.table_number}

                        <br />

                        <strong>Location:</strong>
                        ${selectedTable.location}

                        <br />

                        <strong>Special Request:</strong>
                        ${form.specialRequest || "None"}

                    </div>

                `,

                showCancelButton: true,

                confirmButtonColor:
                    "#8b5e3c",

                cancelButtonColor:
                    "#6b7280",

                confirmButtonText:
                    "Confirm Reservation",

                cancelButtonText:
                    "Review Again"

            });


        if (!result.isConfirmed) {

            return;

        }


        // =====================================================
        // SAVE
        // =====================================================

        try {

            const response =
                await axios.post(

                    "http://localhost/restaurant_reservation_system/server/api/reservations/create_reservation.php",

                    {

                        customer_id:
                            customerId,

                        table_id:
                            form.table,

                        reservation_date:
                            form.date,

                        reservation_time:
                            form.time,

                        guests:
                            Number(form.guests),

                        special_request:
                            form.specialRequest,

                        payment_status:
                            "Unpaid",

                        status:
                            "Pending"

                    }

                );


            if (!response.data.success) {

                Swal.fire({

                    icon: "error",

                    title:
                        "Reservation Failed",

                    text:
                        response.data.message ||
                        "Unable to create reservation.",

                    confirmButtonColor:
                        "#8b5e3c"

                });

                return;

            }


            await Swal.fire({

                icon: "success",

                title:
                    "Reservation Submitted!",

                text:
                    "Your reservation has been submitted successfully. Please wait for confirmation.",

                confirmButtonColor:
                    "#8b5e3c"

            });


            navigate(
                "/customer/reservations"
            );


        } catch (error) {

            console.error(
                "CREATE RESERVATION ERROR:",
                error
            );


            Swal.fire({

                icon: "error",

                title:
                    "Reservation Failed",

                text:
                    error.response?.data?.message ||
                    "Something went wrong while saving your reservation.",

                confirmButtonColor:
                    "#8b5e3c"

            });

        }

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="customer-reservation-layout">

            <CustomerSidebar />

            <main className="customer-reservation-main">

                {/* HEADER */}

                <div className="customer-reservation-header">

                    <div className="customer-reservation-header-copy">
                        <span className="customer-reservation-eyebrow">
                            TABLE RESERVATION
                        </span>

                        <h1>
                            Make a Reservation
                        </h1>

                        <p>
                            Hi {customerName}. Choose your schedule, number of guests,
                            and preferred table in four simple steps.
                        </p>
                    </div>

                    <div className="customer-reservation-step-badge">
                        <span>Current progress</span>
                        <strong>Step {step} of 4</strong>
                    </div>

                </div>


                {/* PROGRESS */}

                <div className="reservation-progress">


                    <div
                        className={
                            step >= 1
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        <span>
                            1
                        </span>

                        <small>
                            Schedule
                        </small>

                    </div>


                    <div className="progress-line"></div>


                    <div
                        className={
                            step >= 2
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        <span>
                            2
                        </span>

                        <small>
                            Guests
                        </small>

                    </div>


                    <div className="progress-line"></div>


                    <div
                        className={
                            step >= 3
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        <span>
                            3
                        </span>

                        <small>
                            Table
                        </small>

                    </div>


                    <div className="progress-line"></div>


                    <div
                        className={
                            step >= 4
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        <span>
                            4
                        </span>

                        <small>
                            Review
                        </small>

                    </div>

                </div>


                {/* FORM */}

                <form
                    className="customer-reservation-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        STEP 1
                    ================================================= */}

                    {step === 1 && (

                        <div className="reservation-step">

                            <div className="reservation-step-icon">

                                <FaCalendarAlt />

                            </div>


                            <h2>
                                Choose Date & Time
                            </h2>


                            <p>
                                When would you like to dine with us?
                            </p>


                            <div className="reservation-form-grid">


                                {/* DATE */}

                                <div className="reservation-form-group">

                                    <label>
                                        Reservation Date
                                    </label>


                                    <div className="customer-input-wrapper">

                                        <FaCalendarAlt />


                                        <input
                                            type="date"
                                            name="date"
                                            value={form.date}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>


                                {/* TIME */}

                                <div className="reservation-form-group">

                                    <label>
                                        Reservation Time
                                    </label>


                                    <div className="customer-input-wrapper">

                                        <FaClock />


                                        <input
                                            type="time"
                                            name="time"
                                            value={form.time}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        STEP 2
                    ================================================= */}

                    {step === 2 && (

                        <div className="reservation-step">

                            <div className="reservation-step-icon">

                                <FaUsers />

                            </div>


                            <h2>
                                Number of Guests
                            </h2>


                            <p>
                                How many people will be dining?
                            </p>


                            <div className="guest-selector">


                                <button
                                    type="button"
                                    className="guest-selector-button"
                                    aria-label="Decrease number of guests"
                                    onClick={() => {

                                        const current =
                                            Number(form.guests);


                                        if (current > 1) {

                                            setForm(
                                                (prev) => ({

                                                    ...prev,

                                                    guests:
                                                        current - 1,

                                                    table:
                                                        ""

                                                })
                                            );

                                        }

                                    }}
                                >
                                    −
                                </button>


                                <div>

                                    <FaUsers />

                                    <strong>
                                        {form.guests}
                                    </strong>

                                    <span>
                                        Guests
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="guest-selector-button"
                                    aria-label="Increase number of guests"
                                    onClick={() => {

                                        setForm(
                                            (prev) => ({

                                                ...prev,

                                                guests:
                                                    Number(prev.guests) + 1,

                                                table:
                                                    ""

                                            })
                                        );

                                    }}
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        STEP 3
                    ================================================= */}

                    {step === 3 && (

                        <div className="reservation-step">


                            <div className="reservation-step-icon">

                                <FaChair />

                            </div>


                            <h2>
                                Choose Your Table
                            </h2>


                            <p>
                                Select an available table that fits your group.
                            </p>


                            {loadingTables && (

                                <div className="no-table loading-table-state">

                                    <FaChair />
                                    <p>Loading available tables...</p>

                                </div>

                            )}


                            {!loadingTables &&
                                availableTables.length > 0 && (

                                    <div className="table-selection">

                                        {availableTables.map(
                                            (table) => (

                                                <button
                                                    type="button"
                                                    key={table.table_id}
                                                    className={
                                                        Number(form.table) ===
                                                        Number(table.table_id)
                                                            ? "table-card selected"
                                                            : "table-card"
                                                    }
                                                    onClick={() => {

                                                        setForm(
                                                            (prev) => ({

                                                                ...prev,

                                                                table:
                                                                    table.table_id

                                                            })
                                                        );

                                                    }}
                                                >

                                                    <div className="table-card-icon">

                                                        <FaChair />

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {table.table_number}
                                                        </strong>


                                                        <span>
                                                            {table.capacity} seats
                                                        </span>


                                                        <small>
                                                            {table.location}
                                                        </small>


                                                        <small>
                                                            Available
                                                        </small>

                                                    </div>


                                                    {Number(form.table) ===
                                                        Number(table.table_id) && (

                                                        <FaCheckCircle
                                                            className="table-check"
                                                        />

                                                    )}

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}


                            {!loadingTables &&
                                availableTables.length === 0 && (

                                    <div className="no-table">

                                        <FaChair />

                                        <p>

                                            No available table can accommodate{" "}

                                            {form.guests}

                                            {" "}guest(s) for the selected date and time.

                                        </p>


                                        <small>

                                            Please choose another date, time,
                                            or number of guests.

                                        </small>

                                    </div>

                                )}

                        </div>

                    )}


                    {/* =================================================
                        STEP 4
                    ================================================= */}

                    {step === 4 && (

                        <div className="reservation-step">


                            <div className="reservation-step-icon">

                                <FaCheckCircle />

                            </div>


                            <h2>
                                Review Reservation
                            </h2>


                            <p>
                                Please review your reservation details before confirming.
                            </p>


                            <div className="reservation-summary">


                                <div>

                                    <span>
                                        Date
                                    </span>

                                    <strong>
                                        {form.date}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Time
                                    </span>

                                    <strong>
                                        {form.time}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Guests
                                    </span>

                                    <strong>
                                        {form.guests}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Table
                                    </span>

                                    <strong>

                                        {
                                            tables.find(
                                                (table) =>
                                                    Number(table.table_id) ===
                                                    Number(form.table)
                                            )?.table_number || "-"
                                        }

                                    </strong>

                                </div>

                            </div>


                            <div className="reservation-form-group">

                                <label>

                                    <FaCommentAlt />

                                    Special Request

                                </label>


                                <textarea
                                    name="specialRequest"
                                    value={
                                        form.specialRequest
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Any special request? (Optional)"
                                />

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="reservation-actions">


                        <button
                            type="button"
                            className="reservation-secondary"
                            onClick={handleBack}
                        >

                            {step === 1 ? (
                                "Cancel"
                            ) : (
                                <>
                                    <FaArrowLeft />
                                    Back
                                </>
                            )}

                        </button>


                        {step < 4 ? (

                            <button
                                type="button"
                                className="reservation-primary"
                                onClick={handleNext}
                            >

                                Continue
                                <FaArrowRight />

                            </button>

                        ) : (

                            <button
                                type="submit"
                                className="reservation-primary"
                            >

                                <FaCheckCircle />

                                Confirm Reservation

                            </button>

                        )}

                    </div>

                </form>

            </main>

        </div>

    );

}

export default MakeReservation;