import React, {createContext, useContext, useState, useEffect, useRef} from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { getCategoriesService, budgetAdderService, getBudgetListService, deleteBudgetService } from '../services/budgetService';

const BudgetContext = createContext();
export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error("useContext must be used within an BudgetProvider")
    }
    return context
}


export function BudgetProvider({children}){
    const [ categories, setCategories] = useState([]);
    const [ budgetList, setBudgetList ] = useState([]);
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            getCategories();
            getBudgetList();
        })()
    }, [])

    const getCategories = async () => {
        try {   
            const response = await getCategoriesService(token);
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            setCategories(data)
        }
        catch (err) {
            console.error(err)
        }
    }

    const getBudgetList = async () => {
        try {
            const response = await getBudgetListService(token);
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            setBudgetList(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleAddBudget = async (e) => {
        e.preventDefault();

        try {
            const response = await budgetAdderService(token, e.target)
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            console.log(data);
            setBudgetList(data);

        }
        catch (err) {
            console.error(err)
        }
    }

    const handleDeleteBudget = async (category) => {
        try {
            const response = await deleteBudgetService(token, category);
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            setBudgetList(data);
        }
        catch (err) {
            console.error('Error deleting budget item:', err)
        }
    }

    const value = {
        handleAddBudget,
        handleDeleteBudget,
        getCategories,
        categories,
        budgetList,
    }

    return (
        <BudgetContext.Provider value={value}>
            { children }
        </BudgetContext.Provider>
    )
}