import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";

import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaChair,
    FaUser,
    FaPhone,
    FaStickyNote,
    FaMoneyBillWave,
    FaSave
} from "react-icons/fa";

import "../../../css/form.css";


function EditReservation() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =========================================
    // STATE
    // =========================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    const [customerOptions, setCustomerOptions] =
        useState([]);

    const [tableOptions, setTableOptions] =
        useState([]);


    const [selectedCustomer, setSelectedCustomer] =
        useState(null);

    const [selectedTable, setSelectedTable] =
        useState(null);


    const [form, setForm] = useState({

        customer_id: "",

        contact: "",

        date: "",

        time: "",

        guests: 1,

        table_id: "",

        specialRequest: "",

        paymentStatus: "Unpaid",

        status: "Pending"

    });


    const [errors, setErrors] =
        useState({});


    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);


                // =================================
                // CUSTOMERS
                // =================================

                const customersResponse =
                    await axios.get(
                        "http://localhost/restaurant_reservation_system/server/api/customers/get_customers.php"
                    );


                if (
                    customersResponse.data.success
                ) {

                    const options =
                        customersResponse.data.data.map(
                            (customer) => ({

                                value:
                                    customer.customer_id,

                                label:
                                    `${customer.full_name} - ${customer.contact_number}`,

                                name:
                                    customer.full_name,

                                contact:
                                    customer.contact_number,

                                email:
                                    customer.email

                            })
                        );


                    setCustomerOptions(
                        options
                    );

                }


                // =================================
                // TABLES
                // =================================

                const tablesResponse =
                    await axios.get(
                        "http://localhost/restaurant_reservation_system/server/api/tables/get_tables.php"
                    );


                if (
                    tablesResponse.data.success
                ) {

                    const options =
                        tablesResponse.data.data.map(
                            (table) => ({

                                value:
                                    table.table_id,

                                label:
                                    `${table.table_number} - ${table.capacity} Seats`,

                                capacity:
                                    Number(
                                        table.capacity
                                    ),

                                location:
                                    table.location,

                                status:
                                    table.status

                            })
                        );


                    setTableOptions(
                        options
                    );

                }


                // =================================
                // RESERVATION
                // =================================

                const reservationResponse =
                    await axios.get(
                        `http://localhost/restaurant_reservation_system/server/api/reservations/get_reservation.php?id=${id}`
                    );


                if (
                    !reservationResponse.data.success
                ) {

                    throw new Error(
                        reservationResponse.data.message ||
                        "Reservation not found."
                    );

                }


                const reservation =
                    reservationResponse.data.data;


                // =================================
                // CUSTOMER
                // =================================

                const customer =
                    customersResponse.data.data.find(
                        (item) =>
                            Number(
                                item.customer_id
                            ) ===
                            Number(
                                reservation.customer_id
                            )
                    );


                if (customer) {

                    setSelectedCustomer({

                        value:
                            customer.customer_id,

                        label:
                            `${customer.full_name} - ${customer.contact_number}`,

                        name:
                            customer.full_name,

                        contact:
                            customer.contact_number,

                        email:
                            customer.email

                    });

                }


                // =================================
                // TABLE
                // =================================

                const table =
                    tablesResponse.data.data.find(
                        (item) =>
                            Number(
                                item.table_id
                            ) ===
                            Number(
                                reservation.table_id
                            )
                    );


                if (table) {

                    setSelectedTable({

                        value:
                            table.table_id,

                        label:
                            `${table.table_number} - ${table.capacity} Seats`,

                        capacity:
                            Number(
                                table.capacity
                            ),

                        location:
                            table.location,

                        status:
                            table.status

                    });

                }


                // =================================
                // FORM
                // =================================

                setForm({

                    customer_id:
                        reservation.customer_id,

                    contact:
                        reservation.contact_number ||
                        "",

                    date:
                        reservation.reservation_date ||
                        "",

                    time:
                        reservation.reservation_time
                            ? reservation.reservation_time.substring(
                                0,
                                5
                            )
                            : "",

                    guests:
                        reservation.guests ||
                        1,

                    table_id:
                        reservation.table_id,

                    specialRequest:
                        reservation.special_request ||
                        "",

                    paymentStatus:
                        reservation.payment_status ||
                        "Unpaid",

                    status:
                        reservation.status ||
                        "Pending"

                });


            } catch (error) {

                console.error(
                    "Load reservation error:",
                    error
                );


                Swal.fire({

                    title:
                        "Unable to Load",

                    text:
                        error.message ||
                        "Failed to load reservation.",

                    icon:
                        "error",

                    confirmButtonColor:
                        "#1f6f4a"

                }).then(() => {

                    navigate(
                        "/admin/reservations"
                    );

                });

            } finally {

                setLoading(false);

            }

        };


        loadData();

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
    // CUSTOMER CHANGE
    // =========================================

    const handleCustomerChange =
        (option) => {

            setSelectedCustomer(
                option
            );


            setForm((previous) => ({

                ...previous,

                customer_id:
                    option
                        ? option.value
                        : "",

                contact:
                    option
                        ? option.contact
                        : ""

            }));


            setErrors((previous) => ({

                ...previous,

                customer_id: ""

            }));

        };


    // =========================================
    // TABLE CHANGE
    // =========================================

    const handleTableChange =
        (option) => {

            setSelectedTable(
                option
            );


            setForm((previous) => ({

                ...previous,

                table_id:
                    option
                        ? option.value
                        : ""

            }));


            setErrors((previous) => ({

                ...previous,

                table_id: ""

            }));

        };


    // =========================================
    // VALIDATION
    // =========================================

    const validateForm = () => {

        const newErrors = {};


        if (!form.customer_id) {

            newErrors.customer_id =
                "Please select a customer.";

        }


        if (!form.date) {

            newErrors.date =
                "Please select a reservation date.";

        }


        if (!form.time) {

            newErrors.time =
                "Please select a reservation time.";

        }


        if (
            !form.guests ||
            Number(form.guests) < 1
        ) {

            newErrors.guests =
                "Number of guests must be at least 1.";

        }


        if (!form.table_id) {

            newErrors.table_id =
                "Please select a table.";

        }


        if (
            selectedTable &&
            Number(form.guests) >
            Number(selectedTable.capacity)
        ) {

            newErrors.table_id =
                `This table can only accommodate ${selectedTable.capacity} guests.`;

        }


        setErrors(
            newErrors
        );


        return (
            Object.keys(newErrors)
                .length === 0
        );

    };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!validateForm()) {

            Swal.fire({

                title:
                    "Incomplete Reservation",

                text:
                    "Please complete all required fields.",

                icon:
                    "warning",

                confirmButtonColor:
                    "#1f6f4a"

            });

            return;

        }


        const confirmation =
            await Swal.fire({

                title:
                    "Update Reservation?",

                text:
                    "Are you sure you want to save these changes?",

                icon:
                    "question",

                showCancelButton:
                    true,

                confirmButtonColor:
                    "#1f6f4a",

                cancelButtonColor:
                    "#6b7280",

                confirmButtonText:
                    "Yes, Update",

                cancelButtonText:
                    "Cancel"

            });


        if (!confirmation.isConfirmed) {

            return;

        }


        try {

            setSaving(true);


            const data = {

                reservation_id:
                    id,

                customer_id:
                    form.customer_id,

                table_id:
                    form.table_id,

                reservation_date:
                    form.date,

                reservation_time:
                    form.time,

                guests:
                    Number(form.guests),

                special_request:
                    form.specialRequest,

                payment_status:
                    form.paymentStatus,

                status:
                    form.status

            };


            console.log(
                "Updating reservation:",
                data
            );


            const response =
                await axios.post(
                    "http://localhost/restaurant_reservation_system/server/api/reservations/update_reservation.php",
                    data
                );


            if (
                response.data.success
            ) {

                await Swal.fire({

                    title:
                        "Updated!",

                    text:
                        "Reservation has been successfully updated.",

                    icon:
                        "success",

                    confirmButtonColor:
                        "#1f6f4a"

                });


                navigate(
                    "/admin/reservations"
                );

            } else {

                Swal.fire({

                    title:
                        "Update Failed",

                    text:
                        response.data.message ||
                        "Unable to update reservation.",

                    icon:
                        "error",

                    confirmButtonColor:
                        "#1f6f4a"

                });

            }


        } catch (error) {

            console.error(
                "Update reservation error:",
                error
            );


            Swal.fire({

                title:
                    "Server Error",

                text:
                    error.response?.data?.message ||
                    "Unable to connect to the server.",

                icon:
                    "error",

                confirmButtonColor:
                    "#1f6f4a"

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
            "/admin/reservations"
        );

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="form-page">

                <div
                    className="table-loading"
                    style={{
                        minHeight: "500px"
                    }}
                >

                    <div
                        className="loading-spinner"
                    ></div>

                    <p>
                        Loading reservation...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="form-page">


            {/* HEADER */}

            <div className="form-page-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={handleCancel}
                >

                    <FaArrowLeft />

                    Back to Reservations

                </button>


                <h1>
                    Edit Reservation
                </h1>


                <p>
                    Update reservation information.
                </p>

            </div>


            <form
                className="professional-form"
                onSubmit={handleSubmit}
            >


                {/* =====================================
                    CUSTOMER
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
                                Select the customer for this reservation.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        <div className="form-group">

                            <label>
                                Customer <span>*</span>
                            </label>


                            <Select
                                options={
                                    customerOptions
                                }
                                value={
                                    selectedCustomer
                                }
                                onChange={
                                    handleCustomerChange
                                }
                                placeholder={
                                    "Search customer..."
                                }
                                isClearable
                                classNamePrefix={
                                    "reservation-select"
                                }
                            />


                            {errors.customer_id && (

                                <small className="error-message">

                                    {
                                        errors.customer_id
                                    }

                                </small>

                            )}

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
                                        form.contact
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
                                Update date, time, guests, and table.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        {/* DATE */}

                        <div className="form-group">

                            <label>
                                Reservation Date <span>*</span>
                            </label>


                            <div className="input-icon-wrapper">

                                <FaCalendarAlt />

                                <input
                                    type="date"
                                    name="date"
                                    value={
                                        form.date
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {errors.date && (

                                <small className="error-message">

                                    {
                                        errors.date
                                    }

                                </small>

                            )}

                        </div>


                        {/* TIME */}

                        <div className="form-group">

                            <label>
                                Reservation Time <span>*</span>
                            </label>


                            <div className="input-icon-wrapper">

                                <FaClock />

                                <input
                                    type="time"
                                    name="time"
                                    value={
                                        form.time
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {errors.time && (

                                <small className="error-message">

                                    {
                                        errors.time
                                    }

                                </small>

                            )}

                        </div>


                        {/* GUESTS */}

                        <div className="form-group">

                            <label>
                                Number of Guests <span>*</span>
                            </label>


                            <div className="input-icon-wrapper">

                                <FaUsers />

                                <input
                                    type="number"
                                    name="guests"
                                    min="1"
                                    max="20"
                                    value={
                                        form.guests
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {errors.guests && (

                                <small className="error-message">

                                    {
                                        errors.guests
                                    }

                                </small>

                            )}

                        </div>


                        {/* TABLE */}

                        <div className="form-group">

                            <label>
                                Table <span>*</span>
                            </label>


                            <Select
                                options={
                                    tableOptions
                                }
                                value={
                                    selectedTable
                                }
                                onChange={
                                    handleTableChange
                                }
                                placeholder={
                                    "Select table..."
                                }
                                isClearable
                                classNamePrefix={
                                    "reservation-select"
                                }
                                formatOptionLabel={
                                    (option) => (

                                        <div
                                            className="table-option"
                                        >

                                            <FaChair />

                                            <div>

                                                <strong>
                                                    {
                                                        option.label
                                                    }
                                                </strong>

                                                <small>
                                                    {
                                                        option.location
                                                    }
                                                    {" • "}
                                                    {
                                                        option.status
                                                    }
                                                </small>

                                            </div>

                                        </div>

                                    )
                                }
                            />


                            {errors.table_id && (

                                <small className="error-message">

                                    {
                                        errors.table_id
                                    }

                                </small>

                            )}

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
                                Update customer requests or notes.
                            </p>

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
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
                            placeholder={
                                "Example: Birthday setup, window seat, anniversary dinner..."
                            }
                            rows="4"
                        />

                    </div>

                </div>


                {/* =====================================
                    PAYMENT
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
                                Update payment and reservation status.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        <div className="form-group">

                            <label>
                                Payment Status
                            </label>


                            <select
                                name="paymentStatus"
                                value={
                                    form.paymentStatus
                                }
                                onChange={
                                    handleChange
                                }
                            >

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

                        </div>


                        <div className="form-group">

                            <label>
                                Reservation Status
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

                        </div>

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={
                            handleCancel
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={
                            saving
                        }
                    >

                        <FaSave />

                        {
                            saving
                                ? "Saving..."
                                : "Save Changes"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

}


export default EditReservation;

