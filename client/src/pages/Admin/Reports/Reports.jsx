import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaCalendarCheck,
    FaUsers,
    FaMoneyBillWave,
    FaChartLine,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaSyncAlt
} from "react-icons/fa";

import "../../../css/reports.css";


function Reports() {

    const [period, setPeriod] = useState("This Month");

    const [report, setReport] = useState({
        reservations: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        customers: 0,
        revenue: 0,
        trend: []
    });

    const [loading, setLoading] = useState(true);


    // =========================================
    // API URL
    // =========================================

    const REPORT_API =
        "http://localhost/restaurant_reservation_system/server/api/reports/get_reports.php";


    // =========================================
    // GET REPORTS
    // =========================================

    const fetchReports = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                REPORT_API,
                {
                    params: {
                        period: period
                    }
                }
            );


            console.log(
                "Reports API:",
                response.data
            );


            if (response.data.success) {

                setReport({

                    reservations:
                        Number(
                            response.data.data.reservations || 0
                        ),

                    completed:
                        Number(
                            response.data.data.completed || 0
                        ),

                    cancelled:
                        Number(
                            response.data.data.cancelled || 0
                        ),

                    pending:
                        Number(
                            response.data.data.pending || 0
                        ),

                    customers:
                        Number(
                            response.data.data.customers || 0
                        ),

                    revenue:
                        Number(
                            response.data.data.revenue || 0
                        ),

                    trend:
                        Array.isArray(
                            response.data.data.trend
                        )
                            ? response.data.data.trend
                            : []

                });

            } else {

                console.error(
                    response.data.message
                );

            }

        } catch (error) {

            console.error(
                "Reports loading error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD WHEN PERIOD CHANGES
    // =========================================

    useEffect(() => {

        fetchReports();

    }, [period]);


    // =========================================
    // FORMAT MONEY
    // =========================================

    const formatMoney = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =========================================
    // COMPLETION RATE
    // =========================================

    const completionRate =
        report.reservations > 0
            ? Math.round(
                (
                    report.completed /
                    report.reservations
                ) * 100
            )
            : 0;


    // =========================================
    // MAX TREND
    // =========================================

    const maxReservations =
        report.trend.length > 0
            ? Math.max(
                ...report.trend.map(
                    item =>
                        Number(item.reservations || 0)
                )
            )
            : 1;


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="reports-page">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="reports-header">

                <div>

                    <h1>
                        Reports & Analytics
                    </h1>

                    <p>
                        Monitor restaurant reservations,
                        customers, sales, and performance.
                    </p>

                </div>


                <div className="period-selector">

                    <FaCalendarCheck />

                    <select
                        value={period}
                        onChange={(e) =>
                            setPeriod(e.target.value)
                        }
                    >

                        <option value="Today">
                            Today
                        </option>

                        <option value="This Week">
                            This Week
                        </option>

                        <option value="This Month">
                            This Month
                        </option>

                        <option value="This Year">
                            This Year
                        </option>

                    </select>


                    <button
                        type="button"
                        onClick={fetchReports}
                        title="Refresh Reports"
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >

                        <FaSyncAlt />

                    </button>

                </div>

            </div>


            {/* =====================================
                LOADING
            ===================================== */}

            {loading ? (

                <div className="table-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading reports...
                    </p>

                </div>

            ) : (

                <>


                    {/* =====================================
                        SUMMARY CARDS
                    ===================================== */}

                    <div className="reports-summary">


                        {/* RESERVATIONS */}

                        <div className="report-card">

                            <div className="report-card-top">

                                <div className="report-icon reservation-icon">

                                    <FaCalendarCheck />

                                </div>

                            </div>


                            <span className="report-label">
                                Total Reservations
                            </span>


                            <strong className="report-value">

                                {report.reservations.toLocaleString()}

                            </strong>


                            <span className="report-description">

                                Reservations for {period.toLowerCase()}

                            </span>

                        </div>


                        {/* CUSTOMERS */}

                        <div className="report-card">

                            <div className="report-card-top">

                                <div className="report-icon customer-icon">

                                    <FaUsers />

                                </div>

                            </div>


                            <span className="report-label">
                                Customers Served
                            </span>


                            <strong className="report-value">

                                {report.customers.toLocaleString()}

                            </strong>


                            <span className="report-description">

                                Customers with reservations

                            </span>

                        </div>


                        {/* REVENUE */}

                        <div className="report-card">

                            <div className="report-card-top">

                                <div className="report-icon revenue-icon">

                                    <FaMoneyBillWave />

                                </div>

                            </div>


                            <span className="report-label">
                                Revenue
                            </span>


                            <strong className="report-value">

                                ₱{formatMoney(report.revenue)}

                            </strong>


                            <span className="report-description">

                                Paid reservations

                            </span>

                        </div>


                    </div>



                    {/* =====================================
                        RESERVATION OVERVIEW + TREND
                    ===================================== */}

                    <div className="reports-grid">


                        {/* RESERVATION OVERVIEW */}

                        <div className="report-panel">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Reservation Overview
                                    </h2>

                                    <p>
                                        Reservation status for{" "}
                                        {period.toLowerCase()}.
                                    </p>

                                </div>

                                <FaChartLine />

                            </div>


                            <div className="status-overview">


                                {/* COMPLETED */}

                                <div className="status-item">

                                    <div className="status-item-left">

                                        <span className="status-dot completed-dot"></span>

                                        <span>
                                            Completed
                                        </span>

                                    </div>

                                    <strong>
                                        {report.completed}
                                    </strong>

                                </div>


                                {/* PENDING */}

                                <div className="status-item">

                                    <div className="status-item-left">

                                        <span className="status-dot pending-dot"></span>

                                        <span>
                                            Pending
                                        </span>

                                    </div>

                                    <strong>
                                        {report.pending}
                                    </strong>

                                </div>


                                {/* CANCELLED */}

                                <div className="status-item">

                                    <div className="status-item-left">

                                        <span className="status-dot cancelled-dot"></span>

                                        <span>
                                            Cancelled
                                        </span>

                                    </div>

                                    <strong>
                                        {report.cancelled}
                                    </strong>

                                </div>


                            </div>


                            {/* COMPLETION */}

                            <div className="completion-section">

                                <div className="completion-header">

                                    <span>
                                        Completion Rate
                                    </span>

                                    <strong>
                                        {completionRate}%
                                    </strong>

                                </div>


                                <div className="progress-bar">

                                    <div
                                        className="progress-fill"
                                        style={{
                                            width:
                                                `${completionRate}%`
                                        }}
                                    ></div>

                                </div>

                            </div>

                        </div>



                        {/* =================================
                            RESERVATION TREND
                        ================================= */}

                        <div className="report-panel">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Reservation Trend
                                    </h2>

                                    <p>
                                        Reservation activity.
                                    </p>

                                </div>

                                <FaClock />

                            </div>


                            <div className="trend-chart">


                                {report.trend.length === 0 ? (

                                    <div
                                        style={{
                                            width: "100%",
                                            textAlign: "center",
                                            padding: "40px"
                                        }}
                                    >

                                        No reservation data.

                                    </div>

                                ) : (

                                    report.trend.map(
                                        (item) => {

                                            const value =
                                                Number(
                                                    item.reservations || 0
                                                );

                                            return (

                                                <div
                                                    className="trend-column"
                                                    key={item.day}
                                                >

                                                    <span className="trend-value">

                                                        {value}

                                                    </span>


                                                    <div className="trend-bar-wrapper">

                                                        <div
                                                            className="trend-bar"
                                                            style={{
                                                                height:
                                                                    `${(
                                                                        value /
                                                                        maxReservations
                                                                    ) * 100}%`
                                                            }}
                                                        ></div>

                                                    </div>


                                                    <span className="trend-day">

                                                        {item.day}

                                                    </span>

                                                </div>

                                            );

                                        }
                                    )

                                )}

                            </div>

                        </div>

                    </div>



                    {/* =====================================
                        STATUS SUMMARY
                    ===================================== */}

                    <div className="reports-grid">

                        <div className="report-panel">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Reservation Status
                                    </h2>

                                    <p>
                                        Current reservation breakdown.
                                    </p>

                                </div>

                                <FaCalendarCheck />

                            </div>


                            <div className="status-cards">


                                {/* COMPLETED */}

                                <div className="mini-status completed-status">

                                    <div>

                                        <FaCheckCircle />

                                    </div>

                                    <section>

                                        <span>
                                            Completed
                                        </span>

                                        <strong>
                                            {report.completed}
                                        </strong>

                                    </section>

                                </div>


                                {/* PENDING */}

                                <div className="mini-status pending-status">

                                    <div>

                                        <FaClock />

                                    </div>

                                    <section>

                                        <span>
                                            Pending
                                        </span>

                                        <strong>
                                            {report.pending}
                                        </strong>

                                    </section>

                                </div>


                                {/* CANCELLED */}

                                <div className="mini-status cancelled-status">

                                    <div>

                                        <FaTimesCircle />

                                    </div>

                                    <section>

                                        <span>
                                            Cancelled
                                        </span>

                                        <strong>
                                            {report.cancelled}
                                        </strong>

                                    </section>

                                </div>


                            </div>

                        </div>

                    </div>



                    {/* =====================================
                        REPORT NOTE
                    ===================================== */}

                    <div className="report-note">

                        <FaChartLine />

                        <div>

                            <strong>
                                Live Database Report
                            </strong>

                            <p>
                                These figures are retrieved
                                directly from the reservations
                                and customers database.
                            </p>

                        </div>

                    </div>

                </>

            )}

        </div>

    );

}


export default Reports;