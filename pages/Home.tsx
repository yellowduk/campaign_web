import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b-4 border-black bg-brand-yellow overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/crumpled-paper.png')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-2/3 z-10">
              <div className="inline-block bg-black text-white px-4 py-1 font-mono font-bold mb-4 rotate-1">
                #STOP_JUDOL_SEKARANG
              </div>
              <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
                JANGAN JUDIIN <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-800 stroke-black" style={{ WebkitTextStroke: '2px black'}}>NYAWA LO</span>
              </h1>
              <p className="text-xl md:text-2xl text-black font-medium mb-8 max-w-xl font-mono border-l-4 border-brand-red pl-6 py-2 bg-white/50 backdrop-blur-sm">
                Judol itu jebakan batman. Putus siklusnya. Bikin ribut. Tempel di mana-mana.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/generate">
                  <Button className="w-full sm:w-auto text-xl px-8 py-4 bg-black text-white hover:bg-neutral-800 border-transparent">
                    Mulai Bikin
                  </Button>
                </Link>
                <Link to="/pinboard">
                  <Button variant="outline" className="w-full sm:w-auto text-xl px-8 py-4 bg-white">
                    Lihat Tembok
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Decorative Image */}
            <div className="md:w-1/3 relative">
              <div className="relative z-10 bg-white p-2 border-4 border-black shadow-hard rotate-3">
                 <div className="bg-brand-red w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <div className="font-display text-9xl font-bold text-white opacity-50 -rotate-45">NO</div>
                 </div>
                 <div className="font-hand text-center mt-2 text-xl">Sudah Cukup!</div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-black bg-black transform translate-x-4 translate-y-4 -z-0 rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto / How It Works */}
      <section className="py-20 bg-brand-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 border-b-4 border-black pb-6">
            <h2 className="font-display text-5xl font-bold text-black uppercase">MISI KITA</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group">
              <div className="bg-white border-4 border-black p-8 shadow-hard transition-transform group-hover:-translate-y-2">
                <div className="font-display text-6xl font-bold text-brand-red mb-4 opacity-20 group-hover:opacity-100 transition-opacity">01</div>
                <h3 className="font-mono font-bold text-2xl mb-4 uppercase bg-brand-yellow inline-block px-2">Bikin Poster</h3>
                <p className="font-medium text-lg">Pakai tool AI kita. Geser teksnya. Bikin jelek, bikin berisik. Bikin poster yang neriakin fakta.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group md:mt-12">
               <div className="bg-white border-4 border-black p-8 shadow-hard transition-transform group-hover:-translate-y-2">
                <div className="font-display text-6xl font-bold text-brand-red mb-4 opacity-20 group-hover:opacity-100 transition-opacity">02</div>
                <h3 className="font-mono font-bold text-2xl mb-4 uppercase bg-brand-yellow inline-block px-2">Cetak Sendiri</h3>
                <p className="font-medium text-lg">Print di A4, A3, atau kertas stiker. Kertas murah gak masalah. Pesannya lebih penting dari kertasnya.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group md:mt-24">
               <div className="bg-white border-4 border-black p-8 shadow-hard transition-transform group-hover:-translate-y-2">
                <div className="font-display text-6xl font-bold text-brand-red mb-4 opacity-20 group-hover:opacity-100 transition-opacity">03</div>
                <h3 className="font-mono font-bold text-2xl mb-4 uppercase bg-brand-yellow inline-block px-2">Tempel & Viral</h3>
                <p className="font-medium text-lg">Tempel di tembok jalanan. Foto cekrek. Upload ke sini. Kasih paham kalau kita ngawasin.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t-4 border-brand-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-display font-bold text-4xl uppercase tracking-tighter">Anti-Judol ID</span>
          </div>
          <div className="font-mono text-sm text-neutral-400 text-center md:text-right flex flex-col gap-2">
            <p>BUILT FOR THE STREETS.</p>
            <p>&copy; {new Date().getFullYear()} OPEN SOURCE INITIATIVE.</p>
            <a href="https://github.com/yellowduk/antidol" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};