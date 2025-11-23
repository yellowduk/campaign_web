import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { generatePosterBackground } from '../services/geminiService';
import { PosterVibe, PaperSize, PAPER_DIMENSIONS } from '../types';

interface TextState {
  x: number; // percentage 0-1
  y: number; // percentage 0-1
  text: string;
  color: string;
  size: number; // scale factor
}

type SourceMode = 'ai' | 'upload';

export const Generator: React.FC = () => {
  const [mode, setMode] = useState<SourceMode>('ai');
  const [vibe, setVibe] = useState<PosterVibe>(PosterVibe.TRUCK);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState<PaperSize>(PaperSize.A4);
  
  // Canvas State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Text Interaction State
  const [textState, setTextState] = useState<TextState>({
    x: 0.5,
    y: 0.5,
    text: "INGAT ANAK ISTRI\nSTOP JUDI",
    color: '#FFDE59',
    size: 1
  });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = ['#FFFFFF', '#000000', '#D6001C', '#FFDE59'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generatePosterBackground(vibe, customPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Gagal bikin gambar. Coba lagi yak.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setGeneratedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dims = PAPER_DIMENSIONS[selectedSize];
    
    // Fixed preview height for display, calculate width based on ratio
    const previewHeight = 1000; 
    const previewWidth = previewHeight * dims.ratio;
    
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // 1. Background
    if (generatedImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = generatedImage;
      
      // We need to wait for image load inside useEffect usually, but if it's dataURL it's fast.
      // To be safe in React strict mode:
      const draw = () => {
        // Center Crop
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        drawOverlays(ctx, canvas.width, canvas.height);
      };
      
      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    } else {
      // Placeholder Noise
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Initial Call to Action if no image
      ctx.fillStyle = '#333';
      ctx.font = 'bold 40px "Courier Prime", monospace';
      ctx.textAlign = 'center';
      ctx.fillText("KLIK BIKIN GAMBAR", canvas.width/2, canvas.height/2);
      
      // Still draw overlays (text) so user can see their text editing in real time even before image
      drawOverlays(ctx, canvas.width, canvas.height);
    }

  }, [generatedImage, selectedSize, textState]);

  const drawOverlays = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // 2. Texture Overlay (Scan lines)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for(let i=0; i<h; i+=4) {
        ctx.fillRect(0, i, w, 1);
      }

      // 3. Draggable Text
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textState.color;
      // Use Oswald for that poster feel
      const baseFontSize = w * 0.15 * textState.size;
      ctx.font = `900 ${baseFontSize}px Oswald, sans-serif`;
      
      // Shadow for readability
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.shadowBlur = 0;

      // Multi-line support
      const lines = textState.text.toUpperCase().split('\n');
      const lineHeight = baseFontSize * 1.1;
      const totalHeight = lines.length * lineHeight;
      
      const startX = w * textState.x;
      const startY = (h * textState.y) - (totalHeight / 2) + (lineHeight/2);

      lines.forEach((line, i) => {
        ctx.fillText(line, startX, startY + (i * lineHeight));
        
        // Outline text effect for all colors to pop against potential busy truck backgrounds
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = baseFontSize * 0.05;
        ctx.strokeText(line, startX, startY + (i * lineHeight));
        
        // Re-fill to ensure sharpness over the stroke
        ctx.fillText(line, startX, startY + (i * lineHeight));
      });
      ctx.restore();

      // 4. Permanent Footer (Sticker Style)
      const stickerW = w * 0.4;
      const stickerH = h * 0.05;
      const stickerX = w - stickerW - (w * 0.05);
      const stickerY = h - stickerH - (h * 0.05);
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(stickerX, stickerY, stickerW, stickerH);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${stickerH * 0.6}px "Courier Prime", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'transparent';
      ctx.fillText("ANTIJUDOL.ID", stickerX + (stickerW/2), stickerY + (stickerH/2));
  };

  // Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTextState(prev => ({
      ...prev,
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `ANTIJUDOL_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Controls - Left Side */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="bg-white border-4 border-black p-6 shadow-hard">
            <h1 className="font-display text-4xl font-bold mb-1 uppercase">Dapur Poster</h1>
            <div className="h-1 w-full bg-brand-red mb-6"></div>
            
            {/* Source Toggle */}
            <div className="flex mb-6 border-2 border-black">
              <button 
                onClick={() => setMode('ai')}
                className={`flex-1 py-2 font-bold font-mono uppercase transition-colors ${mode === 'ai' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'}`}
              >
                Pakai AI
              </button>
              <button 
                onClick={() => setMode('upload')}
                className={`flex-1 py-2 font-bold font-mono uppercase transition-colors border-l-2 border-black ${mode === 'upload' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'}`}
              >
                Upload Sendiri
              </button>
            </div>

            {mode === 'ai' ? (
              <>
                {/* Vibe Selector */}
                <div className="mb-6">
                  <label className="block font-mono font-bold text-sm mb-2">1. PILIH VIBE</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(PosterVibe).map((v) => (
                      <button
                        key={v}
                        onClick={() => setVibe(v)}
                        className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
                            vibe === v 
                            ? 'bg-brand-yellow text-black border-black shadow-hard-sm' 
                            : 'bg-transparent text-black border-neutral-300 hover:border-black'
                        }`}
                      >
                        {v === PosterVibe.TRUCK ? '🚚 ' + v : v.split(' ')[0]} 
                        {v === PosterVibe.CUSTOM ? '✨' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt Input */}
                {vibe === PosterVibe.CUSTOM && (
                  <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                    <label className="block font-mono font-bold text-sm mb-2 text-brand-red">GAMBARIN KECHAOSANNYA:</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="contoh: Tikus cyber makan chip poker, kabut neon hijau, gaya cctv buram..."
                      className="w-full p-3 border-2 border-black font-mono text-sm bg-neutral-50 focus:bg-white focus:ring-0 focus:border-brand-red outline-none"
                      rows={3}
                    />
                  </div>
                )}

                <Button 
                  onClick={handleGenerate} 
                  isLoading={isGenerating} 
                  className="w-full text-lg bg-brand-red hover:bg-red-700 mb-8"
                >
                  {generatedImage ? 'GANTI GAMBAR (REROLL)' : 'BIKIN GAMBAR'}
                </Button>
              </>
            ) : (
              <div className="mb-8">
                <label className="block font-mono font-bold text-sm mb-2">1. UPLOAD GAMBAR</label>
                <div 
                  className="border-2 border-dashed border-black bg-neutral-50 p-8 text-center cursor-pointer hover:bg-neutral-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <p className="font-display text-xl text-neutral-400 mb-2">TARUH FILE DISINI</p>
                  <p className="font-mono text-xs text-neutral-400">ATAU KLIK BUAT CARI</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Editor Tools */}
            <div className={`transition-all duration-300 ${generatedImage || !generatedImage ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="block font-mono font-bold text-sm mb-2">2. GANTI TEKS (GESER DI GAMBAR)</label>
                <textarea
                    value={textState.text}
                    onChange={(e) => setTextState(s => ({...s, text: e.target.value}))}
                    className="w-full p-3 border-2 border-black font-display font-bold text-xl uppercase bg-brand-paper focus:bg-white focus:ring-0 mb-4"
                    rows={2}
                />

                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block font-mono font-bold text-xs mb-1">UKURAN</label>
                        <input 
                            type="range" min="0.5" max="2.5" step="0.1"
                            value={textState.size}
                            onChange={(e) => setTextState(s => ({...s, size: parseFloat(e.target.value)}))}
                            className="w-full accent-brand-red h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer border border-black"
                        />
                    </div>
                    <div className="flex-1">
                         <label className="block font-mono font-bold text-xs mb-1">WARNA</label>
                         <div className="flex gap-2">
                             {colors.map(c => (
                                 <button
                                    key={c}
                                    onClick={() => setTextState(s => ({...s, color: c}))}
                                    className={`w-8 h-8 rounded-full border-2 border-black shadow-sm ${textState.color === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                                    style={{ backgroundColor: c }}
                                 />
                             ))}
                         </div>
                    </div>
                </div>

                <label className="block font-mono font-bold text-sm mb-2">3. UKURAN KERTAS</label>
                <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value as PaperSize)}
                    className="w-full p-2 border-2 border-black font-mono text-sm mb-6 bg-white"
                >
                    {Object.values(PaperSize).map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <Button onClick={handleDownload} variant="secondary" className="w-full">
                    CETAK POSTER
                </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area - Right Side */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div 
            ref={containerRef}
            className="relative bg-[#2a2a2a] border-4 border-black shadow-hard p-4 md:p-8 min-h-[600px] flex items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
          >
             <div className="relative shadow-2xl group cursor-move">
                {/* Canvas */}
                <canvas 
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="max-w-full max-h-[80vh] bg-white touch-none"
                />
                {!generatedImage && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Initial state hint hidden by the canvas drawing itself now */}
                    </div>
                )}
             </div>
             
             {/* Instruction Overlay */}
             {generatedImage && (
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 font-mono text-xs pointer-events-none border border-white/20">
                    GESER TEKS SESUKA HATI
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};