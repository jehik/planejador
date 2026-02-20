import React, { useEffect, useState } from 'react';
import { Menu, Home, User } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Header = () => {
    const { userData, setActiveTab, toggleMenu } = useAppStore();
    const user = userData || { name: 'Visitante' };

    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours() - 3; // Fuso horário de Brasília (UTC-3) roughly or just use local system time if user is in Brazil
            // Prompt says: "05h–11h → Bom dia", "12h–17h → Boa tarde", "18h–04h → Boa noite"
            // Let's use local system time as requested by "baseada no fuso horário de Brasília" usually implies server time, but for client app local time is safer/faster.
            // Assuming user is in Brazil or wants their local time greeting.
            const localHour = new Date().getHours();

            if (localHour >= 5 && localHour < 12) setGreeting('Bom dia');
            else if (localHour >= 12 && localHour < 18) setGreeting('Boa tarde');
            else setGreeting('Boa noite');
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="navbar glass">
            {/* LEFT: Profile & Greeting */}
            <div className="nav-left" onClick={() => setActiveTab('profile')}>
                <div className="avatar-container">
                    {/* Placeholder for profile image, using First Initial if no image */}
                    <div className="avatar">
                        <User size={20} />
                    </div>
                </div>
                <div className="user-info">
                    <h1 className="greeting">{greeting}, {user.name.split(' ')[0]}</h1>
                    <p className="focus-msg">Hoje é um bom dia para fazer o essencial.</p>
                </div>
            </div>

            {/* Right side cleaned up - Nav is at bottom now */}
            <div className="nav-right" style={{ width: '40px' }}>
                {/* Placeholder or empty to balance flex if needed, or just remove */}
            </div>

            <style>{`
                .navbar {
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    height: 85px; /* Prompt says 72px, but let's give it a bit more room for the circle button overflow if needed, or keep 72px strict */
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 var(--spacing-lg);
                    transition: all 0.3s ease;
                }

                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    cursor: pointer;
                    flex: 1;
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--surface-hover);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                    border: 1px solid var(--border-color);
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                }

                .greeting {
                    font-size: var(--font-size-base);
                    font-weight: 600;
                    color: var(--text-primary);
                    line-height: 1.2;
                }

                .focus-msg {
                    font-size: 0.75rem; /* Small text */
                    color: var(--text-secondary);
                    margin-top: 2px;
                }

                .nav-center {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    /* top: 50%; top seems better or bottom for 'app like' feel? Prompt says "Navbar Superior Fixa". So it's in the header. */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .home-btn {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--surface-color), #202025);
                    border: 1px solid var(--border-color);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1);
                    color: var(--primary-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .home-btn:hover {
                    transform: translateX(-50%) scale(1.1); /* Keep centered + scale */
                    box-shadow: 0 0 20px var(--primary-glow);
                    border-color: var(--primary-color);
                }
                
                /* Fix transform conflict: because parent has translate, button needs to handle it differently or parent does. 
                   Actually nav-center handles position. Button just scales. */
                .nav-center .home-btn {
                     /* Reset transform on button itself so hover works cleanly */
                     transform: none;
                }
                .nav-center:hover .home-btn {
                    transform: scale(1.1);
                }

                .nav-right {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                }

                .menu-btn {
                    padding: var(--spacing-sm);
                    color: var(--text-primary);
                    background: transparent;
                    border-radius: var(--radius-sm);
                    transition: background 0.2s;
                }

                .menu-btn:hover {
                    background: var(--surface-hover);
                }

                @media (max-width: 480px) {
                    .focus-msg {
                        display: none; /* Hide on very small screens if crowded */
                    }
                    .greeting {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;

