import { useNavigate } from "react-router-dom";

import {
    FaUser,
    FaUserShield,
    FaUtensils,
    FaArrowLeft
} from "react-icons/fa";

import "../../css/portal.css";


function Portal() {


    const navigate = useNavigate();



    return (

        <div className="portal-page">


            <div className="portal-container">



                {/* HEADER */}

                <div className="portal-header">


                    <div className="portal-logo">

                        <FaUtensils />

                    </div>



                    <h1>
                        Amora Dining
                    </h1>



                    <p>
                        Restaurant Reservation System
                    </p>


                </div>





                <h2>
                    Choose your account type
                </h2>





                <div className="portal-options">





                    {/* CUSTOMER LOGIN */}


                    <button

                        className="portal-card"

                        onClick={() =>
                            navigate("/home")
                        }

                    >


                        <FaUser />


                        <h3>
                            Customer
                        </h3>



                        <span>
                            Make reservations and manage bookings.
                        </span>



                    </button>







                    {/* ADMIN LOGIN */}


                    <button

                        className="portal-card"

                        onClick={() =>
                            navigate("/login?type=admin")
                        }

                    >


                        <FaUserShield />


                        <h3>
                            Administrator
                        </h3>



                        <span>
                            Manage reservations and restaurant records.
                        </span>



                    </button>




                </div>






             





            </div>


        </div>

    );

}


export default Portal;