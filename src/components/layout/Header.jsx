import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Header = () => {
    const { userData, setActiveTab } = useAppStore();
    const user = userData || { name: 'Visitante' };

    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const localHour = new Date().getHours();
            if (localHour >= 5 && localHour < 12) setGreeting('Bom dia');
            else if (localHour >= 12 && localHour < 18) setGreeting('Boa tarde');
            else setGreeting('Boa noite');
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="navbar glass">
            {/* LEFT: Profile & Greeting */}
            <div className="nav-left" onClick={() => setActiveTab('profile')}>
                <div className="avatar-container">
                    <div className="avatar">
                        <User size={22} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="user-info">
                    <h1 className="greeting">{greeting}, {user.name.split(' ')[0]}</h1>
                    <p className="focus-msg">O que vamos realizar hoje?</p>
                </div>
            </div>

            <style>{`
                .navbar {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    height: 72px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 var(--spacing-lg);
                    transition: all 0.3s ease;
                }

                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    cursor: pointer;
                }

                .avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #F0F0F3, #FFFFFF);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color);
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
                }

                .greeting {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: -0.03em;
                }

                .focus-msg {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                    opacity: 0.8;
                }

                @media (max-width: 480px) {
                    .focus-msg {
                        display: none;
                    }
                    .greeting {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;
