import "./NavBar.css"
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext.jsx";
import { useDashBoard } from "@contexts/DashBoardContext";

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, logout } = useAuth();
    const { toggleSideBar } = useDashBoard();

    const handleNavigateDashboard = () => {
        navigate("/Spending-Tracker-React/dashboard");
    };

    const handleNavigateHome = () => {
        navigate("/Spending-Tracker-React");
    };

    const handleNavigateLogin = () => { 
        navigate("/Spending-Tracker-React/login");
    };

    const handleLogout = () => {
        logout();
        navigate("/Spending-Tracker-React");
    };

    return (
        <nav className="navbar-container">
            {location.pathname == "/Spending-Tracker-React/dashboard" && (
                <div className="navbar-container-menu-icon">
                    <span className="menu-icon" onClick={toggleSideBar}>☰</span>
                </div>
            )}
            
            <div className="navbar-container-content">
                <a onClick={handleNavigateHome} className="navbar-link">Home</a>
                <a onClick={handleNavigateDashboard} className="navbar-link">Dashboard</a>
                {isLoggedIn ? (
                    <a onClick={handleLogout} className="navbar-link">Logout</a>
                ) : (
                    <a onClick={handleNavigateLogin} className="navbar-link">Login</a>
                )}
            </div>
        </nav>
    );
}