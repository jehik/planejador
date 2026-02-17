import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, ArrowRight } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const FinanceView = () => {
    const { activeUser, users, setSavingsGoal, addTransaction, removeTransaction } = useAppStore();
    const finance = users[activeUser]?.finance || { income: 0, expenses: 0, savingsGoal: 0, transactions: [] };

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense'); // 'expense' | 'income'

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleAddTransaction = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        addTransaction({
            amount: parseFloat(amount),
            description,
            type,
            date: new Date().toISOString()
        });

        setAmount('');
        setDescription('');
    };

    const savingsProgress = finance.income - finance.expenses;
    const progressPercentage = Math.min(100, Math.max(0, (savingsProgress / finance.savingsGoal) * 100));

    return (
        <div className="fade-in" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Controle Financeiro</h2>

            {/* Savings Goal Card */}
            <div style={{
                backgroundColor: 'var(--surface-color)',
                padding: '24px',
                borderRadius: '24px',
                marginBottom: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PiggyBank size={24} color="var(--primary-color)" />
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Reserva Acumulada</span>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Meta: {formatCurrency(finance.savingsGoal)}</span>
                </div>

                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
                    {formatCurrency(savingsProgress)}
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progressPercentage}%`,
                        height: '100%',
                        backgroundColor: savingsProgress >= 0 ? 'var(--success-color)' : 'var(--error-color)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    {Math.round(progressPercentage)}% da meta
                </div>
            </div>

            {/* Add Transaction Form */}
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Adicionar Movimentação</h3>

                <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: type === 'expense' ? '2px solid var(--error-color)' : '1px solid var(--border-color)',
                                backgroundColor: type === 'expense' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-color)',
                                color: type === 'expense' ? 'var(--error-color)' : 'var(--text-secondary)',
                                fontWeight: '600'
                            }}
                        >
                            Saída
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: type === 'income' ? '2px solid var(--success-color)' : '1px solid var(--border-color)',
                                backgroundColor: type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-color)',
                                color: type === 'income' ? 'var(--success-color)' : 'var(--text-secondary)',
                                fontWeight: '600'
                            }}
                        >
                            Entrada
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição (ex: Mercado)"
                            style={{
                                flex: 2,
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-color)',
                                color: 'var(--text-primary)'
                            }}
                        />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="R$ 0,00"
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-color)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Plus size={20} /> Adicionar
                    </button>
                </form>
            </div>

            {/* Recent Transactions List */}
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Histórico Recente</h3>
                {finance.transactions.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '20px' }}>
                        Nenhuma movimentação registrada.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[...finance.transactions].reverse().map(t => (
                            <div key={t.id} style={{
                                backgroundColor: 'var(--surface-color)',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        padding: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: t.type === 'income' ? 'var(--success-color)' : 'var(--error-color)'
                                    }}>
                                        {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.description}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {new Date(t.date).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: t.type === 'income' ? 'var(--success-color)' : 'var(--error-color)'
                                    }}>
                                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                    </span>
                                    <button
                                        onClick={() => removeTransaction(t.id)}
                                        style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceView;
