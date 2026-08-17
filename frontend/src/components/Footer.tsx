import React from 'react';
import { Users, Gamepad2, Trophy, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#07090e]">
      
      {/* Top Stats Bar matching Reference Image */}
      <div className="border-b border-white/10 py-8 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="text-xl font-extrabold text-white">2M+</h4>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Registered Players</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="text-xl font-extrabold text-white">1500+</h4>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Games & Nominal</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="text-xl font-extrabold text-white">1-3 Detik</h4>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Proses Otomatis</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="text-xl font-extrabold text-white">100% Legal</h4>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Garansi & Resmi</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                BERTIGAAA<span className="text-lime-400">TOPUP</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              BertigaaaTopUp - Platform top up game tercepat, termurah, dan terpercaya di Indonesia. Layanan transaksi 24 jam non-stop dengan sistem otomatisasi instan.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Metode Pembayaran</h5>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-gray-400">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">QRIS</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">GoPay</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">DANA</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">ShopeePay</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">BCA VA</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">Mandiri VA</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Dukungan</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-lime-400">Hubungi Customer Service</a></li>
              <li><a href="#" className="hover:text-lime-400">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-lime-400">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
          © 2026 BertigaaaTopUp Platform. All rights reserved. Designed with modern Glassmorphic aesthetics.
        </div>
      </div>

    </footer>
  );
}
