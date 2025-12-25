import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { getDataService, 
    getMonthDataService,
    adderClickService, 
    deleteClickService, 
    totalSpentService, 
    percentPerCategoryService,
    pricePerCategoryService } from '../services/spendingService';

import { formValidation } from '../utils/spendingUtils';

const SpenderContext = createContext();

export const useSpender = () => {
    const context = useContext(SpenderContext);
    if(!context){
        throw new Error("useSpender must be used within an SpenderProvider")
    }

    return context;
}

export function SpenderProvider({ children, view = 'monthly' }){
    const [itemList, setItemList] = useState([]);
    const [percentPerCategory, setPercentPerCategory] = useState({});
    const [pricePerCategory, setPricePerCategory] = useState({});
    const [totalSpending, setTotalSpending] = useState(0);
    const [adderNotes, setAdderNotes] = useState("");
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // Determine view type: 'monthly' or 'all'
    const viewType = view === 'currentMonth' || view === 'monthly' ? 'monthly' : 'all';

    const handleGetData = async (viewParam = 'all') => {
        try {
            const response = await getDataService(token, viewParam);

            if (response.status === 401 || response.status === 403){
                logout();
                navigate("/Spending-Tracker-React/login");
            }
            else {
                const data = await response.json();
                setItemList(data);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleAdderClick = async (e) => {
        e.preventDefault();
        
        const entryFormData = new FormData(e.target);
        const formValidMessage = formValidation(entryFormData);
        setAdderNotes(formValidMessage)
        if (formValidMessage == "Adding successful!"){
            try {
                const response = await adderClickService(token, e.target);
                
                if (response.status === 401 || response.status === 403) {
                    logout();
                    navigate("/Spending-Tracker-React/login");
                    return;
                }
                
                const data = await response.json();
                setItemList(data.slice(0, -1));
                setTotalSpending(data.at(-1))
                handlePercentPerCategory(viewType);
                handlePricePerCategory(viewType);
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    const handleDeleteClick = async (index) => {
        const item_id = itemList[index]["_id"];

        try{
            const response = await deleteClickService(token, item_id);
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            setItemList(data.slice(0, -1));
            setTotalSpending(data.at(-1));
            handlePercentPerCategory(viewType);
            handlePricePerCategory(viewType);

        }
        catch (err) {
            console.error(err);
        }
        
    };

    const handleTotalSpent = async (view = 'all') => {
        try {
            const response = await totalSpentService(token, view);
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            const total_spent = data["total_spent"];
            setTotalSpending(total_spent);
        }
        catch (err) {
            console.log(err);
        }
        
    }

    const handlePercentPerCategory = async (view = 'all') => {
        try {
            const response = await percentPerCategoryService(token, view);
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            setPercentPerCategory(data)
        }
        catch (err) {
            console.error(err);
        }
    }

    const handlePricePerCategory = async(view = 'all') => {
        try {
            const response = await pricePerCategoryService(token, view);
            
            if (response.status === 401 || response.status === 403) {
                logout();
                navigate("/Spending-Tracker-React/login");
                return;
            }
            
            const data = await response.json();
            setPricePerCategory(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (!token) return;
        
        (async () => {
            handleGetData(viewType);
            handleTotalSpent(viewType);
            handlePercentPerCategory(viewType);
            handlePricePerCategory(viewType);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewType, token])
    
    const value = {
        handleGetData,
        handleAdderClick,
        handleDeleteClick,
        handleTotalSpent,
        handlePercentPerCategory,
        handlePricePerCategory,
        itemList,
        totalSpending,
        percentPerCategory,
        pricePerCategory,
        adderNotes,
        viewType,
    };

    return (
        <SpenderContext.Provider value={ value }>
            { children }
        </SpenderContext.Provider>
    )

}