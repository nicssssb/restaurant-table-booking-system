import { Navigate } from "react-router-dom";


function ProtectedRoute({ children, allowedRole }) {


    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }



    if (
        allowedRole === user.role
    ) {

        return children;

    }



    return (

        <Navigate
            to="/login"
            replace
        />

    );

}


export default ProtectedRoute;