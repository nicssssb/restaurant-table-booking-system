import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaSearch,
    FaTable,
    FaUsers,
    FaCheckCircle,
    FaCalendarCheck,
    FaEye,
    FaEdit,
    FaTrash,
    FaSyncAlt
} from "react-icons/fa";

import Swal from "sweetalert2";

import "../../../css/tables.css";


function Tables() {

    /* =========================================
       STATE
    ========================================= */

    const [tables, setTables] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [loading, setLoading] =
        useState(true);


    /* =========================================
       API URL
    ========================================= */

    const API_URL =
        "http://localhost/restaurant_reservation_system/server/api/tables";


    /* =========================================
       LOAD TABLES
    ========================================= */

    const loadTables = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/get_tables.php`
            );


            console.log(
                "Tables API:",
                response.data
            );


            if (
                response.data &&
                response.data.success
            ) {

                setTables(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );

            } else {

                setTables([]);

            }


        } catch (error) {

            console.error(
                "Load tables error:",
                error
            );


            Swal.fire({
                icon: "error",
                title: "Unable to Load Tables",
                text:
                    error.response?.data?.message ||
                    "Failed to load restaurant tables."
            });


            setTables([]);

        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       INITIAL LOAD
    ========================================= */

    useEffect(() => {

        loadTables();

    }, []);


    /* =========================================
       DELETE TABLE
    ========================================= */

    const handleDelete = async (tableId) => {

        const result = await Swal.fire({

            title: "Delete Table?",

            text:
                "This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#6b7280",

            confirmButtonText:
                "Yes, delete it"

        });


        if (!result.isConfirmed) {
            return;
        }


        try {

            const response =
                await axios.post(
                    `${API_URL}/delete_table.php`,
                    {
                        table_id: tableId
                    }
                );


            if (response.data.success) {

                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text:
                        "Table deleted successfully.",
                    timer: 1500,
                    showConfirmButton: false
                });


                loadTables();

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Delete Failed",
                    text:
                        response.data.message ||
                        "Unable to delete table."
                });

            }


        } catch (error) {

            console.error(
                "Delete table error:",
                error
            );


            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error.response?.data?.message ||
                    "An error occurred while deleting the table."
            });

        }

    };


    /* =========================================
       NORMALIZE STATUS
    ========================================= */

    const normalizeStatus = (status) => {

        return String(status || "")
            .trim()
            .toLowerCase();

    };


    /* =========================================
       SUMMARY COUNTS
    ========================================= */

    const totalTables =
        tables.length;


    const availableTables =
        tables.filter(
            table =>
                normalizeStatus(table.status) ===
                "available"
        ).length;


    const reservedTables =
        tables.filter(
            table =>
                normalizeStatus(table.status) ===
                "reserved"
        ).length;


    const occupiedTables =
        tables.filter(
            table =>
                normalizeStatus(table.status) ===
                "occupied"
        ).length;


    /* =========================================
       FILTER TABLES
    ========================================= */

    const filteredTables =
        tables.filter((table) => {

            const tableNumber =
                String(
                    table.table_number || ""
                ).toLowerCase();


            const location =
                String(
                    table.location || ""
                ).toLowerCase();


            const status =
                String(
                    table.status || ""
                ).toLowerCase();


            const searchValue =
                search.toLowerCase().trim();


            const matchesSearch =
                tableNumber.includes(searchValue) ||
                location.includes(searchValue);


            const matchesStatus =
                statusFilter === "All" ||
                status ===
                    statusFilter.toLowerCase();


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    /* =========================================
       STATUS CLASS
    ========================================= */

    const getStatusClass = (status) => {

        switch (
            normalizeStatus(status)
        ) {

            case "available":
                return "available";

            case "occupied":
                return "occupied";

            case "reserved":
                return "reserved";

            case "unavailable":
                return "unavailable";

            default:
                return "";

        }

    };


    /* =========================================
       INITIALS / TABLE DISPLAY
    ========================================= */

    const getTableNumber =
        (table) =>
            table.table_number ||
            table.table_no ||
            table.number ||
            table.table_id;


    /* =========================================
       RENDER
    ========================================= */

    return (

        <div className="tables-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="tables-header">

                <div>

                    <h1>
                        Restaurant Tables
                    </h1>

                    <p>
                        Manage restaurant tables,
                        capacity, location and availability.
                    </p>

                </div>


                <Link
                    to="/admin/tables/add"
                    className="add-table-btn"
                >

                    <FaPlus />

                    Add Table

                </Link>

            </div>


            {/* =================================
                SUMMARY
            ================================= */}

            <div className="table-summary">


                {/* TOTAL */}

                <div className="table-summary-card">

                    <div>

                        <span>
                            Total Tables
                        </span>

                        <strong>
                            {totalTables}
                        </strong>

                    </div>

                    <div className="table-summary-icon">

                        <FaTable />

                    </div>

                </div>


                {/* AVAILABLE */}

                <div className="table-summary-card">

                    <div>

                        <span>
                            Available
                        </span>

                        <strong>
                            {availableTables}
                        </strong>

                    </div>

                    <div className="table-summary-icon">

                        <FaCheckCircle />

                    </div>

                </div>


                {/* RESERVED */}

                <div className="table-summary-card">

                    <div>

                        <span>
                            Reserved
                        </span>

                        <strong>
                            {reservedTables}
                        </strong>

                    </div>

                    <div className="table-summary-icon">

                        <FaCalendarCheck />

                    </div>

                </div>


                {/* OCCUPIED */}

                <div className="table-summary-card">

                    <div>

                        <span>
                            Occupied
                        </span>

                        <strong>
                            {occupiedTables}
                        </strong>

                    </div>

                    <div className="table-summary-icon">

                        <FaUsers />

                    </div>

                </div>

            </div>


            {/* =================================
                TABLE CARD
            ================================= */}

            <div className="tables-card">


                {/* =================================
                    TOOLBAR
                ================================= */}

                <div className="tables-toolbar">


                    <div className="tables-search-box">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search table number or location..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >


                        {/* FILTER */}

                        <div className="tables-filter">

                            <label>
                                Status:
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All
                                </option>

                                <option value="Available">
                                    Available
                                </option>

                                <option value="Reserved">
                                    Reserved
                                </option>

                                <option value="Occupied">
                                    Occupied
                                </option>

                                <option value="Unavailable">
                                    Unavailable
                                </option>

                            </select>

                        </div>


                        {/* REFRESH */}

                        <button
                            type="button"
                            className="table-refresh-btn"
                            onClick={loadTables}
                            title="Refresh tables"
                            disabled={loading}
                        >

                            <FaSyncAlt
                                className={
                                    loading
                                        ? "refresh-spinning"
                                        : ""
                                }
                            />

                        </button>

                    </div>

                </div>


                {/* =================================
                    TABLE
                ================================= */}

                <div className="tables-table-wrapper">

                    <table className="tables-table">

                        <thead>

                            <tr>

                                <th>
                                    Table
                                </th>

                                <th>
                                    Capacity
                                </th>

                                <th>
                                    Location
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


                            {/* LOADING */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "50px"
                                        }}
                                    >

                                        Loading tables...

                                    </td>

                                </tr>

                            ) : filteredTables.length === 0 ? (

                                /* EMPTY */

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="empty-tables"
                                    >

                                        <FaTable />

                                        <h3>
                                            No Tables Found
                                        </h3>

                                        <p>
                                            No restaurant
                                            tables match
                                            your search.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                /* DATA */

                                filteredTables.map(
                                    (table) => (

                                        <tr
                                            key={
                                                table.table_id
                                            }
                                        >


                                            {/* TABLE */}

                                            <td>

                                                <div className="table-number-cell">

                                                    <div className="table-number-icon">

                                                        <FaTable />

                                                    </div>

                                                    <div>

                                                        <strong>

                                                            Table{" "}

                                                            {
                                                                getTableNumber(
                                                                    table
                                                                )
                                                            }

                                                        </strong>

                                                        <small>

                                                            ID:{" "}

                                                            {
                                                                table.table_id
                                                            }

                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CAPACITY */}

                                            <td>

                                                <div className="capacity-cell">

                                                    <FaUsers />

                                                    {
                                                        table.capacity
                                                    }{" "}

                                                    guests

                                                </div>

                                            </td>


                                            {/* LOCATION */}

                                            <td>

                                                <div className="location-cell">

                                                    <strong>

                                                        {
                                                            table.location ||
                                                            "Main Dining"
                                                        }

                                                    </strong>

                                                    <small>
                                                        Restaurant
                                                        Table
                                                    </small>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `table-status ${
                                                            getStatusClass(
                                                                table.status
                                                            )
                                                        }`
                                                    }
                                                >

                                                    {
                                                        table.status ||
                                                        "Available"
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="table-action-buttons">


                                                    {/* VIEW */}

                                                    <Link
                                                        to={`/admin/tables/view/${table.table_id}`}
                                                        className="table-view-action"
                                                        title="View Table"
                                                    >

                                                        <FaEye />

                                                    </Link>


                                                    {/* EDIT */}

                                                    <Link
                                                        to={`/admin/tables/edit/${table.table_id}`}
                                                        className="table-edit-action"
                                                        title="Edit Table"
                                                    >

                                                        <FaEdit />

                                                    </Link>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="table-delete-action"
                                                        title="Delete Table"
                                                        onClick={() =>
                                                            handleDelete(
                                                                table.table_id
                                                            )
                                                        }
                                                    >

                                                        <FaTrash />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================
                    FOOTER
                ================================= */}

                <div className="tables-footer">

                    Showing{" "}

                    <strong>
                        {filteredTables.length}
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {tables.length}
                    </strong>

                    {" "}tables

                </div>

            </div>

        </div>

    );

}


export default Tables;