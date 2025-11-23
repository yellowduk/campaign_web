import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { PinboardPost } from '../types';

// Mock initial data with added rotation property for that messy look
const MOCK_POSTS: (PinboardPost & { rotation: number })[] = [
  { id: '1', imageUrl: 'https://picsum.photos/id/1015/400/400', caption: 'Nemu di deket stasiun!', location: 'Jakarta Selatan', timestamp: Date.now(), rotation: -2 },
  { id: '2', imageUrl: 'https://picsum.photos/id/1016/400/500', caption: 'Jaga diri woy.', location: 'Bandung', timestamp: Date.now() - 100000, rotation: 3 },
  { id: '3', imageUrl: 'https://picsum.photos/id/1018/400/300', caption: 'Ditempel depan warnet.', location: 'Surabaya', timestamp: Date.now() - 200000, rotation: -1.5 },
  { id: '4', imageUrl: 'https://picsum.photos/id/237/400/350', caption: 'Gas terus!', location: 'Medan', timestamp: Date.now() - 300000, rotation: 4 },
];

export const Pinboard: React.FC = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setCapturedImage(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Gagal akses kamera. Cek izin browser lo.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      // Make it square-ish for polaroid feel
      const size = Math.min(videoRef.current.videoWidth, videoRef.current.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop
        const sx = (videoRef.current.videoWidth - size) / 2;
        const sy = (videoRef.current.videoHeight - size) / 2;
        ctx.drawImage(videoRef.current, sx, sy, size, size, 0, 0, size, size);
        
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        if (stream) stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleSubmitPost = () => {
    if (!capturedImage) return;

    const newPost = {
      id: Date.now().toString(),
      imageUrl: capturedImage,
      caption: caption || 'Lawan Judol!',
      location: location || 'Indonesia',
      timestamp: Date.now(),
      rotation: Math.random() * 6 - 3 // Random rotation between -3 and 3 degrees
    };

    setPosts([newPost, ...posts]);
    setCapturedImage(null);
    setCaption('');
    setLocation('');
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-[#dcb386] bg-cork-pattern relative">
       {/* Header Overlay */}
       <div className="bg-white/90 backdrop-blur-sm border-b-4 border-black py-6 sticky top-20 z-30 shadow-md">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tighter">Tembok Jalanan</h1>
              <p className="font-mono text-sm text-neutral-600">BUKTI AKSI NYATA. TEMPEL PERLAWANANMU.</p>
            </div>
            <Button onClick={startCamera} className="mt-4 md:mt-0 bg-brand-red text-white" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            }>
              FOTO SEKARANG
            </Button>
         </div>
       </div>

      {/* Modal for Camera/Upload - Brutalist Style */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg mx-auto my-auto">
            <button onClick={stopCamera} className="absolute -top-12 right-0 z-10 text-white hover:text-red-500 transition-colors">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {!capturedImage ? (
              <div className="bg-black border-4 border-white shadow-2xl">
                <div className="relative aspect-[3/4] overflow-hidden">
                   <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                   
                   {/* Viewfinder Overlay */}
                   <div className="absolute inset-0 border-[20px] border-black/30 pointer-events-none"></div>
                   <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none opacity-50">
                      <div className="w-12 h-1 bg-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="w-1 h-12 bg-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                   </div>

                   <button 
                    onClick={capturePhoto} 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-red-600 hover:bg-red-700 transition-colors shadow-hard active:scale-95"
                   />
                </div>
                <div className="bg-white p-4 font-mono font-bold text-center uppercase tracking-widest">
                  Pasin Poster & Cekrek
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                 {/* Visual Preview of the Result */}
                 <div className="transform rotate-1 transition-all duration-500">
                    <div className="bg-white p-4 pb-16 shadow-polaroid">
                        <div className="aspect-square bg-neutral-100 overflow-hidden border border-neutral-200 filter contrast-125 saturate-[0.85] sepia-[0.15]">
                            <img src={capturedImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-6 font-hand text-center text-2xl text-neutral-800 -rotate-1 break-words leading-tight px-2">
                            {caption || "Tulis sesuatu..."}
                        </div>
                    </div>
                 </div>

                 {/* Form Inputs */}
                 <div className="bg-brand-paper border-4 border-black p-6 shadow-hard space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-black mb-1 uppercase font-mono">Caption</label>
                        <input 
                            type="text" 
                            placeholder="Ngomong apa kek..." 
                            maxLength={40}
                            className="w-full border-2 border-black p-3 font-hand text-xl bg-white focus:bg-yellow-50 outline-none"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-black mb-1 uppercase font-mono">Lokasi</label>
                        <input 
                            type="text" 
                            placeholder="JAKARTA PUSAT" 
                            className="w-full border-2 border-black p-2 font-mono text-sm uppercase bg-white focus:bg-yellow-50 outline-none"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" onClick={() => setCapturedImage(null)} className="flex-1 bg-white">ULANG</Button>
                        <Button onClick={handleSubmitPost} className="flex-1">TEMPEL</Button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Corkboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {posts.map((post) => (
            <div 
                key={post.id} 
                className="relative group"
                style={{ transform: `rotate(${post.rotation}deg)` }}
            >
                {/* The Pin */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-red-600 border-2 border-black shadow-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-black/30 rounded-full"></div>
                </div>
                
                {/* Polaroid Body */}
                <div className="bg-white p-4 pb-14 shadow-polaroid transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:rotate-0">
                    {/* Image Area */}
                    <div className="aspect-square bg-neutral-100 overflow-hidden border border-neutral-200 filter contrast-125 saturate-[0.85] sepia-[0.15]">
                        <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Handwriting Area */}
                    <div className="mt-6 text-center relative">
                        <p className="font-hand text-xl md:text-2xl text-neutral-800 leading-tight rotate-[-1deg] break-words">
                            {post.caption}
                        </p>
                        <div className="absolute -bottom-10 left-0 w-full text-center">
                             <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                                {post.location}
                             </span>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};