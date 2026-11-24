import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    FaSave,
    FaCheckCircle
} from "react-icons/fa";

import "../../../css/form.css";


function AddReservation() {

    const navigate = useNavigate();


    // =========================================
    // CUSTOMER DATA
    // =========================================

    const [customerOptions, setCustomerOptions] =
        useState([]);

    const [loadingCustomers, setLoadingCustomers] =
        useState(false);


    // =========================================
    // TABLE DATA
    // =========================================

    const [tableOptions, setTableOptions] =
        useState([]);

    const [loadingTables, setLoadingTables] =
        useState(false);


    // =========================================
    // FORM
    // =========================================

    const [form, setForm] = useState({

        customer: "",

        customerId: "",

        contact: "",

        date: "",

        time: "",

        guests: 1,

        table: "",

        tableId: "",

        specialRequest: "",

        paymentStatus: "Unpaid",

        status: "Pending"

    });


    const [selectedCustomer, setSelectedCustomer] =
        useState(null);


    const [selectedTable, setSelectedTable] =
        useState(null);


    const [errors, setErrors] =
        useState({});


    // =========================================
    // LOAD CUSTOMERS
    // =========================================

    useEffect(() => {

        const fetchCustomers = async () => {

            try {

                setLoadingCustomers(true);


                const response = await axios.get(
                    "http://localhost/restaurant_reservation_system/server/api/customers/get_customers.php"
                );


                if (response.data.success) {

                    const options =
                        response.data.data.map(
                            (customer) => ({

                                value:
                                    Number(
                                        customer.customer_id
                                    ),

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


                    setCustomerOptions(options);

                }

            } catch (error) {

                console.error(
                    "Failed to load customers:",
                    error
                );


                Swal.fire({

                    title: "Customer Loading Error",

                    text:
                        "Unable to load customers from the database.",

                    icon: "error",

                    confirmButtonColor: "#1f6f4a"

                });

            } finally {

                setLoadingCustomers(false);

            }

        };


        fetchCustomers();

    }, []);


    // =========================================
    // LOAD TABLES
    // =========================================

    useEffect(() => {

    const fetchTables = async () => {

        try {

            setLoadingTables(true);

            const response = await axios.get(
                "http://localhost/restaurant_reservation_system/server/api/tables/get_tables.php"
            );

            console.log(
                "TABLE API:",
                response.data
            );

            if (
                response.data.success &&
                Array.isArray(response.data.data)
            ) {

                const options =
                    response.data.data.map((table) => ({

                        value: table.table_id,

                        label:
                            `${table.table_number} - ${table.capacity} Seats`,

                        tableId:
                            table.table_id,

                        tableNumber:
                            table.table_number,

                        capacity:
                            Number(table.capacity),

                        location:
                            table.location,

                        status:
                            table.status

                    }));

                console.log(
                    "TABLE OPTIONS:",
                    options
                );

                setTableOptions(options);

            } else {

                setTableOptions([]);

                Swal.fire({

                    title: "No Tables Found",

                    text:
                        response.data.message ||
                        "No restaurant tables were found.",

                    icon: "warning",

                    confirmButtonColor: "#1f6f4a"

                });

            }

        } catch (error) {

            console.error(
                "TABLE API ERROR:",
                error
            );

            setTableOptions([]);

            Swal.fire({

                title: "Table Loading Error",

                text:
                    error.response?.data?.message ||
                    "Unable to load restaurant tables.",

                icon: "error",

                confirmButtonColor: "#1f6f4a"

            });

        } finally {

            setLoadingTables(false);

        }

    };

    fetchTables();

}, []);


    // =========================================
    // AVAILABLE TABLES
    // =========================================

   const availableTables = useMemo(() => {

    const guests = Number(form.guests) || 0;

    return tableOptions.filter((table) => {

        const tableStatus =
            String(table.status || "")
                .trim()
                .toLowerCase();

        const capacity =
            Number(table.capacity) || 0;

        return (
            tableStatus === "available" &&
            capacity >= guests
        );

    });

}, [form.guests, tableOptions]);


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


        // =====================================
        // GUEST COUNT CHANGE
        // =====================================

        if (name === "guests") {

            const guests =
                Number(value);


            if (
                selectedTable &&
                guests >
                selectedTable.capacity
            ) {

                setSelectedTable(null);


                setForm((previous) => ({

                    ...previous,

                    table: "",

                    tableId: ""

                }));

            }

        }

    };


    // =========================================
    // CUSTOMER CHANGE
    // =========================================

    const handleCustomerChange = (option) => {

        setSelectedCustomer(option);


        if (option) {

            setForm((previous) => ({

                ...previous,

                customer:
                    option.name,

                customerId:
                    option.value,

                contact:
                    option.contact

            }));

        } else {

            setForm((previous) => ({

                ...previous,

                customer: "",

                customerId: "",

                contact: ""

            }));

        }


        setErrors((previous) => ({

            ...previous,

            customer: ""

        }));

    };


    // =========================================
    // TABLE CHANGE
    // =========================================

    const handleTableChange = (option) => {

        setSelectedTable(option);


        setForm((previous) => ({

            ...previous,

            table:
                option
                    ? option.tableNumber
                    : "",

            tableId:
                option
                    ? option.value
                    : ""

        }));


        setErrors((previous) => ({

            ...previous,

            table: ""

        }));

    };


    // =========================================
    // VALIDATION
    // =========================================

    const validateForm = () => {

        const newErrors = {};


        if (!form.customerId) {

            newErrors.customer =
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


        if (!form.tableId) {

            newErrors.table =
                "Please select an available table.";

        }


        if (
            selectedTable &&
            Number(form.guests) >
            selectedTable.capacity
        ) {

            newErrors.table =
                `This table can only accommodate ${selectedTable.capacity} guests.`;

        }


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        if (
            form.date &&
            form.date < today
        ) {

            newErrors.date =
                "Reservation date cannot be in the past.";

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


    // =========================================
    // VALIDATE FORM
    // =========================================

    if (!validateForm()) {

        Swal.fire({

            title: "Incomplete Reservation",

            text: "Please complete all required fields.",

            icon: "warning",

            confirmButtonColor: "#1f6f4a"

        });

        return;

    }


    // =========================================
    // RESERVATION DATA
    // =========================================

    const reservationData = {

        customer_id: Number(
            form.customerId
        ),

        table_id: Number(
            form.tableId
        ),

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
        "Sending reservation:",
        reservationData
    );


    // =========================================
    // CONFIRMATION
    // =========================================

    const result =
        await Swal.fire({

            title:
                "Confirm Reservation",

            html: `

                <div
                    style="
                        text-align:left;
                        line-height:1.9;
                    "
                >

                    <strong>
                        Customer:
                    </strong>

                    ${form.customer}

                    <br />

                    <strong>
                        Contact:
                    </strong>

                    ${form.contact}

                    <br />

                    <strong>
                        Date:
                    </strong>

                    ${form.date}

                    <br />

                    <strong>
                        Time:
                    </strong>

                    ${form.time}

                    <br />

                    <strong>
                        Guests:
                    </strong>

                    ${form.guests}

                    <br />

                    <strong>
                        Table:
                    </strong>

                    ${form.table}

                    <br />

                    <strong>
                        Payment:
                    </strong>

                    ${form.paymentStatus}

                    <br />

                    <strong>
                        Status:
                    </strong>

                    ${form.status}

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
                "Confirm Reservation",

            cancelButtonText:
                "Review Again"

        });


    // =========================================
    // USER CANCELLED
    // =========================================

    if (!result.isConfirmed) {

        return;

    }


    // =========================================
    // SAVING
    // =========================================

    Swal.fire({

        title:
            "Saving Reservation...",

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

        // =====================================
        // SEND TO PHP API
        // =====================================

        const response =
            await axios.post(

                "http://localhost/restaurant_reservation_system/server/api/reservations/create_reservation.php",

                reservationData,

                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }

            );


        console.log(
            "API Response:",
            response.data
        );


        // =====================================
        // SUCCESS
        // =====================================

        if (
            response.data.success
        ) {

            await Swal.fire({

                title:
                    "Reservation Added!",

                text:
                    response.data.message ||
                    "The reservation has been successfully created.",

                icon:
                    "success",

                confirmButtonColor:
                    "#1f6f4a"

            });


            navigate(
                "/admin/reservations"
            );


            return;

        }


        // =====================================
        // API ERROR
        // =====================================

        await Swal.fire({

            title:
                "Reservation Failed",

            text:
                response.data.message ||
                "Unable to create reservation.",

            icon:
                "error",

            confirmButtonColor:
                "#1f6f4a"

        });


    } catch (error) {

        console.error(
            "Reservation Error:",
            error
        );


        // =====================================
        // DOUBLE BOOKING
        // =====================================

        if (
            error.response &&
            error.response.status === 409
        ) {

            Swal.fire({

                title:
                    "Table Already Reserved",

                text:
                    error.response.data.message ||
                    "This table is already reserved for the selected date and time.",

                icon:
                    "warning",

                confirmButtonColor:
                    "#1f6f4a"

            });


            return;

        }


        // =====================================
        // VALIDATION ERROR
        // =====================================

        if (
            error.response &&
            error.response.status === 400
        ) {

            Swal.fire({

                title:
                    "Invalid Reservation",

                text:
                    error.response.data.message ||
                    "Please check your reservation details.",

                icon:
                    "warning",

                confirmButtonColor:
                    "#1f6f4a"

            });


            return;

        }


        // =====================================
        // SERVER ERROR
        // =====================================

        Swal.fire({

            title:
                "Server Error",

            text:
                error.response?.data?.message ||
                "Unable to connect to the reservation server.",

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
            "/admin/reservations"
        );

    };


    return (

        <div className="form-page">


            {/* =====================================
                HEADER
            ===================================== */}

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
                    Add Reservation
                </h1>


                <p>
                    Create a new restaurant reservation.
                </p>

            </div>


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
                                Select the customer for this reservation.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        {/* CUSTOMER */}

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
                                    loadingCustomers
                                        ? "Loading customers..."
                                        : "Search or select customer..."
                                }

                                isLoading={
                                    loadingCustomers
                                }

                                isSearchable

                                isClearable

                                classNamePrefix={
                                    "reservation-select"
                                }

                            />


                            {errors.customer && (

                                <small
                                    className="error-message"
                                >

                                    {
                                        errors.customer
                                    }

                                </small>

                            )}

                        </div>


                        {/* CONTACT */}

                        <div className="form-group">

                            <label>
                                Contact Number
                            </label>


                            <div
                                className="input-icon-wrapper"
                            >

                                <FaPhone />


                                <input
                                    type="text"
                                    value={
                                        form.contact
                                    }
                                    readOnly
                                    placeholder={
                                        "Customer contact"
                                    }
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
                                Set the date, time, guests, and table.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        {/* DATE */}

                        <div className="form-group">

                            <label>
                                Reservation Date <span>*</span>
                            </label>


                            <div
                                className="input-icon-wrapper"
                            >

                                <FaCalendarAlt />


                                <input

                                    type="date"

                                    name="date"

                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }

                                    value={
                                        form.date
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            </div>


                            {errors.date && (

                                <small
                                    className="error-message"
                                >

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


                            <div
                                className="input-icon-wrapper"
                            >

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

                                <small
                                    className="error-message"
                                >

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


                            <div
                                className="input-icon-wrapper"
                            >

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

                                <small
                                    className="error-message"
                                >

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
                                    availableTables
                                }

                                value={
                                    selectedTable
                                }

                                onChange={
                                    handleTableChange
                                }

                                placeholder={

                                    loadingTables

                                        ? "Loading tables..."

                                        : availableTables.length > 0

                                            ? "Select available table..."

                                            : "No table available"

                                }

                                isLoading={
                                    loadingTables
                                }

                                isDisabled={

                                    loadingTables ||
                                    availableTables.length === 0

                                }

                                isClearable

                                isSearchable

                                classNamePrefix={
                                    "reservation-select"
                                }

formatOptionLabel={(option) => (

    <div className="table-option">

        <FaChair />

        <div>

            <strong>
                {option.tableNumber}
            </strong>

            <small>
                {option.capacity} seats
                {" • "}
                {option.location}
                {" • "}
                {option.status}
            </small>

        </div>

    </div>



                                    )
                                }

                            />


                            {availableTables.length === 0 &&
                                !loadingTables && (

                                    <small
                                        className="error-message"
                                    >

                                        No available table can
                                        accommodate{" "}
                                        {form.guests} guest(s).

                                    </small>

                                )}


                            {errors.table && (

                                <small
                                    className="error-message"
                                >

                                    {
                                        errors.table
                                    }

                                </small>

                            )}

                        </div>

                    </div>


                    {/* SELECTED TABLE */}

                    {selectedTable && (

                        <div
                            className="selected-table-info"
                        >

                            <div
                                className="selected-table-icon"
                            >

                                <FaCheckCircle />

                            </div>


                            <div>

                                <strong>

                                    {
                                        selectedTable.tableNumber
                                    }

                                </strong>


                                <span>

                                    {
                                        selectedTable.capacity
                                    }

                                    {" seats • "}

                                    {
                                        selectedTable.location
                                    }

                                    {" • Available"}

                                </span>

                            </div>

                        </div>

                    )}

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
                                Add customer requests or additional notes.
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
                                Set the payment and reservation status.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">


                        {/* PAYMENT */}

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


                        {/* STATUS */}

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

                            </select>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    ACTION BUTTONS
                ===================================== */}

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

                    >

                        <FaSave />

                        Save Reservation

                    </button>

                </div>

            </form>

        </div>

    );

}


export default AddReservation;

