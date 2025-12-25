import "./CurrentMonth.css"

import { SpenderProvider, Adder, ItemList, Stats } from "@features/spending";
import { useAuth } from "@contexts/AuthContext";
import { useState } from 'react';

export default function CurrentMonth({ view = 'monthly' }){
    const { user } = useAuth();
    const viewTitle = view === 'monthly' ? 'Monthly Spending' : 'Full Overview';

    return(
        <SpenderProvider view={view}>
            <div className="current-month-container">
                <div className="current-month-body">
                    <header className="current-month-header">
                        <h1 className="current-month-title">Hello {user}</h1>
                        <h2 className="current-month-subtitle">{viewTitle}</h2>
                    </header>
                    <div className="current-month-section">
                        <Adder />
                        <ItemList />
                    </div>
                    <h1 className="current-month-title">Stats</h1>
                    <Stats />
                    
                </div>
            </div>
        </SpenderProvider>
    );
}