import "./DashboardPage.css"
import NavBar from '@components/layout/NavBar/Navbar.jsx'
import CurrentMonth from "./subpage/CurrentMonth/CurrentMonth";
import Budget from "./subpage/Budget/Budget";
import { SideBar } from "@features/spending";
import { useState, useEffect } from "react";
import { DashBoardProvider, useDashBoard } from "@contexts/DashBoardContext";

export default function DashboardPage(){
    const [activeComponent, setActiveComponent] = useState("currentMonth");
    const [ isDesktop, setIsDesktop] = useState(false);
    const { isSideBar } = useDashBoard();


    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        
        // Set initial value
        handleResize();
        
        window.addEventListener('resize', handleResize);
        console.log("isDesktop:", isDesktop);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    const handleSideBarClick = (component) => {
        setActiveComponent(component);
    }

    return (

        <div className="dashboard-container">
            <nav className="navbar-container-dashboard">
                <NavBar />
            </nav>
            
            <section className={`dashboard-section${(isDesktop || isSideBar) ? '-visible' : ''}`}>
                {(isDesktop || isSideBar) && (
                    <div className="sidebar-backdrop"></div>
                )}
                
                <div className={`dashboard-section-sidebar${(isDesktop || isSideBar) ? '-visible': ''}`}>
                    <SideBar onComponentChange={handleSideBarClick}/>
                </div>
                
                <div className={`dashboard-section-content${(isDesktop || isSideBar) ? '-visible' : ''}`}>
                    {activeComponent === 'currentMonth' && <CurrentMonth view="monthly" />}
                    {activeComponent === 'allTime' && <CurrentMonth view="all" />}
                    {activeComponent === "budget" && <Budget />}
                </div>
            
            </section>
        </div>

    );
}