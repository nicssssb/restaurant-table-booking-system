import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaChair,
    FaUsers,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaEdit
} from "react-icons/fa";

import "../../../css/admin-table.css";


function ViewTable() {


    const navigate = useNavigate();

    const { id } = useParams();



    // =========================================
    // TABLE DATA
    // =========================================

    const tables = [

        {
            id: "1",
            table_number: "Table 01",
            capacity: 2,
            location: "Indoor",
            status: "Available",
            description:
                "A cozy indoor table perfect for couples and quiet dining.",
            image:
                "/images/table-01.jpg"
        },


        {
            id: "2",
            table_number: "Table 02",
            capacity: 4,
            location: "Indoor",
            status: "Available",
            description:
                "A comfortable indoor family table for casual gatherings.",
            image:
                "/images/table-04.jpg"
        },


        {
            id: "3",
            table_number: "Table 03",
            capacity: 6,
            location: "Indoor",
            status: "Available",
            description:
                "A spacious indoor setting for groups and celebrations.",
            image:
                "/images/indoor-table-03.jpg"
        },


        {
            id: "4",
            table_number: "Table 04",
            capacity: 2,
            location: "Outdoor",
            status: "Available",
            description:
                "A relaxing outdoor patio table.",
            image:
                "/images/outdoor-table-01.jpg"
        },


        {
            id: "5",
            table_number: "Table 05",
            capacity: 4,
            location: "Outdoor",
            status: "Available",
            description:
                "Outdoor family table with garden atmosphere.",
            image:
                "/images/outdoor-table-02.jpg"
        },


        {
            id: "6",
            table_number: "Table 06",
            capacity: 8,
            location: "Outdoor",
            status: "Available",
            description:
                "Large outdoor table for bigger groups.",
            image:
                "/images/table-07.jpg"
        },


        {
            id: "7",
            table_number: "Room 07",
            capacity: 6,
            location: "Private Room",
            status: "Available",
            description:
                "Private room for family dinners and small celebrations.",
            image:
                "/images/private-room-01.jpg"
        },


        {
            id: "8",
            table_number: "Room 08",
            capacity: 10,
            location: "Private Room",
            status: "Available",
            description:
                "Private dining room for celebrations.",
            image:
                "/images/table-08.jpg"
        },


        {
            id: "9",
            table_number: "Room 09",
            capacity: 12,
            location: "Private Room",
            status: "Available",
            description:
                "Large private room for special occasions.",
            image:
                "/images/private-room-03.jpg"
        }

    ];



    const table =
        tables.find(
            (item) =>
                String(item.id) === String(id)
        );



    // =========================================
    // IF TABLE NOT FOUND
    // =========================================

    if (!table) {

        return (

            <div className="admin-table-view-page">


                <button

                    className="back-button"

                    onClick={() =>
                        navigate("/admin/tables")
                    }

                >

                    <FaArrowLeft />

                    Back to Tables

                </button>


                <h2>
                    Table Not Found
                </h2>


            </div>

        );

    }




    return (

        <div className="admin-table-view-page">



            {/* HEADER */}

            <div className="admin-page-header">


                <button

                    className="back-button"

                    onClick={() =>
                        navigate("/admin/tables")
                    }

                >

                    <FaArrowLeft />

                    Back to Tables

                </button>



                <h1>
                    Table Details
                </h1>


                <p>
                    View complete information about this dining table.
                </p>


            </div>





            {/* TABLE CARD */}


            <div className="table-view-card">



                {/* IMAGE */}

                <div className="table-view-image">

                    <img

                        src={table.image}

                        alt={table.table_number}

                    />

                </div>





                {/* DETAILS */}

                <div className="table-view-content">



                    <div className="table-title">


                        <h2>
                            {table.table_number}
                        </h2>



                        <span className="status available">

                            <FaCheckCircle />

                            {table.status}

                        </span>


                    </div>






                    <div className="table-information">



                        <div>

                            <FaChair />

                            <span>

                                <small>
                                    Table Number
                                </small>


                                <strong>
                                    {table.table_number}
                                </strong>


                            </span>

                        </div>





                        <div>

                            <FaUsers />

                            <span>

                                <small>
                                    Capacity
                                </small>


                                <strong>
                                    {table.capacity} Guests
                                </strong>


                            </span>

                        </div>





                        <div>

                            <FaMapMarkerAlt />

                            <span>

                                <small>
                                    Location
                                </small>


                                <strong>
                                    {table.location}
                                </strong>


                            </span>

                        </div>


                    </div>






                    <div className="table-description">


                        <h3>
                            Description
                        </h3>


                        <p>
                            {table.description}
                        </p>


                    </div>






                    <div className="table-actions">


                        <button

                            className="edit-table-button"

                            onClick={() =>
                                navigate(
                                    `/admin/tables/edit/${table.id}`
                                )
                            }

                        >

                            <FaEdit />

                            Edit Table

                        </button>


                    </div>



                </div>


            </div>


        </div>

    );

}


export default ViewTable;