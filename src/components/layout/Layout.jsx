import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';
import useAppStore from '../../store/useAppStore';

const Layout = ({ children }) => {
    // darkMode is now handled at body/root level mainly, but we can keep class if needed.
    // However, clean design relies on CSS vars.

    return (
        <div className="app-container">
            <Header />
            <Sidebar />
            <main className="content-area fade-in">
                {children}
            </main>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;

