import React from 'react';
import useAppStore from '../../store/useAppStore';

const Bar = ({ label, value, color, max, delay }) => {
    const percentage = Math.min(100, Math.round((value / max) * 100));

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            height: '100%'
        }}>
            <span style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                animation: `fadeIn 0.5s ease-out ${delay}s forwards`,
                opacity: 0,
                transform: 'translateY(10px)'
            }}>
                {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>

            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--bg-color)',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end'
            }}>
                <div style={{
                    width: '100%',
                    height: `${percentage}%`,
                    backgroundColor: color,
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    transition: 'height 1s ease-out',
                    opacity: 0.9
                }} />
            </div>

            <span style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                fontWeight: '500'
            }}>
                {label}
            </span>
        </div>
    );
};

const FinanceOverview = () => {
    const { activeUser, users } = useAppStore();
    const finance = users[activeUser]?.finance || { income: 0, expenses: 0 };

    // Calculate max value for scaling (add some buffer)
    const maxValue = Math.max(finance.income, finance.expenses, finance.income - finance.expenses) * 1.2;
    const balance = finance.income - finance.expenses;

    return (
        <div className="fade-in" style={{
            backgroundColor: 'var(--surface-color)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            height: '300px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--text-primary)'
                }}>
                    Visão Financeira
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Mês Atual
                </p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flex: 1,
                gap: 'var(--spacing-md)'
            }}>
                <Bar
                    label="Receita"
                    value={finance.income}
                    color="var(--success-color)"
                    max={maxValue}
                    delay={0.1}
                />
                <Bar
                    label="Despesas"
                    value={finance.expenses}
                    color="var(--danger-color)"
                    max={maxValue}
                    delay={0.2}
                />
                <Bar
                    label="Saldo"
                    value={balance}
                    color="var(--primary-color)"
                    max={maxValue}
                    delay={0.3}
                />
            </div>
        </div>
    );
};

export default FinanceOverview;
