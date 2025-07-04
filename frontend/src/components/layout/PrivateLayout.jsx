import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <div style={{ marginLeft: '250px', padding: '20px' }}>
                <div>
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default MainLayout;
