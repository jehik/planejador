import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import useAppStore from '../../store/useAppStore';

const Layout = ({ children }) => {
    // Forced Light Mode (Theme handling removed)


    return (
        <div className="app-container">
            <Header />
            <Sidebar />
            <main className="content-area fade-in">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;

