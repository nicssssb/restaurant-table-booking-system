import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";


// =========================================
// PUBLIC / AUTH
// =========================================

import Home from "./pages/Home/Home";
import Portal from "./pages/Portal/Portal";
import Login from "./pages/Login";
import Register from "./pages/Register";


// =========================================
// ADMIN
// =========================================

import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Admin/Dashboard/Dashboard";

import Reservations from "./pages/Admin/Reservations/Reservations";
import AddReservation from "./pages/Admin/Reservations/AddReservation";
import ViewReservation from "./pages/Admin/Reservations/ViewReservation";
import EditReservation from "./pages/Admin/Reservations/EditReservation";


import Customers from "./pages/Admin/Customers/Customers";
import AddCustomer from "./pages/Admin/Customers/AddCustomer";
import EditCustomer from "./pages/Admin/Customers/EditCustomer";
import ViewCustomer from "./pages/Admin/Customers/ViewCustomer";


import Tables from "./pages/Admin/Tables/Tables";
import AddTable from "./pages/Admin/Tables/AddTable";
import EditTable from "./pages/Admin/Tables/EditTable";
import ViewTable from "./pages/Admin/Tables/ViewTable";


import Reports from "./pages/Admin/Reports/Reports";
import Settings from "./pages/Admin/Settings/Settings";


// =========================================
// CUSTOMER
// =========================================

import CustomerDashboard from "./pages/Customer/Dashboard/CustomerDashboard";

import MakeReservation from "./pages/Customer/Reservations/MakeReservation";

import MyReservations from "./pages/Customer/Reservations/MyReservations";

import ReservationHistory from "./pages/Customer/Reservations/ReservationHistory";

import CustomerProfile from "./pages/Customer/Profile/CustomerProfile";



function App() {


    return (

        <Routes>


            {/* =====================================
                PUBLIC ROUTES
            ===================================== */}

<Route
    path="/"
    element={<Portal />}
/>

<Route
    path="/home"
    element={<Home />}
/>


            {/* LOGIN */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* REGISTER */}

            <Route
                path="/register"
                element={<Register />}
            />




            {/* =====================================
                ADMIN PROTECTED ROUTES
            ===================================== */}


            <Route

                path="/admin"

                element={

                    <ProtectedRoute allowedRole="admin">

                        <AdminLayout />

                    </ProtectedRoute>

                }

            >


                <Route

                    index

                    element={

                        <Navigate
                            to="/admin/dashboard"
                            replace
                        />

                    }

                />


                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />



                {/* RESERVATIONS */}

                <Route
                    path="reservations"
                    element={<Reservations />}
                />


                <Route
                    path="reservations/add"
                    element={<AddReservation />}
                />


                <Route
                    path="reservations/view/:id"
                    element={<ViewReservation />}
                />


                <Route
                    path="reservations/edit/:id"
                    element={<EditReservation />}
                />



                {/* CUSTOMERS */}

                <Route
                    path="customers"
                    element={<Customers />}
                />


                <Route
                    path="customers/add"
                    element={<AddCustomer />}
                />


                <Route
                    path="customers/edit/:id"
                    element={<EditCustomer />}
                />


                <Route
                    path="customers/view/:id"
                    element={<ViewCustomer />}
                />



                {/* TABLES */}

                <Route
                    path="tables"
                    element={<Tables />}
                />


                <Route
                    path="tables/add"
                    element={<AddTable />}
                />

                <Route
                    path="tables/edit/:id"
                    element={<EditTable />}
                />
                <Route
                    path="tables/view/:id"
                    element={<ViewTable />}
                />


                {/* REPORTS */}

                <Route
                    path="reports"
                    element={<Reports />}
                />



                {/* SETTINGS */}

                <Route
                    path="settings"
                    element={<Settings />}
                />


            </Route>




            <Route

                path="/customer/dashboard"

                element={

                    <ProtectedRoute allowedRole="customer">

                        <CustomerDashboard />

                    </ProtectedRoute>

                }

            />



            <Route

                path="/customer/reservation"

                element={

                    <ProtectedRoute allowedRole="customer">

                        <MakeReservation />

                    </ProtectedRoute>

                }

            />



            <Route

                path="/customer/reservations"

                element={

                    <ProtectedRoute allowedRole="customer">

                        <MyReservations />

                    </ProtectedRoute>

                }

            />



            <Route

                path="/customer/history"

                element={

                    <ProtectedRoute allowedRole="customer">

                        <ReservationHistory />

                    </ProtectedRoute>

                }

            />



            <Route

                path="/customer/profile"

                element={

                    <ProtectedRoute allowedRole="customer">

                        <CustomerProfile />

                    </ProtectedRoute>

                }

            />




            {/* =====================================
                UNKNOWN ROUTE
            ===================================== */}


            <Route

                path="*"

                element={

                    <Navigate
                        to="/"
                        replace
                    />

                }

            />


        </Routes>

    );

}


export default App;