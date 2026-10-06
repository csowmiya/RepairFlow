import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const handleBrandClick = () => {

        if (user?.role === "ADMIN") {
            navigate("/admin");
            return;
        }

        if (user?.role === "TECHNICIAN") {
            navigate("/technician");
            return;
        }

        if (user?.role === "CUSTOMER") {
            navigate("/customer");
            return;
        }

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <button
                className="navbar-brand"
                type="button"
                onClick={handleBrandClick}
            >
                <span className="brand-name">
                    RepairFlow
                </span>

                <span className="brand-tagline">
                    Repair Management System
                </span>
            </button>


            <div className="navbar-user">

                <div className="user-info">

                    <span className="user-name">
                        {user?.name}
                    </span>

                    <span className="user-role">
                        {user?.role}
                    </span>

                </div>


                <button
                    className="logout-button"
                    type="button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;