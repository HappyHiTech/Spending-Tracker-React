import { useAuth } from "@contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {isLoggedIn} = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/Spending-Tracker-React/login" replace />;
    }

    return children;
};

export default ProtectedRoute;