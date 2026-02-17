import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import BottomNav from './BottomNav';
import useAppStore from '../../store/useAppStore';

const Layout = ({ children }) => {
    const { darkMode } = useAppStore();

    return (
        <div className={`app-container ${darkMode ? 'dark' : ''}`}>
            <Header />
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
