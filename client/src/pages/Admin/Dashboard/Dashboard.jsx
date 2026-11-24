import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    FaArrowRight,
    FaCalendarCheck,
    FaChair,
    FaClock,
    FaExclamationCircle,
    FaPlus,
    FaSyncAlt,
    FaUsers
} from "react-icons/fa";
import "../../../css/dashboard.css";

const API_URL =
    "http://localhost/restaurant_reservation_system/server/api/dashboard/get_dashboard.php";

const initialDashboard = {
    today_reservations: 0,
    pending_reservations: 0,
    total_customers: 0,
    available_tables: 0,
    total_tables: 0,
    expected_guests: 0,
    recent_reservations: []
};

const numberFormat = new Intl.NumberFormat("en-US");

function Dashboard() {
    const [dashboard, setDashboard] = useState(initialDashboard);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchDashboard = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError("");

        try {
            const response = await axios.get(API_URL);

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Failed to load dashboard data.");
            }

            setDashboard({ ...initialDashboard, ...response.data.data });
            setLastUpdated(new Date());
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to connect to the dashboard server."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const formattedDate = useMemo(
        () => new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }),
        []
    );

    const stats = [
        {
            title: "Today's reservations",
            value: dashboard.today_reservations,
            detail: "Bookings scheduled today",
            icon: FaCalendarCheck,
            tone: "green"
        },
        {
            title: "Pending reservations",
            value: dashboard.pending_reservations,
            detail: "Waiting for confirmation",
            icon: FaClock,
            tone: "amber"
        },
        {
            title: "Total customers",
            value: dashboard.total_customers,
            detail: "Registered customers",
            icon: FaUsers,
            tone: "blue"
        },
        {
            title: "Available tables",
            value: dashboard.available_tables,
            detail: `${numberFormat.format(Number(dashboard.total_tables) || 0)} total tables`,
            icon: FaChair,
            tone: "purple"
        }
    ];

    const formatDate = (date) => {
        if (!date) return "—";
        const parsedDate = new Date(`${date}T00:00:00`);
        return Number.isNaN(parsedDate.getTime())
            ? "—"
            : parsedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
    };

    const formatTime = (time) => {
        if (!time) return "—";
        const [hours, minutes] = time.split(":").map(Number);
        const value = new Date();
        value.setHours(hours, minutes, 0, 0);
        return Number.isNaN(value.getTime())
            ? "—"
            : value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-state" role="status" aria-live="polite">
                    <span className="dashboard-loader"><FaSyncAlt /></span>
                    <h2>Preparing your dashboard</h2>
                    <p>Getting the latest restaurant activity…</p>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="dashboard-welcome">
                        Welcome back, Administrator. Here’s what’s happening today.
                    </p>
                </div>

                <div className="dashboard-header-actions">
                    <div className="dashboard-date">
                        <FaCalendarCheck aria-hidden="true" />
                        <span>{formattedDate}</span>
                    </div>
                    <button
                        type="button"
                        className="dashboard-refresh"
                        onClick={() => fetchDashboard(true)}
                        disabled={refreshing}
                    >
                        <FaSyncAlt className={refreshing ? "spin" : ""} aria-hidden="true" />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>
                </div>
            </header>

            {error && (
                <div className="dashboard-alert" role="alert">
                    <FaExclamationCircle aria-hidden="true" />
                    <div>
                        <strong>Dashboard could not be updated</strong>
                        <span>{error}</span>
                    </div>
                    <button type="button" onClick={() => fetchDashboard()}>Try again</button>
                </div>
            )}

            <section className="dashboard-stats" aria-label="Dashboard statistics">
                {stats.map(({ title, value, detail, icon: Icon, tone }) => (
                    <article className={`dashboard-stat-card stat-${tone}`} key={title}>
                        <div className="dashboard-stat-top">
                            <div className="dashboard-stat-icon"><Icon aria-hidden="true" /></div>
                            <span className="dashboard-stat-label">{title}</span>
                        </div>
                        <strong className="dashboard-stat-value">
                            {numberFormat.format(Number(value) || 0)}
                        </strong>
                        <p>{detail}</p>
                    </article>
                ))}
            </section>

            <section className="dashboard-content-grid">
                <article className="dashboard-card reservations-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>Recent reservations</h2>
                            <p>Review the newest customer bookings.</p>
                        </div>
                        <div className="dashboard-card-actions">
                            <Link className="dashboard-text-link" to="/admin/reservations">
                                View all <FaArrowRight aria-hidden="true" />
                            </Link>
                            <Link className="dashboard-primary-link" to="/admin/reservations">
                                <FaPlus aria-hidden="true" /> Add reservation
                            </Link>
                        </div>
                    </div>

                    {dashboard.recent_reservations?.length ? (
                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Reservation</th>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Schedule</th>
                                        <th scope="col">Guests</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard.recent_reservations.map((reservation) => {
                                        const status = String(reservation.status || "unknown").toLowerCase();
                                        return (
                                            <tr key={reservation.reservation_id}>
                                                <td data-label="Reservation">
                                                    <strong className="reservation-code">
                                                        RES-{reservation.reservation_id}
                                                    </strong>
                                                </td>
                                                <td data-label="Customer">
                                                    <span className="customer-name">
                                                        {reservation.full_name || "Unknown customer"}
                                                    </span>
                                                </td>
                                                <td data-label="Schedule">
                                                    <strong>{formatDate(reservation.reservation_date)}</strong>
                                                    <small className="table-time">
                                                        {formatTime(reservation.reservation_time)}
                                                    </small>
                                                </td>
                                                <td data-label="Guests">
                                                    {numberFormat.format(Number(reservation.guests) || 0)}
                                                </td>
                                                <td data-label="Status">
                                                    <span className={`status-badge status-${status}`}>
                                                        {reservation.status || "Unknown"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="dashboard-empty">
                            <span><FaCalendarCheck aria-hidden="true" /></span>
                            <h3>No reservations yet</h3>
                            <p>New customer bookings will appear here.</p>
                            <Link to="/admin/reservations">Open reservations</Link>
                        </div>
                    )}
                </article>

            </section>

            {lastUpdated && (
                <p className="dashboard-updated" aria-live="polite">
                    Last updated at {lastUpdated.toLocaleTimeString("en-US", {
                        hour: "numeric", minute: "2-digit"
                    })}
                </p>
            )}
        </main>
    );
}

export default Dashboard;
