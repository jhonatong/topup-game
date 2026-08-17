'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, User, Gamepad2, ReceiptText, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white">
              BERTIGAAA<span className="text-lime-400">TOPUP</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm font-semibold text-lime-400 border-b-2 border-lime-400 pb-1"
            >
              HOME
            </Link>
            <Link 
              href="/#katalog" 
              className="text-sm font-semibold text-gray-300 hover:text-lime-400 transition-colors"
            >
              KATALOG GAME
            </Link>
            <Link 
              href="/check-order" 
              className="text-sm font-semibold text-gray-300 hover:text-lime-400 transition-colors flex items-center gap-1.5"
            >
              <ReceiptText className="w-4 h-4 text-lime-400" />
              LACAK PESANAN
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1 bg-lime-500/10 px-3 py-1.5 rounded-xl border border-lime-500/30"
            >
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              ADMIN PANEL
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Cari Game Favorit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 glass-input text-xs py-2.5 pl-9 pr-4 rounded-full transition-all focus:w-72"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            {/* Notification Icon */}
            <button className="relative p-2.5 rounded-full glass-card hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-lime-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Login / Order Status CTA */}
            <Link 
              href="/check-order" 
              className="px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold tracking-wider uppercase shadow-lg shadow-lime-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Cek Transaksi
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
