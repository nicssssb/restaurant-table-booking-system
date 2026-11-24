import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaEdit,
    FaSave
} from "react-icons/fa";

import CustomerSidebar from "../Components/CustomerSidebar";

import "../../../css/customer-profile.css";


function CustomerProfile() {

    const navigate = useNavigate();


    // =========================================================
    // STORED USER
    // =========================================================

    const storedUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    // =========================================================
    // EDIT MODE
    // =========================================================

    const [editing, setEditing] =
        useState(false);


    // =========================================================
    // PROFILE DATA
    // =========================================================

    const [profile, setProfile] =
        useState({

            full_name:
                storedUser?.full_name || "",

            email:
                storedUser?.email || "",

            contact_number:
                storedUser?.contact_number || "",

            address:
                storedUser?.address || ""

        });


    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfile((prev) => ({

            ...prev,

            [name]:
                value

        }));

    };


    // =========================================================
    // SAVE PROFILE
    // =========================================================

    const handleSave = async () => {

        if (
            !profile.full_name.trim() ||
            !profile.email.trim() ||
            !profile.contact_number.trim()
        ) {

            Swal.fire({

                icon:
                    "warning",

                title:
                    "Incomplete Information",

                text:
                    "Please complete the required fields.",

                confirmButtonColor:
                    "#8b5e3c"

            });


            return;

        }


        localStorage.setItem(

            "user",

            JSON.stringify({

                ...storedUser,

                ...profile

            })

        );


        setEditing(false);


        await Swal.fire({

            icon:
                "success",

            title:
                "Profile Updated!",

            text:
                "Your profile has been successfully updated.",

            confirmButtonColor:
                "#8b5e3c"

        });

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="customer-dashboard">


            {/* =====================================================
                SHARED SIDEBAR
            ===================================================== */}

            <CustomerSidebar />


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="customer-main">


                <div className="customer-profile-page">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="customer-profile-header">


                        <button
                            type="button"
                            className="profile-back-button"
                            onClick={() =>
                                navigate(
                                    "/customer/dashboard"
                                )
                            }
                        >


                        </button>


                        <h1>
                            My Profile
                        </h1>


                        <p>
                            Manage your personal information and account details.
                        </p>

                    </div>


                    {/* =================================================
                        PROFILE CARD
                    ================================================= */}

                    <div className="customer-profile-card">


                        {/* PROFILE TOP */}

                        <div className="profile-card-top">


                            <div className="profile-avatar">

                                <FaUser />

                            </div>


                            <div className="profile-title">

                                <h2>

                                    {
                                        profile.full_name ||
                                        "Customer"
                                    }

                                </h2>


                                <span>
                                    Customer Account
                                </span>

                            </div>


                            {!editing && (

                                <button
                                    type="button"
                                    className="profile-edit-button"
                                    onClick={() =>
                                        setEditing(true)
                                    }
                                >

                                    <FaEdit />

                                    Edit Profile

                                </button>

                            )}

                        </div>


                        {/* =================================================
                            INFORMATION
                        ================================================= */}

                        <div className="profile-information">


                            {/* FULL NAME */}

                            <div className="profile-field">

                                <label>

                                    <FaUser />

                                    Full Name

                                </label>


                                {editing ? (

                                    <input
                                        type="text"
                                        name="full_name"
                                        value={
                                            profile.full_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                ) : (

                                    <div className="profile-value">

                                        {
                                            profile.full_name ||
                                            "Not provided"
                                        }

                                    </div>

                                )}

                            </div>


                            {/* EMAIL */}

                            <div className="profile-field">

                                <label>

                                    <FaEnvelope />

                                    Email Address

                                </label>


                                {editing ? (

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            profile.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                ) : (

                                    <div className="profile-value">

                                        {
                                            profile.email ||
                                            "Not provided"
                                        }

                                    </div>

                                )}

                            </div>


                            {/* CONTACT NUMBER */}

                            <div className="profile-field">

                                <label>

                                    <FaPhone />

                                    Contact Number

                                </label>


                                {editing ? (

                                    <input
                                        type="text"
                                        name="contact_number"
                                        value={
                                            profile.contact_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                ) : (

                                    <div className="profile-value">

                                        {
                                            profile.contact_number ||
                                            "Not provided"
                                        }

                                    </div>

                                )}

                            </div>


                            {/* ADDRESS */}

                            <div className="profile-field">

                                <label>

                                    <FaMapMarkerAlt />

                                    Address

                                </label>


                                {editing ? (

                                    <input
                                        type="text"
                                        name="address"
                                        value={
                                            profile.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                ) : (

                                    <div className="profile-value">

                                        {
                                            profile.address ||
                                            "Not provided"
                                        }

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        {editing && (

                            <div className="profile-actions">


                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={() =>
                                        setEditing(false)
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    className="profile-save-button"
                                    onClick={
                                        handleSave
                                    }
                                >

                                    <FaSave />

                                    Save Changes

                                </button>

                            </div>

                        )}


                    </div>


                </div>


            </main>


        </div>

    );

}


export default CustomerProfile;