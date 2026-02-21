import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, X } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const FinanceView = () => {
    const { userData, addTransaction, removeTransaction, setSavingsGoal } = useAppStore();
    const finance = userData?.finance || { income: 0, expenses: 0, savingsGoal: 10000, transactions: [] };

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense'); // 'expense' | 'income'
    const [isAdding, setIsAdding] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleAddTransaction = (e) => {
        if (e) e.preventDefault();
        if (!amount || !description) return;

        addTransaction({
            amount: parseFloat(amount),
            description,
            type,
            date: new Date().toISOString()
        });

        setAmount('');
        setDescription('');
        setIsAdding(false);
    };

    const calculateBalance = () => {
        return finance.transactions.reduce((acc, curr) => {
            return curr.type === 'income'
                ? acc + curr.amount
                : acc - curr.amount;
        }, 0);
    };

    const savingsProgress = calculateBalance();
    const progressPercentage = Math.min(100, Math.max(0, (savingsProgress / finance.savingsGoal) * 100));

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Finanças</h2>
                    <p className="text-sm text-secondary">Gerencie sua liberdade</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        width: '44px', height: '44px',
                        borderRadius: '14px',
                        backgroundColor: isAdding ? 'var(--text-primary)' : 'rgba(16, 185, 129, 0.08)',
                        color: isAdding ? 'white' : '#10B981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                    }}>
                    {isAdding ? <X size={20} /> : <Plus size={24} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Apple Card Style Savings Goal */}
            <div className="card" style={{
                marginBottom: '32px',
                padding: '32px 24px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.25)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '700', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                            Reserva Total
                        </p>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1' }}>
                            {formatCurrency(savingsProgress)}
                        </h3>
                    </div>
                    <PiggyBank size={32} style={{ opacity: 0.5 }} />
                </div>

                <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                        <span style={{ opacity: 0.8 }}>Meta: {formatCurrency(finance.savingsGoal)}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${progressPercentage}%`, height: '100%',
                            backgroundColor: 'white', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                    </div>
                </div>
            </div>

            {/* Quick Add Form */}
            {isAdding && (
                <div className="card fade-in" style={{ marginBottom: '32px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <form onSubmit={handleAddTransaction}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                                    backgroundColor: type === 'expense' ? 'var(--danger-color)' : 'rgba(0,0,0,0.03)',
                                    color: type === 'expense' ? 'white' : 'var(--text-secondary)',
                                    fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                Saída
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('income')}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                                    backgroundColor: type === 'income' ? 'var(--success-color)' : 'rgba(0,0,0,0.03)',
                                    color: type === 'income' ? 'white' : 'var(--text-secondary)',
                                    fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                Entrada
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ flex: 2 }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Descrição</label>
                                <input
                                    placeholder="Ex: Mercado"
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                    autoFocus
                                    style={{
                                        width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)',
                                        border: '1px solid var(--border-color)', borderRadius: '12px',
                                        fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Valor</label>
                                <input
                                    type="tel"
                                    placeholder="0,00"
                                    value={amount} onChange={handleAmountChange}
                                    style={{
                                        width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)',
                                        border: '1px solid var(--border-color)', borderRadius: '12px',
                                        fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: type === 'income' ? 'var(--success-color)' : 'var(--danger-color)', boxShadow: `0 4px 12px ${type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}
                        >
                            Registrar {type === 'income' ? 'Entrada' : 'Saída'}
                        </button>
                    </form>
                </div>
            )}

            {/* History Section */}
            <div>
                <h3 className="text-lg" style={{ marginBottom: '16px' }}>Histórico</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {finance.transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 24px', opacity: 0.5, border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
                            <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Nenhuma transação registrada.</p>
                        </div>
                    ) : (
                        [...finance.transactions].reverse().map(t => (
                            <div key={t.id} className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '14px',
                                    backgroundColor: t.type === 'income' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: t.type === 'income' ? 'var(--success-color)' : 'var(--danger-color)', flexShrink: 0
                                }}>
                                    {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                </div>

                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                        {t.description}
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <p style={{
                                        fontSize: '1rem', fontWeight: '800',
                                        color: t.type === 'income' ? 'var(--success-color)' : 'var(--text-primary)'
                                    }}>
                                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                    </p>
                                    <button
                                        onClick={() => removeTransaction(t.id)}
                                        style={{ padding: '4px', color: 'var(--danger-color)', opacity: 0.2, border: 'none', background: 'none', cursor: 'pointer', marginTop: '4px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Goal Settings Trigger - Subtle */}
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
                <div className="glass" style={{ padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ajustar Meta</span>
                    <input
                        type="tel"
                        value={finance.savingsGoal}
                        onChange={(e) => setSavingsGoal(Number(e.target.value.replace(/\D/g, '')))}
                        style={{
                            width: '80px', padding: '4px 8px', borderRadius: '6px',
                            border: '1px solid var(--border-color)', backgroundColor: 'transparent',
                            color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '800', outline: 'none'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FinanceView;
