import { Navigate } from "react-router-dom";


function ProtectedRoute({
    allowedRole,
    children
}) {

    const token =
        localStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user");


    let user = null;


    try {

        user =
            storedUser
                ? JSON.parse(storedUser)
                : null;

    } catch (error) {

        console.log(
            "Invalid user data in localStorage."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }


    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (user.role !== allowedRole) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return children;
}


export default ProtectedRoute;