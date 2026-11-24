import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    FaUtensils,
    FaCalendarAlt,
    FaPlus,
    FaClock,
    FaHistory,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTimes
} from "react-icons/fa";

import "../../../css/customer-sidebar.css";

function CustomerSidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        {
            label: "Dashboard",
            path: "/customer/dashboard",
            icon: <FaCalendarAlt />
        },
        {
            label: "Make Reservation",
            path: "/customer/reservation",
            icon: <FaPlus />
        },
        {
            label: "My Reservations",
            path: "/customer/reservations",
            icon: <FaClock />
        },
        {
            label: "Reservation History",
            path: "/customer/history",
            icon: <FaHistory />
        }
    ];

    const goTo = (path) => {
        setSidebarOpen(false);
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

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
            timer: 1200,
            showConfirmButton: false
        });

        navigate("/login");
    };

    return (
        <>
            <button
                type="button"
                className="customer-mobile-menu-button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open customer navigation"
            >
                <FaBars />
            </button>

            {sidebarOpen && (
                <button
                    type="button"
                    className="customer-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close customer navigation"
                />
            )}

            <aside
                className={
                    sidebarOpen
                        ? "customer-sidebar open"
                        : "customer-sidebar"
                }
            >
                <div className="customer-sidebar-logo">
                    <div className="customer-logo-icon">
                        <FaUtensils />
                    </div>

                    <div className="customer-sidebar-brand-copy">
                        <h2>Amora Dining</h2>
                        <span>Customer Portal</span>
                    </div>

                    <button
                        type="button"
                        className="customer-sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close customer navigation"
                    >
                        <FaTimes />
                    </button>
                </div>

                <nav className="customer-nav">
                    <p className="customer-nav-title">MAIN MENU</p>

                    {menuItems.map((item) => (
                        <button
                            type="button"
                            key={item.path}
                            className={
                                isActive(item.path)
                                    ? "customer-nav-link active"
                                    : "customer-nav-link"
                            }
                            onClick={() => goTo(item.path)}
                        >
                            <span className="customer-nav-icon">
                                {item.icon}
                            </span>

                            <span>{item.label}</span>
                        </button>
                    ))}

                    <p className="customer-nav-title account-title">
                        ACCOUNT
                    </p>

                    <button
                        type="button"
                        className={
                            isActive("/customer/profile")
                                ? "customer-nav-link active"
                                : "customer-nav-link"
                        }
                        onClick={() => goTo("/customer/profile")}
                    >
                        <span className="customer-nav-icon">
                            <FaUser />
                        </span>

                        <span>My Profile</span>
                    </button>
                </nav>

                <div className="customer-sidebar-bottom">
                    <button
                        type="button"
                        className="customer-logout"
                        onClick={handleLogout}
                    >
                        <span className="customer-nav-icon">
                            <FaSignOutAlt />
                        </span>

                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default CustomerSidebar;
