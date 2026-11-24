import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaTrash,
    FaPhone,
    FaEnvelope,
    FaSyncAlt,
    FaUsers
} from "react-icons/fa";

import "../../../css/customers.css";


function Customers() {

    const navigate = useNavigate();


    // =========================================
    // STATE
    // =========================================

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");


    // =========================================
    // GET CUSTOMERS
    // =========================================

    const fetchCustomers = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                "http://localhost/restaurant_reservation_system/server/api/customers/get_customers.php"
            );


            console.log(
                "Customers API:",
                response.data
            );


            if (response.data.success) {

                setCustomers(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );

            } else {

                setCustomers([]);

                Swal.fire({

                    title: "Unable to Load Customers",

                    text:
                        response.data.message ||
                        "Failed to load customers.",

                    icon: "error",

                    confirmButtonColor: "#1f6f4a"

                });

            }

        } catch (error) {

            console.error(
                "Customer loading error:",
                error
            );

            setCustomers([]);

            Swal.fire({

                title: "Server Error",

                text:
                    error.response?.data?.message ||
                    "Unable to connect to the customer server.",

                icon: "error",

                confirmButtonColor: "#1f6f4a"

            });

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD CUSTOMERS
    // =========================================

    useEffect(() => {

        fetchCustomers();

    }, []);


    // =========================================
    // FILTER CUSTOMERS
    // =========================================

    const filteredCustomers = useMemo(() => {

        const searchValue =
            search
                .toLowerCase()
                .trim();


        if (!searchValue) {

            return customers;

        }


        return customers.filter(
            (customer) => {

                const name =
                    String(
                        customer.full_name || ""
                    )
                        .toLowerCase();


                const contact =
                    String(
                        customer.contact_number || ""
                    )
                        .toLowerCase();


                const email =
                    String(
                        customer.email || ""
                    )
                        .toLowerCase();


                return (
                    name.includes(searchValue) ||
                    contact.includes(searchValue) ||
                    email.includes(searchValue)
                );

            }
        );

    }, [customers, search]);


    // =========================================
    // DELETE CUSTOMER
    // =========================================

    const handleDelete = async (customer) => {

        const result = await Swal.fire({

            title: "Delete Customer?",

            html: `
                <div style="text-align:left; line-height:1.8;">

                    <strong>Name:</strong>
                    ${customer.full_name || "-"}

                    <br />

                    <strong>Contact:</strong>
                    ${customer.contact_number || "-"}

                    <br />

                    <strong>Email:</strong>
                    ${customer.email || "-"}

                </div>
            `,

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#6b7280",

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel"

        });


        if (!result.isConfirmed) {

            return;

        }


        // =====================================
        // LOADING
        // =====================================

        Swal.fire({

            title: "Deleting Customer...",

            text: "Please wait.",

            allowOutsideClick: false,

            allowEscapeKey: false,

            didOpen: () => {

                Swal.showLoading();

            }

        });


        try {

            const response = await axios.post(

                "http://localhost/restaurant_reservation_system/server/api/customers/delete_customer.php",

                {
                    customer_id:
                        Number(customer.customer_id)
                },

                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }

            );


            console.log(
                "Delete Customer API:",
                response.data
            );


            // =====================================
            // SUCCESS
            // =====================================

            if (response.data.success) {

                setCustomers(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                Number(item.customer_id) !==
                                Number(customer.customer_id)
                        )
                );


                await Swal.fire({

                    title: "Customer Deleted!",

                    text:
                        response.data.message ||
                        "The customer has been successfully deleted.",

                    icon: "success",

                    confirmButtonColor: "#1f6f4a"

                });


                return;

            }


            // =====================================
            // API ERROR
            // =====================================

            Swal.fire({

                title: "Delete Failed",

                text:
                    response.data.message ||
                    "Unable to delete customer.",

                icon: "error",

                confirmButtonColor: "#1f6f4a"

            });


        } catch (error) {

            console.error(
                "Delete customer error:",
                error
            );


            // =====================================
            // HAS RESERVATIONS
            // =====================================

            if (
                error.response?.status === 409
            ) {

                Swal.fire({

                    title:
                        "Cannot Delete Customer",

                    text:
                        error.response.data.message ||
                        "This customer has existing reservations.",

                    icon: "warning",

                    confirmButtonColor:
                        "#1f6f4a"

                });

                return;

            }


            // =====================================
            // NOT FOUND
            // =====================================

            if (
                error.response?.status === 404
            ) {

                Swal.fire({

                    title:
                        "Customer Not Found",

                    text:
                        error.response.data.message ||
                        "The customer no longer exists.",

                    icon: "warning",

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
                    "Unable to connect to the customer server.",

                icon:
                    "error",

                confirmButtonColor:
                    "#1f6f4a"

            });

        }

    };


    // =========================================
    // VIEW CUSTOMER
    // =========================================

    const handleView = (customer) => {

        navigate(
            `/admin/customers/view/${customer.customer_id}`
        );

    };


    // =========================================
    // EDIT CUSTOMER
    // =========================================

    const handleEdit = (customer) => {

        navigate(
            `/admin/customers/edit/${customer.customer_id}`
        );

    };


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="customers-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="customers-header">

                <div>

                    <h1>
                        Customers
                    </h1>

                    <p>
                        Manage restaurant customers
                        and their information.
                    </p>

                </div>


                <Link
                    to="/admin/customers/add"
                    className="add-customer-btn"
                >

                    <FaPlus />

                    Add Customer

                </Link>

            </div>


            {/* =================================
                SUMMARY
            ================================= */}

            <div className="customer-summary">

                <div className="summary-card">

                    <div>

                        <span>
                            Total Customers
                        </span>

                        <strong>
                            {customers.length}
                        </strong>

                    </div>

                    <FaUsers />

                </div>

            </div>


            {/* =================================
                FILTERS
            ================================= */}

            <div className="customer-filters">


                {/* SEARCH */}

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search name, contact, or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* REFRESH */}

                <button
                    type="button"
                    className="refresh-btn"
                    onClick={fetchCustomers}
                    title="Refresh Customers"
                >

                    <FaSyncAlt />

                </button>

            </div>


            {/* =================================
                TABLE
            ================================= */}

            <div className="customer-table-wrapper">


                {loading ? (

                    <div className="table-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading customers...
                        </p>

                    </div>

                ) : filteredCustomers.length === 0 ? (

                    <div className="empty-customers">

                        <FaUsers />

                        <h3>
                            No Customers Found
                        </h3>

                        <p>

                            {search
                                ? "No customers match your search."
                                : "There are no customers registered yet."
                            }

                        </p>


                        {!search && (

                            <Link
                                to="/admin/customers/add"
                                className="empty-add-btn"
                            >

                                <FaPlus />

                                Add Customer

                            </Link>

                        )}

                    </div>

                ) : (

                    <table className="customers-table">

                        <thead>

                            <tr>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Contact
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Reservations
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredCustomers.map(
                                (customer) => (

                                    <tr
                                        key={
                                            customer.customer_id
                                        }
                                    >


                                        {/* CUSTOMER */}

                                        <td>

                                            <div className="customer-cell">

                                                <div className="customer-avatar">

                                                    {
                                                        customer.full_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                    }

                                                </div>


                                                <div>

                                                    <strong>

                                                        {
                                                            customer.full_name ||
                                                            "-"
                                                        }

                                                    </strong>

                                                    <small>

                                                        Customer ID:{" "}

                                                        {
                                                            customer.customer_id
                                                        }

                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* CONTACT */}

                                        <td>

                                            <span className="contact-cell">

                                                <FaPhone />

                                                {
                                                    customer.contact_number ||
                                                    "-"
                                                }

                                            </span>

                                        </td>


                                        {/* EMAIL */}

                                        <td>

                                            <span className="email-cell">

                                                <FaEnvelope />

                                                {
                                                    customer.email ||
                                                    "-"
                                                }

                                            </span>

                                        </td>


                                        {/* RESERVATIONS */}

                                        <td>

                                            <span className="reservation-count">

                                                {
                                                    customer.reservation_count ??
                                                    0
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
                                                    title="View Customer"
                                                    onClick={() =>
                                                        handleView(
                                                            customer
                                                        )
                                                    }
                                                >

                                                    <FaEye />

                                                </button>


                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    className="action-edit"
                                                    title="Edit Customer"
                                                    onClick={() =>
                                                        handleEdit(
                                                            customer
                                                        )
                                                    }
                                                >

                                                    <FaEdit />

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    className="action-delete"
                                                    title="Delete Customer"
                                                    onClick={() =>
                                                        handleDelete(
                                                            customer
                                                        )
                                                    }
                                                >

                                                    <FaTrash />

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
                filteredCustomers.length > 0 && (

                    <div className="customer-footer">

                        Showing{" "}

                        <strong>
                            {
                                filteredCustomers.length
                            }
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {
                                customers.length
                            }
                        </strong>

                        {" "}customers

                    </div>

                )}

        </div>

    );

}


export default Customers;