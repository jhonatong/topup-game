'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategories, Category } from '@/lib/api';
import { ChevronLeft, ChevronRight, Play, ArrowUpRight, Flame, Sparkles, Star } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      badge: 'ELDEN RING',
      title: 'SHADOW OF THE ERDTREE',
      desc: 'The adventure continues in the Lands Between. Explore new realms, face deadly foes, and uncover the mysteries of the Erdtree.',
      bgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
      slug: 'elden-ring',
    },
    {
      badge: 'MOBILE LEGENDS',
      title: 'MLBB STarlight & DIAMOND PROMO',
      desc: 'Top up Diamond Mobile Legends tercepat dengan bonus item eksklusif. Klaim skin starlight bulan ini sekarang juga!',
      bgUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      slug: 'mobile-legends',
    },
    {
      badge: 'VALORANT',
      title: 'EPISODE 9 ACT III BUNDLE',
      desc: 'Upgrade koleksi Valorant Points Anda untuk membeli skin weapon premium dan Battlepass dengan diskon harga promo.',
      bgUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1600&auto=format&fit=crop',
      slug: 'valorant',
    },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white selection:bg-lime-500 selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* HERO BANNER CAROUSEL (Persis seperti gambar rujukan) */}
        <section className="relative rounded-3xl overflow-hidden glass-card border border-white/10 min-h-[480px] flex items-end p-8 md:p-12 mb-12 shadow-2xl group">
          
          {/* Background Image with Dark Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-90 group-hover:scale-105"
            style={{ backgroundImage: `url(${heroSlides[activeSlide].bgUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0a0d14]/50 to-transparent" />

          {/* Hero Left & Right Navigation Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-card hover:bg-lime-500 hover:text-black text-white transition-all z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-card hover:bg-lime-500 hover:text-black text-white transition-all z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-md bg-lime-500/20 border border-lime-500/40 text-lime-400 text-xs font-bold tracking-widest uppercase mb-3">
              {heroSlides[activeSlide].badge}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight drop-shadow-md">
              {heroSlides[activeSlide].title}
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
              {heroSlides[activeSlide].desc}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={`/game/${heroSlides[activeSlide].slug}`}
                className="px-6 py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-lime-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                TOP UP SEKARANG
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button className="px-6 py-3.5 rounded-xl glass-card hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" />
                WATCH TRAILER
              </button>
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeSlide ? 'w-8 bg-lime-400' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </section>

        {/* LATEST NEWS & EVENT SECTION (Gaya Slanted Bar `/`) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lime-400 font-extrabold text-2xl">/</span>
              <h2 className="text-xl font-extrabold tracking-wider uppercase text-white">
                LATEST NEWS & EVENT
              </h2>
            </div>
            <a href="#" className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1">
              VIEW ALL NEWS &gt;
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Promo Card 1 */}
            <div className="glass-card glass-card-hover rounded-2xl overflow-hidden p-5 flex flex-col justify-between group">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-lime-500/20 text-lime-400 text-[10px] font-bold uppercase mb-3">
                  NEWS
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                  Promo Starlight MLBB Agustus 2026 Cashback 20%
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  Dapatkan bonus diamond instan dan cashback QRIS untuk setiap transaksi top-up MLBB hari ini.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <span>2 HOURS AGO</span>
                <span className="text-lime-400 font-bold">BACA SELENGKAPNYA</span>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="glass-card glass-card-hover rounded-2xl overflow-hidden p-5 flex flex-col justify-between group">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-lime-500/20 text-lime-400 text-[10px] font-bold uppercase mb-3">
                  EVENT
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                  Turnamen Valorant Community Cup Season 4
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  Daftarkan tim Anda dalam turnamen komunitas berhadiah total 50.000 Valorant Points!
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <span>5 HOURS AGO</span>
                <span className="text-lime-400 font-bold">BACA SELENGKAPNYA</span>
              </div>
            </div>

            {/* Promo Card 3 */}
            <div className="glass-card glass-card-hover rounded-2xl overflow-hidden p-5 flex flex-col justify-between group">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-lime-500/20 text-lime-400 text-[10px] font-bold uppercase mb-3">
                  UPDATE
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                  System Top-Up QRIS Instant Fulfillment 2.0
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  Sistem otomatisasi baru yang memproses pengiriman diamond game kurang dari 3 detik.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <span>1 DAY AGO</span>
                <span className="text-lime-400 font-bold">BACA SELENGKAPNYA</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED GAMES CATALOG SECTION */}
        <section id="katalog" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lime-400 font-extrabold text-2xl">/</span>
              <h2 className="text-xl font-extrabold tracking-wider uppercase text-white">
                FEATURED TOP-UP GAMES
              </h2>
            </div>
            <a href="#katalog" className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1">
              VIEW ALL GAMES &gt;
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl glass-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/game/${cat.slug}`}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden group flex flex-col relative border border-white/10"
                >
                  {/* Game Cover Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-black">
                    <img 
                      src={cat.thumbnail} 
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent opacity-80" />

                    {/* Rating Badge matching reference image green badge (e.g. 9.8) */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-lime-500 text-black font-extrabold text-[11px] shadow-lg border border-lime-400">
                      {(9.8 - idx * 0.2).toFixed(1)}
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="p-3 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-lime-400 transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {cat.products_count ? `${cat.products_count} Nominal` : 'Instant Delivery'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
