import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import BottomSheetMenu from './BottomSheetMenu';
import useAppStore from '../../store/useAppStore';

const Layout = ({ children }) => {
    // Forced Light Mode (Theme handling removed)


    return (
        <div className="app-container">
            <Header />
            <Sidebar />
            <main className="content-area fade-in" style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: 'calc(80px + var(--safe-area-bottom))'
            }}>
                {children}
            </main>
            <BottomNav />
            <BottomSheetMenu />
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;

