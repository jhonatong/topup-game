'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderByInvoice, Transaction } from '@/lib/api';
import { Search, ReceiptText, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckOrderPage() {
  const [invoiceQuery, setInvoiceQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceQuery.trim()) return;

    setLoading(true);
    setError('');
    setTransaction(null);

    try {
      const res = await getOrderByInvoice(invoiceQuery.trim());
      if (res.success) {
        setTransaction(res.data.transaction);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nomor invoice tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white selection:bg-lime-500 selection:text-black">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-lime-500/20 border border-lime-500/40 text-lime-400 flex items-center justify-center mx-auto mb-4">
            <ReceiptText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">
            Lacak Pesanan Transaksi
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Masukkan Nomor Invoice Anda untuk mengecek status pembayaran & pengiriman item game.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Masukkan Nomor Invoice (Contoh: INV-20260817-XXXXXX)"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                className="w-full glass-input px-4 py-3.5 pl-11 rounded-2xl text-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading || !invoiceQuery.trim()}
              className="px-8 py-3.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-lime-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Mencari...' : 'Cari Invoice'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Search Result Card */}
        {transaction && (
          <div className="glass-card rounded-3xl p-6 border border-lime-500/30 bg-lime-500/5 shadow-2xl animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Faktur Ditemukan</span>
                <h3 className="text-lg font-black text-white">{transaction.invoice_number}</h3>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase flex items-center gap-1 ${
                transaction.payment_status === 'paid'
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
              }`}>
                {transaction.payment_status === 'paid' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {transaction.payment_status}
              </span>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Game:</span>
                <span className="font-bold text-white">{transaction.product?.category?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Item Produk:</span>
                <span className="font-bold text-white">{transaction.product?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User ID / Server:</span>
                <span className="font-bold text-white">{transaction.user_game_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Harga:</span>
                <span className="font-black text-lime-400 text-sm">Rp {transaction.amount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Link
                href={`/invoice/${transaction.invoice_number}`}
                className="px-5 py-2.5 rounded-xl bg-lime-500 text-black font-bold text-xs uppercase flex items-center gap-2 hover:bg-lime-400 transition-all"
              >
                Buka Halaman Invoice
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
