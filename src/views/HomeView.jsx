import React from 'react';
import DailyFocusCard from '../components/home/DailyFocusCard';
import DailyProgress from '../components/home/DailyProgress';
import TodayOverview from '../components/home/TodayOverview';
import DreamBoard from '../components/dream/DreamBoard';
import SupportMessages from '../components/dream/SupportMessages';
import useAppStore from '../store/useAppStore';

import RomanticStory from '../components/romantic/RomanticStory';
// import MentorCard from '../components/mentor/MentorCard'; // Archived

const HomeView = () => {
    const { focusMode, userData, setRomanticStoryViewed } = useAppStore();
    const currentUser = userData;
    const [showStory, setShowStory] = React.useState(false);

    const isDebora = currentUser?.name === 'Débora';
    const hasViewedStory = currentUser?.romanticStoryViewed;

    const handleOpenStory = () => {
        setShowStory(true);
    };

    const handleCloseStory = () => {
        setShowStory(false);
        setRomanticStoryViewed(); // Mark as viewed permanently
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            {showStory && <RomanticStory onClose={handleCloseStory} />}

            {/* Greeting & Support - Hide in Focus Mode */}
            <div style={{
                marginBottom: '20px',
                opacity: focusMode ? 0 : 1,
                height: focusMode ? 0 : 'auto',
                overflow: 'hidden',
                transition: 'all 0.5s ease'
            }}>
                <SupportMessages />

                {/* Romantic Card for Debora */}
                {isDebora && !hasViewedStory && (
                    <div className="fade-in" style={{
                        marginTop: '20px',
                        padding: '24px',
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                        borderRadius: '20px',
                        color: 'white',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px rgba(49, 46, 129, 0.4)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', fontWeight: '300' }}>
                            O Cássio preparou algo para você ❤️
                        </h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '20px' }}>
                            Talvez você devesse ver agora.
                        </p>
                        <button
                            onClick={handleOpenStory}
                            style={{
                                backgroundColor: 'white',
                                color: '#312e81',
                                padding: '12px 32px',
                                borderRadius: '30px',
                                fontWeight: '600',
                                border: 'none',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            Ver agora
                        </button>
                    </div>
                )}
            </div>


            {/* Daily Focus Section - ALWAYS VISIBLE */}
            <section>
                <DailyFocusCard />
            </section>

            {/* Distracting Sections - Hide in Focus Mode */}
            <div style={{
                opacity: focusMode ? 0 : 1,
                pointerEvents: focusMode ? 'none' : 'auto',
                transform: focusMode ? 'translateY(20px)' : 'translateY(0)',
                height: focusMode ? 0 : 'auto',
                overflow: 'hidden',
                transition: 'all 0.5s ease'
            }}>
                {/* Daily Progress Section */}
                <section style={{ marginTop: '32px' }}>
                    <DailyProgress />
                </section>

                {/* Today Overview Section */}
                <section style={{ marginTop: '32px' }}>
                    <TodayOverview />
                </section>

                {/* Dream Board Section */}
                <section style={{ marginTop: '32px' }}>
                    <DreamBoard />
                </section>

                {/* Mentor AI Archived
                <section style={{ marginTop: '32px' }}>
                    <MentorCard />
                </section>
                */}
            </div>

            {focusMode && (
                <div className="fade-in" style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    color: 'var(--text-secondary)'
                }}>
                    <p>Tudo o resto está oculto. Foque na sua tarefa.</p>
                </div>
            )}
        </div>
    );
};

export default HomeView;
