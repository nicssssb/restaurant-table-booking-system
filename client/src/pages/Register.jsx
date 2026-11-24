import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import {
  FaArrowLeft,
  FaCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaShieldAlt,
  FaUser,
  FaUtensils,
} from "react-icons/fa";

import "../css/register.css";

function Register() {
  const navigate = useNavigate();

  const REGISTER_URL =
    "http://localhost/restaurant_reservation_system/server/api/customers/register.php";

  // =========================================
  // FORM DATA
  // Object na naglalaman ng lahat ng input
  // values ng user
  // =========================================
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    email: "",
    address: "",
    password: "",
    confirm_password: "",
  });

  // =========================================
  // ERRORS
  // Dito nilalagay ang validation messages
  // =========================================
  const [errors, setErrors] = useState({});

  // =========================================
  // PASSWORD VISIBILITY
  // true = makikita ang password
  // false = nakatago ang password
  // =========================================
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================
  // LOADING
  // Ginagamit habang nagsa-submit ng form
  // =========================================
  const [loading, setLoading] = useState(false);

  // =========================================
  // HANDLE CHANGE
  //
  // EVENT: onChange
  //
  // Event Source:
  // Input elements
  //
  // Event:
  // User types inside an input
  //
  // Event Handler:
  // handleChange()
  //
  // Event Object:
  // event
  // =========================================
  const handleChange = (event) => {
    // Kinukuha ang name at value ng input
    const { name, value } = event.target;

    let newValue = value;

    // Contact number:
    // numbers lang ang puwedeng ilagay
    if (name === "contact_number") {
      newValue = value.replace(/\D/g, "");
    }

    // Email:
    // tanggalin ang spaces
    if (name === "email") {
      newValue = value.replace(/\s/g, "");
    }

    // Update form data
    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Tanggalin ang error habang nagta-type ulit
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // =========================================
  // VALIDATE FORM
  //
  // Function para i-check kung valid
  // ang lahat ng input bago mag-submit
  // =========================================
  const validateForm = () => {
    // Object para sa bagong errors
    const newErrors = {};

    // -----------------------------------------
    // FULL NAME VALIDATION
    // -----------------------------------------
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required.";
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name =
        "Please enter your complete name.";
    }

    // -----------------------------------------
    // CONTACT NUMBER VALIDATION
    // Philippine mobile number:
    // 09 + 9 digits = 11 digits
    // Example: 09123456789
    // -----------------------------------------
    if (!formData.contact_number.trim()) {
      newErrors.contact_number =
        "Contact number is required.";
    } else if (!/^09\d{9}$/.test(formData.contact_number)) {
      newErrors.contact_number =
        "Enter a valid 11-digit mobile number.";
    }

    // -----------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    // -----------------------------------------
    // PASSWORD VALIDATION
    // Minimum:
    // - 8 characters
    // - at least one letter
    // - at least one number
    // -----------------------------------------
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must have at least 8 characters.";
    } else if (!/[A-Za-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one letter.";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one number.";
    }

    // -----------------------------------------
    // CONFIRM PASSWORD VALIDATION
    // -----------------------------------------
    if (!formData.confirm_password) {
      newErrors.confirm_password =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirm_password
    ) {
      newErrors.confirm_password =
        "Passwords do not match.";
    }

    // Ilagay lahat ng errors sa state
    setErrors(newErrors);

    // Kapag 0 ang errors, valid ang form
    return Object.keys(newErrors).length === 0;
  };

  // =========================================
  // HANDLE SUBMIT
  //
  // EVENT: onSubmit
  //
  // Event Source:
  // Registration form
  //
  // Event:
  // User clicks Create Customer Account
  //
  // Event Listener:
  // onSubmit={handleSubmit}
  //
  // Event Handler:
  // handleSubmit()
  // =========================================
  const handleSubmit = async (event) => {
    // Pinipigilan ang automatic page refresh
    event.preventDefault();

    // Validate muna ang form
    const isValid = validateForm();

    // Kapag may error, huwag mag-submit
    if (!isValid) {
      return;
    }

    // Start loading
    setLoading(true);

    try {
      // =====================================
      // SEND DATA TO PHP API
      // =====================================
      const response = await axios.post(
        REGISTER_URL,
        {
          full_name: formData.full_name.trim(),

          contact_number:
            formData.contact_number.trim(),

          email: formData.email
            .trim()
            .toLowerCase(),

          address: formData.address.trim(),

          password: formData.password,
        }
      );

      // =====================================
      // SUCCESS RESPONSE
      // =====================================
      if (response.data?.success) {
        await Swal.fire({
          icon: "success",
          title: "Account Created!",
          text:
            "Your Amora Dining customer account is ready.",
          confirmButtonText: "Continue to Login",
          confirmButtonColor: "#8b5e3c",
        });

        // Pumunta sa Login page
        navigate("/login");
      } else {
        // ===================================
        // SERVER VALIDATION ERROR
        // ===================================
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            response.data?.message ||
            "Unable to create your account.",
          confirmButtonColor: "#8b5e3c",
        });
      }
    } catch (error) {
      // =====================================
      // CONNECTION / SERVER ERROR
      // =====================================
      console.error(
        "Registration Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Unable to connect to the server.",
        confirmButtonColor: "#8b5e3c",
      });
    } finally {
      // Stop loading kahit success or error
      setLoading(false);
    }
  };

  // =========================================
  // HANDLE CLEAR
  //
  // EVENT: onClick
  //
  // Nililinis ang lahat ng input fields
  // =========================================
  const handleClear = () => {
    setFormData({
      full_name: "",
      contact_number: "",
      email: "",
      address: "",
      password: "",
      confirm_password: "",
    });

    // Tanggalin din lahat ng errors
    setErrors({});

    // Itago ulit ang passwords
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // =========================================
  // USER INTERFACE
  // =========================================
  return (
    <main className="register-page">
      {/* =====================================
          LEFT SIDE / BRANDING
      ====================================== */}
      <section
        className="register-brand"
        aria-label="Amora Dining"
      >
        <div className="register-brand-overlay" />

        <div className="register-brand-content">
          <div className="register-brand-icon">
            <FaUtensils />
          </div>

          <span className="register-brand-kicker">
            WELCOME TO
          </span>

          <h1>Amora Dining</h1>

          <p>Restaurant Reservation System</p>

          <div className="register-brand-divider" />

          <h2>
            Your table is only a few steps away.
          </h2>

          {/* Array-like list of system features */}
          <ul>
            <li>
              <FaCheck />
              <span>
                Reserve a table anytime
              </span>
            </li>

            <li>
              <FaCheck />
              <span>
                Track your reservation status
              </span>
            </li>

            <li>
              <FaCheck />
              <span>
                Manage bookings in one place
              </span>
            </li>
          </ul>
        </div>

        <span className="register-brand-footer">
          A more convenient dining experience
        </span>
      </section>

      {/* =====================================
          RIGHT SIDE / REGISTRATION FORM
      ====================================== */}
      <section className="register-container">
        <div className="register-box">

          {/* Back to Login Button */}
          <button
            type="button"
            className="back-login-button"
            onClick={() => navigate("/login")}
          >
            <FaArrowLeft />

            <span>Back to Login</span>
          </button>

          {/* =================================
              HEADER
          ================================== */}
          <header className="register-header">
            <div className="register-mobile-logo">
              <FaUtensils />
            </div>


            <h2>Create your account</h2>

            
          </header>

          {/* =================================
              FORM

              EVENT LISTENER:
              onSubmit waits for submit event
          ================================== */}
          <form
            className="register-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* ===============================
                PERSONAL INFORMATION
            ================================ */}
            <fieldset>
              <legend>
                Personal information
              </legend>

              

              <div className="register-fields-grid">

                {/* ===========================
                    FULL NAME
                ============================ */}
                <div className="register-form-group">
                  <label htmlFor="full-name">
                    Full Name <span>*</span>
                  </label>

                  <div
                    className={`register-input-wrap ${
                      errors.full_name
                        ? "has-error"
                        : ""
                    }`}
                  >
                    <FaUser className="register-input-icon" />

                    <input
                      id="full-name"
                      type="text"
                      name="full_name"
                      placeholder="Enter Full Name"
                      autoComplete="name"
                      value={formData.full_name}

                      // onChange Event
                      onChange={handleChange}
                    />
                  </div>

                  {/* Conditional Statement */}
                  {errors.full_name && (
                    <small className="field-error">
                      {errors.full_name}
                    </small>
                  )}
                </div>

                {/* ===========================
                    CONTACT NUMBER
                ============================ */}
                <div className="register-form-group">
                  <label htmlFor="contact-number">
                    Contact Number{" "}
                    <span>*</span>
                  </label>

                  <div
                    className={`register-input-wrap ${
                      errors.contact_number
                        ? "has-error"
                        : ""
                    }`}
                  >
                    <FaPhone className="register-input-icon" />

                    <input
                      id="contact-number"
                      type="tel"
                      name="contact_number"
                      placeholder="09123456789"
                      inputMode="numeric"
                      maxLength={11}
                      autoComplete="tel"
                      value={
                        formData.contact_number
                      }
                      onChange={handleChange}
                    />
                  </div>

                  {errors.contact_number && (
                    <small className="field-error">
                      {
                        errors.contact_number
                      }
                    </small>
                  )}
                </div>

                {/* ===========================
                    EMAIL ADDRESS
                ============================ */}
                <div className="register-form-group">
                  <label htmlFor="email">
                    Email Address{" "}
                    <span>*</span>
                  </label>

                  <div
                    className={`register-input-wrap ${
                      errors.email
                        ? "has-error"
                        : ""
                    }`}
                  >
                    <FaEnvelope className="register-input-icon" />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="juan@email.com"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.email && (
                    <small className="field-error">
                      {errors.email}
                    </small>
                  )}
                </div>

                {/* ===========================
                    ADDRESS
                    Optional field
                ============================ */}
                <div className="register-form-group">
                  <label htmlFor="address">
                    Address{" "}
                    <small>Optional</small>
                  </label>

                  <div className="register-input-wrap">
                    <FaMapMarkerAlt className="register-input-icon" />

                    <input
                      id="address"
                      type="text"
                      name="address"
                      placeholder="City, Province"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* ===============================
                ACCOUNT SECURITY
            ================================ */}
            <fieldset className="security-section">
              <legend>
                Secure your account
              </legend>

              <p className="section-description">
                Password must have at least
                8 characters, one letter,
                and one number.
              </p>

              <div className="register-fields-grid">

                {/* ===========================
                    PASSWORD
                ============================ */}
                <div className="register-form-group">
                  <label htmlFor="password">
                    Password <span>*</span>
                  </label>

                  <div
                    className={`register-input-wrap ${
                      errors.password
                        ? "has-error"
                        : ""
                    }`}
                  >
                    <FaLock className="register-input-icon" />

                    <input
                      id="password"

                      // Conditional Operator
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      name="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    {/* =======================
                        SHOW / HIDE PASSWORD

                        EVENT: onClick
                    ======================== */}
                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <small className="field-error">
                      {errors.password}
                    </small>
                  )}

                  {/* Simple password guide */}
                  <div className="password-rules">
                    <span
                      className={
                        formData.password.length >= 8
                          ? "valid"
                          : ""
                      }
                    >
                      <FaCheck />
                      <span>8 characters</span>
                    </span>

                    <span
                      className={
                        /[A-Za-z]/.test(
                          formData.password
                        )
                          ? "valid"
                          : ""
                      }
                    >
                      <FaCheck />
                      <span>One letter</span>
                    </span>

                    <span
                      className={
                        /\d/.test(
                          formData.password
                        )
                          ? "valid"
                          : ""
                      }
                    >
                      <FaCheck />
                      <span>One number</span>
                    </span>
                  </div>
                </div>

                {/* ===========================
                    CONFIRM PASSWORD
                ============================ */}
                <div className="register-form-group">
                  <label htmlFor="confirm-password">
                    Confirm Password{" "}
                    <span>*</span>
                  </label>

                  <div
                    className={`register-input-wrap ${
                      errors.confirm_password
                        ? "has-error"
                        : ""
                    }`}
                  >
                    <FaLock className="register-input-icon" />

                    <input
                      id="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirm_password"
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      value={
                        formData.confirm_password
                      }
                      onChange={handleChange}
                    />

                    {/* Show / Hide Confirm Password */}
                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>

                  {errors.confirm_password && (
                    <small className="field-error">
                      {
                        errors.confirm_password
                      }
                    </small>
                  )}

                  {/* Show success kapag pareho */}
                  {formData.confirm_password &&
                    formData.password ===
                      formData.confirm_password && (
                      <small className="field-success">
                        <FaCheck />

                        <span>
                          Passwords match
                        </span>
                      </small>
                    )}
                </div>
              </div>
            </fieldset>

            {/* ===============================
                PRIVACY NOTICE
            ================================ */}
            <div className="privacy-note">
              <FaShieldAlt />

              <span>
                Your information is used only
                to manage your account and
                restaurant reservations.
              </span>
            </div>

            {/* ===============================
                FORM BUTTONS
            ================================ */}
            <div className="register-form-actions">

              {/* CLEAR BUTTON
                  EVENT: onClick */}
              <button
                type="button"
                className="clear-form-button"
                onClick={handleClear}
                disabled={loading}
              >
                Clear Form
              </button>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {/* Conditional Operator */}
                {loading
                  ? "Creating Account..."
                  : "Create Customer Account"}
              </button>
            </div>

            {/* ===============================
                LOGIN LINK
            ================================ */}
            <div className="login-link">
              <span>
                Already have an account?
              </span>

              {/* EVENT: onClick */}
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
              >
                Sign In
              </button>
            </div>
          </form>

          {/* =================================
              FOOTER
          ================================== */}
          <footer className="register-footer">
            © 2026 Amora Dining. All rights
            reserved.
          </footer>
        </div>
      </section>
    </main>
  );
}

export default Register;