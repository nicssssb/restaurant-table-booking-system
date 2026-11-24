
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaUtensils,
    FaCalendarCheck,
    FaClock,
    FaUsers,
    FaArrowRight,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEye,
    FaTimes
} from "react-icons/fa";

import "../../css/home.css";


function Home() 

{
const [activeSection, setActiveSection] = useState("home");

useEffect(() => {

    const handleScroll = () => {

        const sections = [
            "home",
            "about",
            "menu",
            "dining-spaces"
        ];

        let current = "home";

        sections.forEach((id) => {

            const section = document.getElementById(id);

            if (section) {

                const top = section.getBoundingClientRect().top;

                if (top <= 150) {
                    current = id;
                }

            }

        });

        setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
    };

}, []);

    const navigate = useNavigate();


    // =========================================
    // MAKE RESERVATION
    // =========================================

    const handleMakeReservation = () => {
        navigate("/login");
    };


    const [activeDiningCategory, setActiveDiningCategory] = useState("indoor");
    const [selectedTableView, setSelectedTableView] = useState(null);
    const [activeMenuCategory, setActiveMenuCategory] = useState("main");


    const diningSpaces = [
        {
            id: 1,
            category: "indoor",
            label: "INDOOR • TABLE 01",
            name: "Indoor Table for Two",
            image: "/images/table-01.jpg",
            alt: "Indoor table for two",
            capacity: "2 Guests",
            price: 300,
            viewName: "Window View",
            viewDescription: "Faces the restaurant window and gives guests a bright, relaxed street-side view.",
            viewImage: "/images/view-table-01-center.jpg",
            description:
                "A cozy indoor table perfect for couples, coffee dates, and quiet dining."
        },
        {
            id: 2,
            category: "indoor",
            label: "INDOOR • TABLE 02",
            name: "Indoor Family Table",
            image: "/images/table-04.jpg",
            alt: "Indoor family dining table",
            capacity: "4 Guests",
            price: 500,
            viewName: "Main Dining Area View",
            viewDescription: "Looks toward the main dining area, giving guests a lively restaurant atmosphere.",
            viewImage: "/images/view-table-02-center.jpg",
            description:
                "A comfortable indoor table for family meals, friends, and casual gatherings."
        },
        {
            id: 3,
            category: "indoor",
            label: "INDOOR • TABLE 03",
            name: "Indoor Group Table",
            image: "/images/indoor-table-03.jpg",
            alt: "Large indoor dining table",
            capacity: "6 Guests",
            price: 700,
            viewName: "Interior Feature View",
            viewDescription: "Faces the restaurant interior and decorative feature wall for a warm indoor ambiance.",
            viewImage: "/images/view-table-03-center.jpg",
            description:
                "A spacious indoor setting for small groups, celebrations, and get-togethers."
        },
        {
            id: 4,
            category: "outdoor",
            label: "OUTDOOR • TABLE 04",
            name: "Outdoor Patio Table",
            image: "/images/outdoor-table-01.jpg",
            alt: "Outdoor patio table for two",
            capacity: "2 Guests",
            price: 350,
            viewName: "Patio View",
            viewDescription: "Faces the open patio area with fresh air and a casual outdoor atmosphere.",
            viewImage: "/images/view-table-04-center.jpg",
            description:
                "A fresh open-air setting for relaxing meals, coffee dates, and casual conversations."
        },
        {
            id: 5,
            category: "outdoor",
            label: "OUTDOOR • TABLE 05",
            name: "Outdoor Family Table",
            image: "/images/outdoor-table-02.jpg",
            alt: "Outdoor family dining table",
            capacity: "4 Guests",
            price: 550,
            viewName: "Garden View",
            viewDescription: "Looks toward the garden and greenery, ideal for guests who prefer a calm outdoor setting.",
            viewImage: "/images/view-table-05-center.jpg",
            description:
                "Enjoy your meal outdoors with enough space for family members and close friends."
        },
        {
            id: 6,
            category: "outdoor",
            label: "OUTDOOR • TABLE 06",
            name: "Outdoor Garden Table",
            image: "/images/table-07.jpg",
            alt: "Large outdoor garden dining table",
            capacity: "8 Guests",
            price: 900,
            viewName: "Open Garden View",
            viewDescription: "Offers a wider garden view and open surroundings for larger outdoor gatherings.",
            viewImage: "/images/view-table-06-center.jpg",
            description:
                "A relaxed outdoor dining space for bigger groups, family gatherings, and friendly celebrations."
        },
        {
            id: 7,
            category: "private",
            label: "PRIVATE • ROOM 07",
            name: "Private Family Room",
            image: "/images/private-room-01.jpg",
            alt: "Small private dining room",
            capacity: "6 Guests",
            price: 1200,
            viewName: "Private Interior View",
            viewDescription: "A fully private enclosed view with a quiet interior, away from the main dining area.",
            viewImage: "/images/view-room-07-center.jpg",
            description:
                "A quiet private room for family dinners, small meetings, and intimate celebrations."
        },
        {
            id: 8,
            category: "private",
            label: "PRIVATE • ROOM 08",
            name: "Private Dining Room",
            image: "/images/table-08.jpg",
            alt: "Private dining room for celebrations",
            capacity: "10 Guests",
            price: 1800,
            viewName: "Private Celebration View",
            viewDescription: "Shows the spacious private-room interior suitable for birthdays and small celebrations.",
            viewImage: "/images/view-room-08-center.jpg",
            description:
                "A private space designed for birthdays, celebrations, meetings, and special occasions."
        },
        {
            id: 9,
            category: "private",
            label: "PRIVATE • ROOM 09",
            name: "Private Celebration Room",
            image: "/images/private-room-03.jpg",
            alt: "Large private celebration room",
            capacity: "12 Guests",
            price: 2500,
            viewName: "Large Private Room View",
            viewDescription: "Shows the full large-room setup so groups can preview the space before booking.",
            viewImage: "/images/view-room-09-center.jpg",
            description:
                "A larger private room for birthdays, reunions, celebrations, and group dining."
        }
    ];


    // =========================================
    // PUBLIC MENU
    // =========================================

    const menuItems = [
        {
            id: 1,
            category: "appetizers",
            name: "Crispy Calamari",
            image: "/images/menu-crispy-calamari.jpg",
            alt: "Crispy calamari appetizer",
            description: "Lightly breaded calamari served with a tangy house dipping sauce.",
            price: 280
        },
        {
            id: 2,
            category: "appetizers",
            name: "Chicken Wings",
            image: "/images/menu-chicken-wings.jpg",
            alt: "Crispy chicken wings",
            description: "Crispy chicken wings tossed in your choice of savory house sauce.",
            price: 320
        },
        {
            id: 3,
            category: "appetizers",
            name: "Classic Caesar Salad",
            image: "/images/menu-caesar-salad.jpg",
            alt: "Classic Caesar salad",
            description: "Fresh romaine lettuce, parmesan, croutons, and creamy Caesar dressing.",
            price: 250
        },
        {
            id: 4,
            category: "main",
            name: "Grilled Chicken Steak",
            image: "/images/menu-grilled-chicken-steak.jpg",
            alt: "Grilled chicken steak with vegetables and rice",
            description: "Tender grilled chicken served with seasoned vegetables and rice.",
            price: 390
        },
        {
            id: 5,
            category: "main",
            name: "Beef Salpicao",
            image: "/images/menu-beef-salpicao.jpg",
            alt: "Beef salpicao with rice and vegetables",
            description: "Garlic butter beef cubes served with steamed rice and vegetables.",
            price: 450
        },
        {
            id: 6,
            category: "main",
            name: "Pan-Seared Fish Fillet",
            image: "/images/menu-fish-fillet.jpg",
            alt: "Pan-seared fish fillet",
            description: "Seasoned fish fillet with herb butter, vegetables, and rice.",
            price: 420
        },
        {
            id: 7,
            category: "pasta",
            name: "Chicken Alfredo",
            image: "/images/menu-chicken-alfredo.jpg",
            alt: "Creamy chicken Alfredo pasta",
            description: "Creamy fettuccine pasta topped with seasoned grilled chicken.",
            price: 320
        },
        {
            id: 8,
            category: "pasta",
            name: "Seafood Aglio Olio",
            image: "/images/menu-seafood-aglio-olio.jpg",
            alt: "Seafood aglio olio pasta",
            description: "Garlic olive-oil pasta with shrimp, herbs, and a hint of chili.",
            price: 360
        },
        {
            id: 9,
            category: "pasta",
            name: "Creamy Mushroom Pasta",
            image: "/images/menu-mushroom-pasta.jpg",
            alt: "Creamy mushroom pasta",
            description: "Pasta tossed in a rich mushroom cream sauce with parmesan.",
            price: 300
        },
        {
            id: 10,
            category: "desserts",
            name: "Chocolate Lava Cake",
            image: "/images/menu-chocolate-lava-cake.jpg",
            alt: "Chocolate lava cake dessert",
            description: "Warm chocolate cake with a soft molten center and vanilla cream.",
            price: 220
        },
        {
            id: 11,
            category: "desserts",
            name: "Mango Cheesecake",
            image: "/images/menu-mango-cheesecake.jpg",
            alt: "Mango cheesecake dessert",
            description: "Creamy cheesecake topped with sweet Philippine mangoes.",
            price: 210
        },
        {
            id: 12,
            category: "desserts",
            name: "Caramel Flan",
            image: "/images/menu-caramel-flan.jpg",
            alt: "Caramel flan dessert",
            description: "Silky custard finished with a smooth caramel glaze.",
            price: 180
        },
        {
            id: 13,
            category: "beverages",
            name: "House Iced Tea",
            image: "/images/menu-house-iced-tea.jpg",
            alt: "House iced tea with citrus",
            description: "Freshly brewed iced tea served chilled with citrus.",
            price: 90
        },
        {
            id: 14,
            category: "beverages",
            name: "Fresh Lemonade",
            image: "/images/menu-fresh-lemonade.jpg",
            alt: "Fresh lemonade drink",
            description: "Refreshing house lemonade made with fresh citrus.",
            price: 120
        },
        {
            id: 15,
            category: "beverages",
            name: "Iced Cafe Latte",
            image: "/images/menu-iced-cafe-lattemenu-iced-cafe-latte.jpg",
            alt: "Iced cafe latte",
            description: "Espresso, chilled milk, and ice for a smooth coffee finish.",
            price: 150
        }
    ];


    const menuCategories = [
        { key: "appetizers", label: "Appetizers" },
        { key: "main", label: "Main Course" },
        { key: "pasta", label: "Pasta" },
        { key: "desserts", label: "Desserts" },
        { key: "beverages", label: "Beverages" }
    ];


    const filteredMenuItems = menuItems.filter(
        (item) => item.category === activeMenuCategory
    );


    const filteredDiningSpaces = diningSpaces.filter(
        (space) => space.category === activeDiningCategory
    );


    const categoryLabels = {
        indoor: "Indoor Tables",
        outdoor: "Outdoor Tables",
        private: "Private Rooms"
    };


    const formatPrice = (price) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);


    const handleOpenTableView = (space) => {
        setSelectedTableView(space);
    };


    const handleCloseTableView = () => {
        setSelectedTableView(null);
    };


    return (

        <div className="public-home">

           {/* =====================================
            NAVBAR
            ===================================== */}

<header className="public-navbar">


    {/* LOGO */}

    <div className="public-logo">

        <div className="public-logo-icon">
            <FaUtensils />
        </div>


        <div>

            <h2>
                Amora Dining
            </h2>


            <span>
                Restaurant
            </span>

        </div>

    </div>



    {/* NAVIGATION */}

   <nav className="public-nav">

    <a
        href="#home"
        className={activeSection === "home" ? "active" : ""}
    >
        Home
    </a>

    <a
        href="#about"
        className={activeSection === "about" ? "active" : ""}
    >
        About
    </a>

    <a
        href="#menu"
        className={activeSection === "menu" ? "active" : ""}
    >
        Menu
    </a>

    <a
        href="#dining-spaces"
        className={
            activeSection === "dining-spaces"
                ? "active"
                : ""
        }
    >
        Dining Spaces
    </a>


    <button
        type="button"
        className="navbar-login-button"
        onClick={() => navigate("/login")}
    >
        Login
    </button>


    <button
        type="button"
        className="navbar-reserve-button"
        onClick={handleMakeReservation}
    >
        <FaCalendarCheck />
        Reserve Table
    </button>

</nav>


</header>


            {/* =====================================
                HERO
            ===================================== */}

            <section
                className="home-hero"
                id="home"
            >

                <div className="hero-overlay"></div>


                <div className="hero-content">

                    <span className="hero-label">
                        WELCOME TO AMORA DINING
                    </span>

                    <h1>
                        A Dining Experience
                        <br />
                        <em>Worth Remembering.</em>
                    </h1>

                    <p>
                        Enjoy delicious food, a warm atmosphere,
                        and meaningful moments at Amora Dining.
                        Reserve your table and make your next
                        dining experience special.
                    </p>


                    <div className="hero-buttons">

                        <button
                            type="button"
                            className="hero-primary-button"
                            onClick={handleMakeReservation}
                        >

                            <FaCalendarCheck />

                            Make a Reservation

                            <FaArrowRight />

                        </button>


                        <a
                            href="#about"
                            className="hero-secondary-button"
                        >
                            Discover Amora
                        </a>

                    </div>

                </div>

            </section>


            {/* =====================================
                QUICK INFORMATION
            ===================================== */}

            <section className="home-info">

                {/* LOCATION */}

                <div className="info-card">

                    <div className="info-icon">
                        <FaMapMarkerAlt />
                    </div>

                    <div>

                        <h3>
                            Visit Us
                        </h3>

                        <p>
                            Amora Dining Restaurant
                        </p>

                    </div>

                </div>


                {/* HOURS */}

                <div className="info-card">

                    <div className="info-icon">
                        <FaClock />
                    </div>

                    <div>

                        <h3>
                            Opening Hours
                        </h3>

                        <p>
                            Daily · 10:00 AM – 10:00 PM
                        </p>

                    </div>

                </div>


                {/* RESERVATION */}

                <div className="info-card">

                    <div className="info-icon">
                        <FaCalendarCheck />
                    </div>

                    <div>

                        <h3>
                            Easy Reservations
                        </h3>

                        <p>
                            Book your table online
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================
                ABOUT
            ===================================== */}

            <section
                className="about-section"
                id="about"
            >

                {/* IMAGE */}

                <div className="about-image"></div>


                {/* CONTENT */}

                <div className="about-content">

                    <span className="section-label">
                        OUR RESTAURANT
                    </span>

                    <h2>
                        Where Good Food
                        <br />
                        Meets Good Moments.
                    </h2>

                    <p>
                        Amora Dining is a welcoming restaurant
                        created for guests who appreciate good
                        food and a comfortable dining experience.
                    </p>

                    <p>
                        Whether you're enjoying a casual meal,
                        celebrating a special occasion, or spending
                        time with family and friends, we provide a
                        warm space where every visit can be memorable.
                    </p>


                    <button
                        type="button"
                        className="about-button"
                        onClick={handleMakeReservation}
                    >

                        Reserve Your Table

                        <FaArrowRight />

                    </button>

                </div>

            </section>


            {/* =====================================
                PUBLIC MENU
            ===================================== */}

            <section
                className="public-menu-section"
                id="menu"
                aria-labelledby="public-menu-title"
            >

                <div className="public-menu-shell">

                    <div className="public-menu-heading">
                        <span className="section-label">
                            DISCOVER OUR FLAVORS
                        </span>

                        <h2 id="public-menu-title">
                            Our Menu
                        </h2>

                        <p>
                            Browse our featured dishes and prices before choosing
                            the perfect dining space for your visit.
                        </p>
                    </div>


                    <div
                        className="public-menu-tabs"
                        role="tablist"
                        aria-label="Menu categories"
                    >
                        {menuCategories.map((category) => (
                            <button
                                type="button"
                                role="tab"
                                key={category.key}
                                className={
                                    activeMenuCategory === category.key
                                        ? "public-menu-tab active"
                                        : "public-menu-tab"
                                }
                                onClick={() => setActiveMenuCategory(category.key)}
                                aria-selected={activeMenuCategory === category.key}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>


                    <div
                        className="public-menu-grid"
                        role="tabpanel"
                        aria-live="polite"
                    >
                        {filteredMenuItems.map((item) => (
                            <article className="public-menu-card" key={item.id}>

                                <div className="public-menu-image-wrap">
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        className="public-menu-image"
                                        loading="lazy"
                                    />

                                    <span className="public-menu-item-number">
                                        {String(item.id).padStart(2, "0")}
                                    </span>

                                    <span className="public-menu-item-price">
                                        {formatPrice(item.price)}
                                    </span>
                                </div>

                                <div className="public-menu-card-body">
                                    <h3>{item.name}</h3>

                                    <p>{item.description}</p>

                                    <div className="public-menu-card-footer">
                                        <span>Available for dine-in</span>
                                        <FaUtensils />
                                    </div>
                                </div>

                            </article>
                        ))}
                    </div>


                    <div className="public-menu-footer">
                        <p>
                            Menu items and availability may vary. Reservation fees
                            for dining spaces are shown separately.
                        </p>

                        <a
                            href="#dining-spaces"
                            className="public-menu-next-button"
                        >
                            Choose a Dining Space
                            <FaArrowRight />
                        </a>
                    </div>

                </div>

            </section>


{/* =========================================
    OUR DINING TABLES
========================================= */}

<section className="dining-tables-section" id="dining-spaces" aria-labelledby="dining-spaces-title">

    <div className="dining-tables-shell">

        <div className="dining-tables-heading">

            <span className="section-label">
                FIND YOUR PERFECT TABLE
            </span>

            <h2 id="dining-spaces-title">
                Our Dining Spaces
            </h2>

            <p>
                Choose a dining area, check the table view and reservation fee,
                then reserve the space that best fits your occasion.
            </p>

        </div>


        <div
            className="dining-category-buttons"
            role="tablist"
            aria-label="Dining space categories"
        >

            <button
                type="button"
                role="tab"
                className={activeDiningCategory === "indoor" ? "dining-category-button active" : "dining-category-button"}
                onClick={() => setActiveDiningCategory("indoor")}
                aria-selected={activeDiningCategory === "indoor"}
            >
                Indoor Tables
            </button>

            <button
                type="button"
                role="tab"
                className={activeDiningCategory === "outdoor" ? "dining-category-button active" : "dining-category-button"}
                onClick={() => setActiveDiningCategory("outdoor")}
                aria-selected={activeDiningCategory === "outdoor"}
            >
                Outdoor Tables
            </button>

            <button
                type="button"
                role="tab"
                className={activeDiningCategory === "private" ? "dining-category-button active" : "dining-category-button"}
                onClick={() => setActiveDiningCategory("private")}
                aria-selected={activeDiningCategory === "private"}
            >
                Private Rooms
            </button>

        </div>


        <div className="dining-results-header">
            <div>
                <span className="dining-results-eyebrow">Currently viewing</span>
                <h3>{categoryLabels[activeDiningCategory]}</h3>
            </div>

            <span className="dining-results-count">
                {filteredDiningSpaces.length} available options
            </span>
        </div>


        <div
            className="dining-tables-grid"
            role="tabpanel"
            aria-live="polite"
        >

            {filteredDiningSpaces.map((space) => (
                <article className="dining-table-card" key={space.id}>

                    <div className="dining-table-image">
                        <img
                            src={space.image}
                            alt={space.alt}
                        />

                        <span className="table-capacity">
                            <FaUsers />
                            {space.capacity}
                        </span>
                    </div>

                    <div className="dining-table-content">

                        <span className="table-number">
                            {space.label}
                        </span>

                        <h3>
                            {space.name}
                        </h3>

                        <p className="table-description">
                            {space.description}
                        </p>

                        <button
                            type="button"
                            className="table-view-summary"
                            onClick={() => handleOpenTableView(space)}
                            aria-label={`Preview the view from ${space.name}`}
                        >
                            <span className="table-view-summary-icon">
                                <FaEye />
                            </span>

                            <span className="table-view-summary-copy">
                                <small>View from this table</small>
                                <strong>{space.viewName}</strong>
                            </span>

                            <FaArrowRight className="table-view-summary-arrow" />
                        </button>

                        <div className="table-card-footer">
                            <div className="table-price-copy">
                                <span>Reservation fee</span>
                                <strong>{formatPrice(space.price)}</strong>
                                <small>per booking</small>
                            </div>

                            
                        </div>

                    </div>

                </article>
            ))}

        </div>


        <p className="dining-price-note">
            Reservation fees are shown per booking. Food and other charges are separate.
        </p>


        {selectedTableView && (
            <div
                className="table-view-modal-overlay"
                onClick={handleCloseTableView}
                role="presentation"
            >
                <div
                    className="table-view-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="table-view-modal-title"
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        className="table-view-modal-close"
                        onClick={handleCloseTableView}
                        aria-label="Close table view"
                    >
                        <FaTimes />
                    </button>

                    <div className="table-view-modal-image-wrap">
                        <div className="table-view-modal-image">
                            <img
                                src={selectedTableView.viewImage || selectedTableView.image}
                                alt={`View from ${selectedTableView.name}`}
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = selectedTableView.image;
                                }}
                            />
                        </div>

                        <span className="table-view-modal-image-label">
                            Actual table view preview
                        </span>
                    </div>

                    <div className="table-view-modal-content">
                        <span className="table-number">
                            {selectedTableView.label}
                        </span>

                        <h3 id="table-view-modal-title">
                            {selectedTableView.viewName}
                        </h3>

                        <p className="table-view-modal-description">
                            {selectedTableView.viewDescription}
                        </p>

                        <div className="table-view-modal-info">
                            <span>
                                <FaUsers />
                                {selectedTableView.capacity}
                            </span>
                            <span>{selectedTableView.name}</span>
                        </div>

                        <div className="table-view-modal-price">
                            <div>
                                <span>Reservation Fee</span>
                                <small>Per table booking</small>
                            </div>
                            <strong>{formatPrice(selectedTableView.price)}</strong>
                        </div>

                        
                    </div>
                </div>
            </div>
        )}


        <div className="dining-tables-cta">

            <div className="dining-tables-cta-copy">
                <span>READY TO BOOK?</span>
                <h3>Found the perfect setting?</h3>
                <p>
                    Reserve your preferred indoor table, outdoor table,
                    or private room in just a few steps.
                </p>
            </div>

            <button
                type="button"
                className="dining-tables-cta-button"
                onClick={handleMakeReservation}
            >
                <FaCalendarCheck />
                Make a Reservation
                <FaArrowRight />
            </button>

        </div>

    </div>

</section>

            {/* =====================================
                EXPERIENCE
            ===================================== */}

            <section
                className="experience-section"
                id="experience"
            >

                <div className="section-heading">

                    <span className="section-label">
                        THE AMORA EXPERIENCE
                    </span>

                    <h2>
                        Designed Around You
                    </h2>

                    <p>
                        From the moment you arrive to the moment
                        you leave, we aim to make your dining
                        experience simple, comfortable, and enjoyable.
                    </p>

                </div>


                <div className="experience-grid">

                    {/* EXPERIENCE 01 */}

                    <div className="experience-card">

                        <div className="experience-number">
                            01
                        </div>

                        <div className="feature-icon">
                            <FaUtensils />
                        </div>

                        <h3>
                            Great Dining
                        </h3>

                        <p>
                            Enjoy carefully prepared meals in
                            a comfortable and welcoming setting.
                        </p>

                    </div>


                    {/* EXPERIENCE 02 */}

                    <div className="experience-card">

                        <div className="experience-number">
                            02
                        </div>

                        <div className="feature-icon">
                            <FaCalendarCheck />
                        </div>

                        <h3>
                            Simple Reservations
                        </h3>

                        <p>
                            Choose your preferred date, time,
                            guests, and available table with ease.
                        </p>

                    </div>


                    {/* EXPERIENCE 03 */}

                    <div className="experience-card">

                        <div className="experience-number">
                            03
                        </div>

                        <div className="feature-icon">
                            <FaUsers />
                        </div>

                        <h3>
                            Every Occasion
                        </h3>

                        <p>
                            A comfortable place for family dinners,
                            celebrations, gatherings, and special moments.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================
                RESERVATION CTA
            ===================================== */}

            <section className="reservation-cta">

                <div>

                    <span>
                        MAKE YOUR NEXT VISIT SPECIAL
                    </span>

                    <h2>
                        Ready to reserve your table?
                    </h2>

                    <p>
                        Choose your preferred date and time
                        and let us prepare your table.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleMakeReservation}
                >

                    <FaCalendarCheck />

                    Reserve Your Table

                    <FaArrowRight />

                </button>

            </section>


            {/* =====================================
                CONTACT
            ===================================== */}

            <section className="contact-section">

                <div>

                    <span className="section-label">
                        GET IN TOUCH
                    </span>

                    <h2>
                        Visit Amora Dining
                    </h2>

                    <p>
                        Have a question or want to learn more
                        about our restaurant? We would be happy
                        to welcome you.
                    </p>

                </div>


                <div className="contact-details">

                    <div>

                        <strong>
                            <FaMapMarkerAlt /> Location
                        </strong>

                        <span>
                            Amora Dining Restaurant
                        </span>

                    </div>


                    <div>

                        <strong>
                            <FaPhoneAlt /> Contact
                        </strong>

                        <span>
                            +63 900 000 0000
                        </span>

                    </div>


                    <div>

                        <strong>
                            <FaClock /> Hours
                        </strong>

                        <span>
                            10:00 AM – 10:00 PM
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================
                FOOTER
            ===================================== */}

            <footer className="public-footer">

                <div className="footer-brand">

                    <FaUtensils />

                    <strong>
                        Amora Dining
                    </strong>

                </div>


                <span>
                    © 2026 Amora Dining. All rights reserved.
                </span>


                <span>
                    Restaurant Reservation System
                </span>

            </footer>

        </div>

    );

}


export default Home;