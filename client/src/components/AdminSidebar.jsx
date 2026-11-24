import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    FaBars,
    FaCalendarAlt,
    FaChair,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaTachometerAlt,
    FaTimes,
    FaUsers,
    FaUtensils
} from "react-icons/fa";
import "../css/AdminSidebar.css";

const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaTachometerAlt },
    { name: "Reservations", path: "/admin/reservations", icon: FaCalendarAlt },
    { name: "Customers", path: "/admin/customers", icon: FaUsers },
    { name: "Tables", path: "/admin/tables", icon: FaChair },
    { name: "Reports", path: "/admin/reports", icon: FaChartBar }
];

function AdminSidebar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Close the mobile drawer with Escape and prevent background scrolling.
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("keydown", handleEscape);
        document.body.classList.toggle("sidebar-open", isOpen);

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.classList.remove("sidebar-open");
        };
    }, [isOpen]);

    // Burger-menu controls used on tablets and mobile devices.
    const toggleSidebar = () => setIsOpen((currentState) => !currentState);
    const closeSidebar = () => setIsOpen(false);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to log out?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Stay logged in",
            confirmButtonColor: "#166534",
            cancelButtonColor: "#64748b",
            reverseButtons: true,
            focusCancel: true
        });

        if (!result.isConfirmed) return;

        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
        closeSidebar();

        await Swal.fire({
            title: "Logged out",
            text: "You have been successfully logged out.",
            icon: "success",
            timer: 1200,
            timerProgressBar: true,
            showConfirmButton: false
        });

        navigate("/portal", { replace: true });
    };

    return (
        <>
            <button
                type="button"
                className="sidebar-toggle"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-controls="admin-navigation"
                aria-expanded={isOpen}
                onClick={toggleSidebar}
            >
                <FaBars aria-hidden="true" />
            </button>

            <button
                type="button"
                className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
                aria-label="Close navigation menu"
                tabIndex={isOpen ? 0 : -1}
                onClick={closeSidebar}
            />

            <aside
                id="admin-navigation"
                className={`admin-sidebar ${isOpen ? "open" : ""}`}
                aria-label="Admin navigation"
            >
                <div className="sidebar-logo">
                    <div className="logo-icon" aria-hidden="true">
                        <FaUtensils />
                    </div>
                    <div className="logo-copy">
                        <h2>Restaurant</h2>
                        <span>Reservation System</span>
                    </div>
                    <button
                        type="button"
                        className="sidebar-close"
                        aria-label="Close navigation menu"
                        onClick={closeSidebar}
                    >
                        <FaTimes aria-hidden="true" />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <p className="sidebar-title">Main menu</p>
                    {menuItems.map(({ name, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `sidebar-link${isActive ? " active" : ""}`
                            }
                        >
                            <span className="sidebar-icon" aria-hidden="true"><Icon /></span>
                            <span>{name}</span>
                        </NavLink>
                    ))}

                    <p className="sidebar-title settings-title">System</p>
                    <NavLink
                        to="/admin/settings"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? " active" : ""}`
                        }
                    >
                        <span className="sidebar-icon" aria-hidden="true"><FaCog /></span>
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="sidebar-bottom">
                    <button type="button" className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt aria-hidden="true" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;
