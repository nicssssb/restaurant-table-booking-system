import {
    FaBell,
    FaUserCircle
} from "react-icons/fa";

function AdminTopbar() {

    return (
        <header className="admin-topbar">

            <div className="topbar-left">

                <div>
                    <h1>
                        Restaurant Reservation System
                    </h1>

                    <p>
                        Manage your restaurant operations
                    </p>
                </div>

            </div>


            <div className="topbar-right">

                <button
                    type="button"
                    className="notification-button"
                    title="Notifications"
                >
                    <FaBell />

                    <span className="notification-dot"></span>
                </button>


                <div className="admin-profile">

                    <FaUserCircle />

                    <div>
                        <strong>
                            Administrator
                        </strong>

                        <span>
                            System Admin
                        </span>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default AdminTopbar;