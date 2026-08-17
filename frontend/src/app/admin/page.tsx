'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminTransactions,
  Category,
  Product,
  Transaction,
} from '@/lib/api';
import {
  LayoutDashboard,
  Gamepad2,
  DollarSign,
  ReceiptText,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Image as ImageIcon,
  Save,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  Upload,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'games' | 'products' | 'transactions'>('games');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Category for Product Management
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [selectedCatProducts, setSelectedCatProducts] = useState<Product[]>([]);

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catThumbnail, setCatThumbnail] = useState('');
  const [catHasZone, setCatHasZone] = useState(false);

  // Product Modal State
  const [showProdModal, setShowProdModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');

  // Quick Price Edit State
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('');

  // Real Artwork Presets Recommendation
  const artworkPresets = [
    { name: 'Mobile Legends', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop' },
    { name: 'Free Fire', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop' },
    { name: 'Valorant', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop' },
    { name: 'Genshin Impact', url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop' },
    { name: 'PUBG Mobile', url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800&auto=format&fit=crop' },
    { name: 'Honkai Star Rail', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop' },
    { name: 'Roblox', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' },
    { name: 'Black Myth Wukong', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop' },
  ];

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCatId) {
        setSelectedCatId(data[0].id);
        fetchProductsForCategory(data[0].slug);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsForCategory = async (slug: string) => {
    try {
      const data = await getCategoryBySlug(slug);
      setSelectedCatProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await getAdminTransactions(txSearch, txStatusFilter);
      if (res.success && res.data?.data) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab, txSearch, txStatusFilter]);

  // Handle Category Select Change
  const handleCatSelectChange = (catId: number) => {
    setSelectedCatId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      fetchProductsForCategory(cat.slug);
    }
  };

  // Open Create Game Modal
  const openCreateCatModal = () => {
    setEditingCat(null);
    setCatName('');
    setCatSlug('');
    setCatThumbnail(artworkPresets[0].url);
    setCatHasZone(false);
    setShowCatModal(true);
  };

  // Open Edit Game Modal
  const openEditCatModal = (cat: Category) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatThumbnail(cat.thumbnail);
    setCatHasZone(cat.has_zone_id);
    setShowCatModal(true);
  };

  // Save Category (Create / Update)
  const handleSaveCategory = async () => {
    if (!catName || !catThumbnail) {
      alert('Isi Nama Game dan URL Gambar.');
      return;
    }

    try {
      if (editingCat) {
        await updateCategory(editingCat.id, {
          name: catName,
          slug: catSlug,
          thumbnail: catThumbnail,
          has_zone_id: catHasZone,
        });
      } else {
        await createCategory({
          name: catName,
          slug: catSlug || undefined,
          thumbnail: catThumbnail,
          has_zone_id: catHasZone,
          is_active: true,
        });
      }
      setShowCatModal(false);
      fetchCatalog();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan data game.');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Yakin ingin menghapus game ini dari katalog?')) return;
    try {
      await deleteCategory(id);
      fetchCatalog();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus game.');
    }
  };

  // Save Product
  const handleSaveProduct = async () => {
    if (!selectedCatId || !prodName || !prodSku || !prodPrice) {
      alert('Isi semua field produk.');
      return;
    }

    try {
      await createProduct({
        category_id: selectedCatId,
        sku_code: prodSku,
        name: prodName,
        price: parseFloat(prodPrice),
        is_active: true,
      });
      setShowProdModal(false);
      setProdName('');
      setProdSku('');
      setProdPrice('');
      const cat = categories.find((c) => c.id === selectedCatId);
      if (cat) fetchProductsForCategory(cat.slug);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan produk.');
    }
  };

  // Quick Price Edit Save
  const handleSaveQuickPrice = async (productId: number) => {
    if (!tempPrice || isNaN(Number(tempPrice))) return;

    try {
      await updateProduct(productId, { price: parseFloat(tempPrice) });
      setEditingPriceId(null);
      const cat = categories.find((c) => c.id === selectedCatId);
      if (cat) fetchProductsForCategory(cat.slug);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengupdate harga produk.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Hapus produk nominal ini?')) return;
    try {
      await deleteProduct(productId);
      const cat = categories.find((c) => c.id === selectedCatId);
      if (cat) fetchProductsForCategory(cat.slug);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus produk.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white selection:bg-lime-500 selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-lime-400">
              BERTIGAAA TOPUP DASHBOARD
            </span>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-lime-400" />
              Admin Management Panel
            </h1>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-card border border-white/10">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'games'
                  ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/25'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Katalog Game ({categories.length})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/25'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Kelola Harga & Nominal
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'transactions'
                  ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/25'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <ReceiptText className="w-4 h-4" />
              Riwayat Transaksi
            </button>
          </div>
        </div>

        {/* TAB 1: GAME CATALOG MANAGEMENT */}
        {activeTab === 'games' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Katalog Game Terdaftar</h2>
                <p className="text-xs text-gray-400">Tambah game baru atau ubah gambar poster game asli.</p>
              </div>

              <button
                onClick={openCreateCatModal}
                className="px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-lime-500/25 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Tambah Game Baru
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-400">Memuat Katalog Game...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-4 relative group hover:border-lime-500/40 transition-all"
                  >
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0 relative">
                      <img src={cat.thumbnail} alt={cat.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-lime-500/20 text-lime-400 text-[10px] font-bold uppercase inline-block mb-1">
                        {cat.has_zone_id ? 'ID + Server' : 'User ID Only'}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">{cat.name}</h3>
                      <p className="text-[11px] text-gray-400">Slug: {cat.slug}</p>
                      <p className="text-[11px] text-lime-400 font-bold mt-1">
                        {cat.products_count} Produk Nominal
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openEditCatModal(cat)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-lime-500 hover:text-black text-white transition-colors"
                        title="Edit Game"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                        title="Hapus Game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT PRICE MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Kelola Produk & Harga Nominal</h2>
                <p className="text-xs text-gray-400">Klik harga pada tabel untuk mengedit harga secara langsung.</p>
              </div>

              {/* Game Selector */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-gray-300">Pilih Game:</label>
                <select
                  value={selectedCatId || ''}
                  onChange={(e) => handleCatSelectChange(Number(e.target.value))}
                  className="glass-input px-4 py-2 rounded-xl text-xs font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0a0d14] text-white">
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowProdModal(true)}
                  className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs uppercase flex items-center gap-1 shadow-lg shadow-lime-500/25"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Nominal
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 uppercase text-gray-400 text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Kode SKU</th>
                    <th className="px-6 py-4">Nama Item / Diamond</th>
                    <th className="px-6 py-4">Harga (Rp) [Klik untuk Edit Harga]</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {selectedCatProducts.map((prod) => {
                    const isEditingThis = editingPriceId === prod.id;
                    return (
                      <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-lime-400">{prod.sku_code}</td>
                        <td className="px-6 py-4 font-bold text-white">{prod.name}</td>
                        
                        {/* Interactive Price Column */}
                        <td className="px-6 py-4">
                          {isEditingThis ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-32 glass-input px-3 py-1.5 rounded-lg text-xs font-bold text-lime-400"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveQuickPrice(prod.id)}
                                className="p-1.5 rounded-lg bg-lime-500 text-black hover:bg-lime-400"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="p-1.5 rounded-lg bg-white/10 text-gray-300 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingPriceId(prod.id);
                                setTempPrice(prod.price.toString());
                              }}
                              className="font-extrabold text-lime-400 px-3 py-1.5 rounded-lg bg-lime-500/10 border border-lime-500/30 hover:bg-lime-500 hover:text-black transition-all flex items-center gap-2 group"
                            >
                              <span>Rp {prod.price.toLocaleString('id-ID')}</span>
                              <Edit2 className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                            </button>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTION MONITORING */}
        {activeTab === 'transactions' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Riwayat Transaksi Pelanggan</h2>
                <p className="text-xs text-gray-400">Pantau seluruh pesanan dan status callback pembayaran.</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Cari Invoice / User ID..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="glass-input px-4 py-2 rounded-xl text-xs"
                />

                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="glass-input px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <option value="" className="bg-[#0a0d14]">Semua Status</option>
                  <option value="pending" className="bg-[#0a0d14]">Pending</option>
                  <option value="paid" className="bg-[#0a0d14]">Paid (Lunas)</option>
                  <option value="failed" className="bg-[#0a0d14]">Failed</option>
                </select>
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 uppercase text-gray-400 text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">No. Invoice</th>
                    <th className="px-6 py-4">Game & Produk</th>
                    <th className="px-6 py-4">User ID & Server</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status Bayar</th>
                    <th className="px-6 py-4">Pengiriman</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-mono font-bold text-white">{tx.invoice_number}</td>
                      <td className="px-6 py-4 font-bold">
                        {tx.product?.category?.name} - {tx.product?.name}
                      </td>
                      <td className="px-6 py-4">
                        {tx.user_game_id} {tx.zone_game_id ? `(${tx.zone_game_id})` : ''} ({tx.game_nickname})
                      </td>
                      <td className="px-6 py-4 font-extrabold text-lime-400">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          tx.payment_status === 'paid' ? 'bg-lime-500/20 text-lime-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {tx.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          tx.fulfillment_status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tx.fulfillment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-white mb-4">
              {editingCat ? 'Edit Game Katalog' : 'Tambah Game Baru'}
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nama Game *</label>
                <input
                  type="text"
                  placeholder="Contoh: Honkai: Star Rail"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Gambar Poster Game *</label>
                
                {/* Upload File Local Option */}
                <div className="mb-3 p-3 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-lime-400">📁 Upload dari Komputer / HP:</p>
                    <p className="text-[10px] text-gray-400">Pilih file gambar (.jpg, .png, .webp) langsung dari device Anda.</p>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    Pilih File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setCatThumbnail(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Atau tempel Link Gambar (https://...)"
                    value={catThumbnail}
                    onChange={(e) => setCatThumbnail(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                {/* Preview Box */}
                {catThumbnail && (
                  <div className="mb-3 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
                    <img src={catThumbnail} alt="Preview" className="w-12 h-14 object-cover rounded-lg" />
                    <div className="text-[11px] min-w-0 flex-1">
                      <span className="text-lime-400 font-bold block">Preview Gambar Siap</span>
                      <span className="text-gray-400 truncate block text-[10px]">{catThumbnail.slice(0, 40)}...</span>
                    </div>
                  </div>
                )}

                {/* Tip for Pinterest / Google Images */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mb-3 text-[11px] text-gray-300">
                  <p className="font-bold text-lime-400 mb-0.5">💡 Tips Mengambil Link Gambar Pinterest / Google:</p>
                  <p className="text-gray-400 text-[10px] leading-relaxed">
                    Jangan salin link halaman Web Pinterest. Caranya: **Klik Kanan pada Gambar** → Pilih **"Salin Alamat Gambar"** (*Copy Image Address*). Link yang benar biasanya berakhiran <code className="text-lime-400">.jpg</code> atau <code className="text-lime-400">.png</code>.
                  </p>
                </div>

                {/* Artwork Presets Selection */}
                <p className="text-[11px] text-gray-400 mb-2 font-bold">Atau Pilih dari Gambar Game Asli (Preset):</p>
                <div className="grid grid-cols-4 gap-2">
                  {artworkPresets.map((art, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCatThumbnail(art.url)}
                      className={`group relative rounded-lg overflow-hidden border aspect-video transition-all ${
                        catThumbnail === art.url ? 'border-2 border-lime-400 scale-105' : 'border-white/10 hover:border-lime-400'
                      }`}
                    >
                      <img src={art.url} alt={art.name} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] font-bold text-lime-400 text-center p-1">
                        {art.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hasZone"
                  checked={catHasZone}
                  onChange={(e) => setCatHasZone(e.target.checked)}
                  className="w-4 h-4 accent-lime-500 rounded"
                />
                <label htmlFor="hasZone" className="text-gray-300 font-semibold cursor-pointer">
                  Memerlukan Zone / Server ID (Contoh: MLBB / Genshin)
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowCatModal(false)}
                className="flex-1 py-2.5 rounded-xl glass-card hover:bg-white/10 text-white font-bold text-xs uppercase"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex-1 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs uppercase"
              >
                Simpan Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {showProdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 border border-white/20 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-white mb-4">Tambah Nominal Produk Baru</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Kode SKU *</label>
                <input
                  type="text"
                  placeholder="Contoh: ML-500"
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nama Item / Diamond *</label>
                <input
                  type="text"
                  placeholder="Contoh: 500 Diamonds"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Harga (Rp) *</label>
                <input
                  type="number"
                  placeholder="Contoh: 120000"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowProdModal(false)}
                className="flex-1 py-2.5 rounded-xl glass-card hover:bg-white/10 text-white font-bold text-xs uppercase"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProduct}
                className="flex-1 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs uppercase"
              >
                Simpan Produk
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
