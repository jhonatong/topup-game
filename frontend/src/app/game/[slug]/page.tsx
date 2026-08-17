'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategoryBySlug, checkGameUserId, createOrder, Category, Product } from '@/lib/api';
import { ShieldCheck, UserCheck, CheckCircle2, Zap, AlertCircle, ArrowRight, Gamepad2, QrCode, CreditCard, Wallet } from 'lucide-react';

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [nickname, setNickname] = useState('');
  const [checkingId, setCheckingId] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [idError, setIdError] = useState('');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');

  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function loadCategory() {
      try {
        const data = await getCategoryBySlug(slug);
        setCategory(data);
        if (data.products && data.products.length > 0) {
          setSelectedProduct(data.products[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat detail game.');
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [slug]);

  // Handle Nickname Verification
  const handleCheckNickname = async () => {
    if (!category || !userId) {
      setIdError('User ID harus diisi terlebih dahulu.');
      return;
    }

    setCheckingId(true);
    setIdError('');
    try {
      const res = await checkGameUserId(category.id, userId, zoneId);
      if (res.success) {
        setNickname(res.data.nickname);
        setIdVerified(true);
      }
    } catch (err: any) {
      setIdError(err.response?.data?.message || 'User ID tidak ditemukan.');
      setIdVerified(false);
    } finally {
      setCheckingId(false);
    }
  };

  // Submit Order
  const handleConfirmOrder = async () => {
    if (!selectedProduct || !userId) {
      alert('Lengkapi seluruh data pesanan.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createOrder({
        product_id: selectedProduct.id,
        user_game_id: userId,
        zone_game_id: zoneId || undefined,
        game_nickname: nickname || `Player_${userId}`,
        payment_method: paymentMethod,
      });

      if (res.success && res.data?.transaction?.invoice_number) {
        router.push(`/invoice/${res.data.transaction.invoice_number}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat pesanan transaksi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-semibold text-sm">Memuat Katalog Top-Up Game...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Game Tidak Ditemukan</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <a href="/" className="px-6 py-2.5 rounded-xl bg-lime-500 text-black font-bold text-xs uppercase">
            Kembali ke Katalog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white selection:bg-lime-500 selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <a href="/" className="hover:text-lime-400">Home</a>
          <span>/</span>
          <a href="/#katalog" className="hover:text-lime-400">Katalog Game</a>
          <span>/</span>
          <span className="text-white font-bold">{category.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Game Poster & Description */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 sticky top-28 border border-white/10">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img 
                  src={category.thumbnail} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-2.5 py-1 rounded bg-lime-500 text-black text-[10px] font-extrabold uppercase mb-1 inline-block">
                    Official Top-Up
                  </span>
                  <h1 className="text-2xl font-black text-white">{category.name}</h1>
                </div>
              </div>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Zap className="w-5 h-5 text-lime-400 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-white">Proses Instan 24 Jam</h5>
                    <p className="text-[11px] text-gray-400">Item masuk dalam 1-3 detik setelah lunas.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-lime-400 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-white">100% Legal & Safe</h5>
                    <p className="text-[11px] text-gray-400">Jaminan garansi produk resmi Moonton/Riot.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Form Steps */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 1: User ID Form */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-lime-500 text-black font-black text-sm flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                    Langkah 1: Masukkan Data Akun Game
                  </h3>
                  <p className="text-xs text-gray-400">Masukkan User ID & Server untuk verifikasi nickname.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">User ID Game *</label>
                  <input
                    type="text"
                    placeholder="Contoh: 12345678"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                {category.has_zone_id && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Zone / Server ID *</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1234"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Check Nickname Action */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={checkingId || !userId}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-lime-500 hover:text-black text-lime-400 font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  {checkingId ? 'Mengecek ID...' : 'Cek Nickname Akun'}
                </button>

                {idVerified && nickname && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-lime-500/20 border border-lime-500/40 text-lime-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Nickname: {nickname}
                  </div>
                )}

                {idError && (
                  <div className="text-red-400 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {idError}
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: Product Nominal Selection */}
            <div className="glass-card rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-lime-500 text-black font-black text-sm flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                    Langkah 2: Pilih Nominal Top-Up
                  </h3>
                  <p className="text-xs text-gray-400">Pilih item / paket diamond yang ingin Anda beli.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {category.products?.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-4 rounded-2xl text-left transition-all relative glass-card ${
                        isSelected
                          ? 'border-2 border-lime-400 bg-lime-500/10 shadow-lg shadow-lime-500/20 scale-[1.02]'
                          : 'hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-lime-400 absolute top-3 right-3" />
                      )}
                      <h4 className="text-sm font-bold text-white mb-1">{prod.name}</h4>
                      <p className="text-xs font-extrabold text-lime-400">
                        Rp {prod.price.toLocaleString('id-ID')}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Payment Method Selection */}
            <div className="glass-card rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-lime-500 text-black font-black text-sm flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                    Langkah 3: Pilih Metode Pembayaran
                  </h3>
                  <p className="text-xs text-gray-400">Dukungan otomatisasi pembayaran instan tanpa ribet.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* QRIS */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-4 rounded-2xl text-left transition-all glass-card ${
                    paymentMethod === 'qris'
                      ? 'border-2 border-lime-400 bg-lime-500/10 shadow-lg shadow-lime-500/20'
                      : 'hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="w-5 h-5 text-lime-400" />
                    <span className="text-xs font-bold text-white">QRIS (Semua E-Wallet)</span>
                  </div>
                  <p className="text-[11px] text-gray-400">GoPay, OVO, Dana, ShopeePay, LinkAja</p>
                </button>

                {/* BCA Virtual Account */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bca_va')}
                  className={`p-4 rounded-2xl text-left transition-all glass-card ${
                    paymentMethod === 'bca_va'
                      ? 'border-2 border-lime-400 bg-lime-500/10 shadow-lg shadow-lime-500/20'
                      : 'hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-lime-400" />
                    <span className="text-xs font-bold text-white">BCA Virtual Account</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Verifikasi Otomatis 24 Jam</p>
                </button>

                {/* Mandiri Virtual Account */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mandiri_va')}
                  className={`p-4 rounded-2xl text-left transition-all glass-card ${
                    paymentMethod === 'mandiri_va'
                      ? 'border-2 border-lime-400 bg-lime-500/10 shadow-lg shadow-lime-500/20'
                      : 'hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-lime-400" />
                    <span className="text-xs font-bold text-white">Mandiri Virtual Account</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Verifikasi Otomatis 24 Jam</p>
                </button>
              </div>
            </div>

            {/* Sticky Submit Bar / Trigger Modal */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400">Total Pembayaran:</p>
                <h3 className="text-2xl font-black text-lime-400">
                  Rp {selectedProduct ? selectedProduct.price.toLocaleString('id-ID') : '0'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                disabled={!userId || !selectedProduct}
                className="px-8 py-4 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-lime-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                BELI SEKARANG
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 border border-white/20 shadow-2xl relative animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-white mb-4">Konfirmasi Detail Pesanan</h3>

            <div className="space-y-3 text-xs border-y border-white/10 py-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Game:</span>
                <span className="font-bold text-white">{category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User ID / Server:</span>
                <span className="font-bold text-white">{userId} {zoneId ? `(${zoneId})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nickname:</span>
                <span className="font-bold text-lime-400">{nickname || 'ProGamer_Simulasi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Produk:</span>
                <span className="font-bold text-white">{selectedProduct?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Metode Pembayaran:</span>
                <span className="font-bold text-white uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                <span className="text-gray-300 font-bold">Total Harga:</span>
                <span className="font-black text-lime-400">Rp {selectedProduct?.price.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl glass-card hover:bg-white/10 text-white font-bold text-xs uppercase"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs uppercase transition-all disabled:opacity-50"
              >
                {submitting ? 'Memproses...' : 'Lanjutkan Bayar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
