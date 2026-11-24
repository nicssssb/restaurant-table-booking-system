
import { useState } from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaUtensils,
    FaUserPlus
} from "react-icons/fa";

import "../css/login.css";


function Login() {

    // =========================================================
    // FUNCTION / NAVIGATION
    // =========================================================

    const navigate = useNavigate();
    const location = useLocation();


    const params = new URLSearchParams(
        location.search
    );


   const loginType =
    params.get("type") === "admin"
    ? "admin"
    : "customer";

// =========================================================
// NAVIGATE BACK TO PUBLIC HOME
// =========================================================

const handleBackHome = () => {
    navigate("/home");
};

    // =========================================================
    // VARIABLES, DATA TYPES, AND STATE
    // =========================================================

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);


    // =========================================================
    // EVENT HANDLER: HANDLE INPUT
    // =========================================================

    // EVENT:
    // onChange happens when the user changes the input value.
    //
    // e = EVENT OBJECT
    // Contains information about the event.
    //
    // e.target = element where the event happened.
    //
    // e.target.name = name of the input.
    //
    // e.target.value = current value of the input.

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };



    // =========================================================
    // EVENT HANDLER: LOGIN / FORM SUBMISSION
    // =========================================================
    

    const handleSubmit = async (e) => {

        // Prevents browser from refreshing
        // the page after form submission.
        e.preventDefault();


        if (!formData.email || !formData.password) {

            Swal.fire({
                icon: "warning",
                title: "Incomplete Information",
                text: "Please enter your email and password.",
                confirmButtonColor: "#8b5e3c"
            });

            return;
        }


        setLoading(true);


        try {

            const email =
                formData.email.trim().toLowerCase();



          // =================================================
// ADMIN LOGIN MODE
// =================================================


if(loginType === "admin"){


    if(
        email === "admin@amora.com" &&
        formData.password === "admin123"
    ){


        const adminUser = {

            email: email,

            role:"admin"

        };


        localStorage.setItem(

            "user",

            JSON.stringify(adminUser)

        );



        await Swal.fire({

            icon:"success",

            title:"Admin Login Successful",

            text:"Welcome Administrator.",

            timer:1200,

            showConfirmButton:false

        });



        navigate("/admin/dashboard");


        return;



    }else{


        Swal.fire({

            icon:"error",

            title:"Invalid Admin Account",

            text:
            "Please check your administrator email and password.",

            confirmButtonColor:"#8b5e3c"

        });


        return;


    }


}
        if(loginType === "admin"){

            return;

        }


        // BLOCK ADMIN ACCOUNT FROM CUSTOMER LOGIN

if(
    loginType === "customer" &&
    email === "admin@amora.com"
){

    Swal.fire({

        icon:"error",

        title:"Admin Account Detected",

        text:
        "Please use Admin Login to access the administrator panel.",

        confirmButtonColor:"#8b5e3c"

    });


    return;

}

            // =================================================
            // CUSTOMER LOGIN
            // =================================================

            const response = await axios.post(

                "http://localhost/restaurant_reservation_system/server/api/customers/login_customer.php",

                {
                    email: email,
                    password: formData.password
                },

                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }

            );


            console.log(
                "Customer Login Response:",
                response.data
            );


            if (!response.data.success) {

                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text:
                        response.data.message ||
                        "Invalid email or password.",
                    confirmButtonColor: "#8b5e3c"
                });

                return;
            }


            // =================================================
            // GET CUSTOMER DATA
            // =================================================

            const customer =
                response.data.data ||
                response.data.customer ||
                response.data.user;


            console.log(
                "Customer Data:",
                customer
            );


            if (!customer) {

                Swal.fire({
                    icon: "error",
                    title: "Login Error",
                    text:
                        "Login was successful, but customer information was not returned.",
                    confirmButtonColor: "#8b5e3c"
                });

                return;
            }


            // =================================================
            // GET CUSTOMER ID
            // =================================================

            const customerId =
                customer.id ??
                customer.customer_id ??
                customer.customerId;


            console.log(
                "Customer ID:",
                customerId
            );


            // =================================================
            // VALIDATE CUSTOMER ID
            // =================================================

            if (
                customerId === undefined ||
                customerId === null ||
                customerId === ""
            ) {

                console.error(
                    "Customer ID is missing:",
                    customer
                );


                Swal.fire({
                    icon: "error",
                    title: "Login Error",
                    text:
                        "Customer account information is incomplete.",
                    confirmButtonColor: "#8b5e3c"
                });

                return;
            }


            // =================================================
            // CREATE LOGGED-IN CUSTOMER OBJECT
            // =================================================

            const loggedInCustomer = {

                id: customerId,

                customer_id: customerId,

                name:
                    customer.name ||
                    customer.full_name ||
                    "",

                full_name:
                    customer.full_name ||
                    customer.name ||
                    "",

                email:
                    customer.email ||
                    email,

                contact_number:
                    customer.contact_number ||
                    customer.contact ||
                    "",

                contact:
                    customer.contact_number ||
                    customer.contact ||
                    "",

                address:
                    customer.address ||
                    "",

                role: "customer"

            };


            // =================================================
            // SAVE CUSTOMER DATA
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(loggedInCustomer)
            );


            localStorage.setItem(
                "customer",
                JSON.stringify(loggedInCustomer)
            );


            console.log(
                "Logged-in Customer:",
                loggedInCustomer
            );


            await Swal.fire({
                icon: "success",
                title: "Welcome!",
                text:
                    `Welcome back, ${loggedInCustomer.name}.`,
                confirmButtonColor: "#8b5e3c",
                timer: 1200,
                showConfirmButton: false
            });


            navigate("/customer/dashboard");

            return;


        } catch (error) {

            console.error(
                "Customer login error:",
                error
            );


            if (error.response) {

                console.error(
                    "Server response:",
                    error.response.data
                );


                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text:
                        error.response.data?.message ||
                        "Invalid email or password.",
                    confirmButtonColor: "#8b5e3c"
                });


            } else {

                Swal.fire({
                    icon: "error",
                    title: "Connection Error",
                    text:
                        "Unable to connect to the server.",
                    confirmButtonColor: "#8b5e3c"
                });

            }


        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // EVENT HANDLER: REGISTER
    // =========================================================

    const handleRegister = () => {

        navigate("/register");

    };
    // =========================================================
    // EVENT HANDLER: PASSWORD TOGGLE
    // =========================================================

    const handlePasswordToggle = () => {

        setShowPassword((prev) => !prev);

    };
    // =========================================================
    // RENDER / REACT UI
    // =========================================================

    return (

        <div
            className="login-page">

            <div
                className="login-brand"

            >

                <div className="brand-overlay"></div>

                <div className="brand-content">

                    <div
                        className="brand-icon"

                    >
                        <FaUtensils />
                    </div>

                    <h1>
                        Amora Dining
                    </h1>

                    <p>
                        Restaurant Reservation System
                    </p>

                    <span>
                        Experience exceptional dining,
                        beautifully reserved.
                    </span>

                </div>

            </div>


            <div className="login-container">

                <div className="login-box">

                <div className="back-home-wrapper">

                <button
                    type="button"
                    className="back-home-button"
                    onClick={handleBackHome}
                >
                    Back to Home
                </button>

            </div>  

                <div className="login-header">

                        <div className="mobile-logo">
                            <FaUtensils />
                        </div>

                        <h2>

                        {
                            loginType === "admin"

                            ?

                            "Admin Login"

                            :

                            "Welcome!"

                        }

                        </h2>

                        <p>

                        {
                            loginType === "admin"

                            ?

                            "Sign in to manage restaurant records"

                            :

                            "Sign in to manage your reservations"

                        }

                        </p>

                    </div>


                    <form
                        className="login-form"

                        onSubmit={handleSubmit}

                       
                    >


                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <FaEnvelope
                                    className="input-icon"
                                />

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"

                                    value={formData.email}

                                    onChange={handleChange}   

                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <FaLock
                                    className="input-icon"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"

                                    value={formData.password}

                                    onChange={handleChange}

                                    autoComplete="current-password"
                                />


                                {/* PASSWORD TOGGLE */}

                                <button
                                    type="button"
                                    className="password-toggle"

                                    onClick={
                                        handlePasswordToggle
                                    }

                                >

                                    {showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </button>

                            </div>

                        </div>


                        {/* LOGIN OPTIONS */}

                        <div className="login-options">

                            <label className="remember-me">

                                <input
                                    type="checkbox"

                                />

                                <span>
                                    Remember me
                                </span>

                            </label>


                            {/* FORGOT PASSWORD */}

                            <button
                                type="button"
                                className="forgot-password"

                                onClick={() => {

                                    Swal.fire({
                                        icon: "info",
                                        title: "Forgot Password?",
                                        text:
                                            "Please contact the system administrator to reset your password.",
                                        confirmButtonColor: "#8b5e3c"
                                    });

                                }}

                                
                            >

                                Forgot Password?

                            </button>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"

                            disabled={loading}

                        >

                           {
    loading

    ?

    "Signing in..."

    :

    loginType === "admin"

    ?

    "Admin Sign In"

    :

    "Sign In"
}

                        </button>


                        {/* REGISTER */}
                        
{
    loginType === "customer" && (

        <div className="register-link">

            <span>
                Don't have an account?
            </span>


            <button
                type="button"
                onClick={handleRegister}
            >

                <FaUserPlus />

                Create Customer Account

            </button>


        </div>

    )
}

                    </form>


                    {/* FOOTER */}

                    <div className="login-footer">

                        <span>
                            © 2026 Amora Dining
                        </span>

                        <span>
                            Restaurant Reservation System
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Login;

