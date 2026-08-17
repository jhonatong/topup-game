'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderByInvoice, simulatePayment, Transaction, PaymentDetails } from '@/lib/api';
import { CheckCircle2, Clock, QrCode, Copy, RefreshCw, AlertTriangle, ShieldCheck, Zap, ArrowLeft, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function InvoicePage() {
  const params = useParams();
  const invoiceNumber = params?.invoiceNumber as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchInvoice = async () => {
    if (!invoiceNumber) return;
    try {
      const res = await getOrderByInvoice(invoiceNumber);
      if (res.success) {
        setTransaction(res.data.transaction);
        setPaymentDetails(res.data.payment_details);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invoice tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [invoiceNumber]);

  // Handle Instant Payment Simulator Click
  const handleSimulatePayment = async () => {
    if (!invoiceNumber) return;
    setSimulating(true);
    try {
      const res = await simulatePayment(invoiceNumber);
      if (res.success) {
        // Refresh invoice data
        await fetchInvoice();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mensimulasikan pembayaran.');
    } finally {
      setSimulating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-semibold text-sm">Memuat Invoice Transaksi...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invoice Tidak Ditemukan</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link href="/" className="px-6 py-2.5 rounded-xl bg-lime-500 text-black font-bold text-xs uppercase">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = transaction.payment_status === 'paid';

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white selection:bg-lime-500 selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-lime-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog Game
        </Link>

        {/* Invoice Card Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-lime-400">
                FAKTUR PEMBAYARAN
              </span>
              <h1 className="text-2xl font-black text-white">{transaction.invoice_number}</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Payment Status Badge */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase flex items-center gap-1.5 ${
                isPaid 
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
              }`}>
                {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />}
                STATUS: {transaction.payment_status}
              </span>

              {/* Fulfillment Status Badge */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase flex items-center gap-1.5 ${
                transaction.fulfillment_status === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              }`}>
                PENGIRIMAN: {transaction.fulfillment_status}
              </span>
            </div>
          </div>

          {/* SIMULATION TESTING BANNER (Highlight for Testing) */}
          <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-lime-500/20 via-emerald-500/10 to-transparent border border-lime-500/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-lime-400 flex-shrink-0 animate-bounce" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Mode Testing Simulator Pembayaran
                </h4>
                <p className="text-[11px] text-gray-300">
                  Klik tombol di samping untuk memicu callback webhook bayar lunas secara otomatis tanpa perlu scan asli.
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={simulating || isPaid}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                isPaid
                  ? 'bg-lime-500/20 text-lime-400 cursor-not-allowed'
                  : 'bg-lime-500 hover:bg-lime-400 text-black shadow-lime-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
              {isPaid ? 'Pembayaran Lunas & Terkirim' : 'Simulasikan Bayar Lunas Sekarang'}
            </button>
          </div>

          {/* QRIS / Payment Payload Display */}
          {!isPaid && paymentDetails && (
            <div className="my-8 p-6 rounded-2xl glass-card border border-white/10 text-center max-w-md mx-auto">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">
                Scan QRIS / Detail Transfer
              </h3>
              <p className="text-xs text-gray-400 mb-6">{paymentDetails.instructions}</p>

              {paymentDetails.qr_code_url ? (
                <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-4">
                  <img src={paymentDetails.qr_code_url} alt="QRIS Code" className="w-48 h-48 mx-auto" />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4 flex items-center justify-between">
                  <span className="font-mono font-bold text-lg text-lime-400">
                    {paymentDetails.virtual_account}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.virtual_account || '')}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}

              {copied && <p className="text-xs text-lime-400 font-bold mb-2">Tersalin ke clipboard!</p>}

              <p className="text-[11px] text-gray-500">
                Batas Waktu Pembayaran: <span className="text-white font-bold">{new Date(paymentDetails.expired_at).toLocaleTimeString('id-ID')}</span>
              </p>
            </div>
          )}

          {/* Transaction Details Table */}
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Rincian Pesanan
            </h3>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-white/5">
              <span className="text-gray-400">Game:</span>
              <span className="font-bold text-white text-right">{transaction.product?.category?.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-white/5">
              <span className="text-gray-400">Item Produk:</span>
              <span className="font-bold text-white text-right">{transaction.product?.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-white/5">
              <span className="text-gray-400">User ID & Server:</span>
              <span className="font-bold text-white text-right">
                {transaction.user_game_id} {transaction.zone_game_id ? `(${transaction.zone_game_id})` : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-white/5">
              <span className="text-gray-400">Nickname:</span>
              <span className="font-bold text-lime-400 text-right">{transaction.game_nickname}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-white/5">
              <span className="text-gray-400">Metode Pembayaran:</span>
              <span className="font-bold text-white text-right uppercase">{transaction.payment_method}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 text-sm">
              <span className="text-gray-300 font-bold">Total Pembayaran:</span>
              <span className="font-black text-lime-400 text-right text-lg">
                Rp {transaction.amount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
