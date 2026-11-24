import { useState } from "react";
import Swal from "sweetalert2";
import {
    FaUserCog,
    FaLock,
    FaBell,
    FaSave
} from "react-icons/fa";

import "../../../css/settings.css";

function Settings() {

    const [settings, setSettings] = useState({
        name: "Administrator",
        email: "admin@amora.com",
        notifications: true,
        emailNotifications: true
    });

    const [password, setPassword] = useState({
        current: "",
        newPassword: "",
        confirm: ""
    });

    // =========================================
    // HANDLE SETTINGS
    // =========================================

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings({
            ...settings,
            [name]: type === "checkbox" ? checked : value
        });

    };

    // =========================================
    // SAVE SETTINGS
    // =========================================

    const handleSaveSettings = (e) => {

        e.preventDefault();

        if (!settings.name.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Name Required",
                text: "Please enter administrator name."
            });

            return;
        }

        localStorage.setItem(
            "adminSettings",
            JSON.stringify(settings)
        );

        Swal.fire({
            icon: "success",
            title: "Settings Saved",
            text: "Your settings have been updated.",
            confirmButtonColor: "#1f6f4a"
        });

    };

    // =========================================
    // CHANGE PASSWORD
    // =========================================

    const handleChangePassword = (e) => {

        e.preventDefault();

        if (
            !password.current ||
            !password.newPassword ||
            !password.confirm
        ) {

            Swal.fire({
                icon: "warning",
                title: "Incomplete Fields",
                text: "Please complete all password fields."
            });

            return;
        }

        if (password.newPassword.length < 6) {

            Swal.fire({
                icon: "warning",
                title: "Weak Password",
                text: "New password must be at least 6 characters."
            });

            return;
        }

        if (password.newPassword !== password.confirm) {

            Swal.fire({
                icon: "error",
                title: "Password Mismatch",
                text: "New password and confirmation do not match."
            });

            return;
        }

        Swal.fire({
            icon: "success",
            title: "Password Updated",
            text: "Your password has been changed successfully.",
            confirmButtonColor: "#1f6f4a"
        });

        setPassword({
            current: "",
            newPassword: "",
            confirm: ""
        });

    };

    return (

        <div className="settings-page">

            {/* HEADER */}

            <div className="settings-header">

                <div>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your administrator account and system preferences.
                    </p>

                </div>

            </div>


            {/* ACCOUNT SETTINGS */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-icon">
                        <FaUserCog />
                    </div>

                    <div>

                        <h2>
                            Account Information
                        </h2>

                        <p>
                            Update your administrator account details.
                        </p>

                    </div>

                </div>


                <form onSubmit={handleSaveSettings}>

                    <div className="settings-form-grid">

                        <div className="form-group">

                            <label>
                                Administrator Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={settings.name}
                                onChange={handleChange}
                                placeholder="Administrator"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={settings.email}
                                onChange={handleChange}
                                placeholder="admin@amora.com"
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="settings-save-btn"
                    >

                        <FaSave />

                        Save Changes

                    </button>

                </form>

            </div>


            {/* PASSWORD */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-icon">
                        <FaLock />
                    </div>

                    <div>

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Update your administrator password.
                        </p>

                    </div>

                </div>


                <form onSubmit={handleChangePassword}>

                    <div className="settings-form-grid">

                        <div className="form-group">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={password.current}
                                onChange={(e) =>
                                    setPassword({
                                        ...password,
                                        current: e.target.value
                                    })
                                }
                                placeholder="Enter current password"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                value={password.newPassword}
                                onChange={(e) =>
                                    setPassword({
                                        ...password,
                                        newPassword: e.target.value
                                    })
                                }
                                placeholder="Enter new password"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={password.confirm}
                                onChange={(e) =>
                                    setPassword({
                                        ...password,
                                        confirm: e.target.value
                                    })
                                }
                                placeholder="Confirm new password"
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="settings-save-btn"
                    >

                        <FaLock />

                        Update Password

                    </button>

                </form>

            </div>


            {/* NOTIFICATIONS */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-icon">
                        <FaBell />
                    </div>

                    <div>

                        <h2>
                            Notifications
                        </h2>

                        <p>
                            Manage system notification preferences.
                        </p>

                    </div>

                </div>


                <div className="settings-option">

                    <div>

                        <strong>
                            System Notifications
                        </strong>

                        <span>
                            Receive notifications about reservations.
                        </span>

                    </div>

                    <label className="switch">

                        <input
                            type="checkbox"
                            name="notifications"
                            checked={settings.notifications}
                            onChange={handleChange}
                        />

                        <span className="slider"></span>

                    </label>

                </div>


                <div className="settings-option">

                    <div>

                        <strong>
                            Email Notifications
                        </strong>

                        <span>
                            Receive reservation updates through email.
                        </span>

                    </div>

                    <label className="switch">

                        <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={settings.emailNotifications}
                            onChange={handleChange}
                        />

                        <span className="slider"></span>

                    </label>

                </div>

            </div>

        </div>

    );

}

export default Settings;