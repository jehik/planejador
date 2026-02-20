import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const FinanceView = () => {
    const { userData, addTransaction, removeTransaction, setSavingsGoal } = useAppStore();
    const finance = userData?.finance || { income: 0, expenses: 0, savingsGoal: 10000, transactions: [] };

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense'); // 'expense' | 'income'

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Regex to allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
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
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    padding: '10px', borderRadius: '12px',
                    color: '#10B981'
                }}>
                    <DollarSign size={28} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Financeiro</h2>
            </div>

            {/* Savings Goal Card */}
            <div className="card" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PiggyBank size={24} color="var(--primary-color)" />
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Reserva Total</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Meta:</span>
                        <input
                            type="tel" // Changed to tel to trigger numeric keypad on mobile
                            value={finance.savingsGoal}
                            onChange={(e) => setSavingsGoal(Number(e.target.value.replace(/\D/g, '')))}
                            style={{
                                width: '100px', padding: '4px 8px', borderRadius: '8px',
                                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)',
                                color: 'var(--text-primary)', fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>

                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
                    {formatCurrency(savingsProgress)}
                </div>

                <div style={{ height: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progressPercentage}%`, height: '100%',
                        backgroundColor: 'var(--success-color)', transition: 'width 0.5s ease'
                    }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    {Math.round(progressPercentage)}% da meta
                </div>
            </div>

            {/* Add Transaction Form */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Nova Movimentação</h3>
                <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`btn ${type === 'expense' ? 'active' : ''}`}
                            style={{
                                flex: 1,
                                border: type === 'expense' ? '1px solid var(--error-color)' : '1px solid var(--border-color)',
                                backgroundColor: type === 'expense' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                color: type === 'expense' ? 'var(--error-color)' : 'var(--text-secondary)'
                            }}
                        >
                            Saída
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`btn ${type === 'income' ? 'active' : ''}`}
                            style={{
                                flex: 1,
                                border: type === 'income' ? '1px solid var(--success-color)' : '1px solid var(--border-color)',
                                backgroundColor: type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                color: type === 'income' ? 'var(--success-color)' : 'var(--text-secondary)'
                            }}
                        >
                            Entrada
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição (ex: Mercado)"
                            style={{
                                flex: 2, padding: '12px', borderRadius: '12px',
                                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
                            }}
                        />
                        <input
                            type="tel" // Use tel for numeric keypad
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="R$ 0.00"
                            style={{
                                flex: 1, padding: '12px', borderRadius: '12px',
                                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <Plus size={20} style={{ marginRight: '8px' }} /> Adicionar
                    </button>
                </form>
            </div>

            {/* List */}
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Histórico</h3>
                {finance.transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                        <p>Nenhuma movimentação registrada.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[...finance.transactions].reverse().map(t => (
                            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        padding: '10px', borderRadius: '50%',
                                        backgroundColor: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: t.type === 'income' ? 'var(--success-color)' : 'var(--error-color)'
                                    }}>
                                        {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{t.description}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {new Date(t.date).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontWeight: 'bold', color: t.type === 'income' ? 'var(--success-color)' : 'var(--error-color)' }}>
                                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                    </span>
                                    <button onClick={() => removeTransaction(t.id)} style={{ color: 'var(--text-secondary)', opacity: 0.5, border: 'none', background: 'none', cursor: 'pointer' }}>
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
