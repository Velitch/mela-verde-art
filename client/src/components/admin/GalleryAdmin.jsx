import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Loader2, Filter, UploadCloud, X, Download, Play, Film } from 'lucide-react';

const GalleryAdmin = () => {
    // --- STATE UPLOAD ---
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadVibe, setUploadVibe] = useState('natural');
    const [status, setStatus] = useState('');
    const [uploading, setUploading] = useState(false);

    // --- STATE GESTIONE DATABASE ---
    const [photos, setPhotos] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [filterVibe, setFilterVibe] = useState('all');

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setFetching(true);
        try {
            const res = await axios.get('http://localhost:3001/api/gallery');
            setPhotos(res.data);
        } catch (err) {
            console.error("Errore fetch gallery:", err);
        } finally {
            setFetching(false);
        }
    };

    // SEO: Generatore di Alt Text per il database (Rileva se Video o Immagine)
    const generateAltText = (vibe, isVideo) => {
        const typeLabel = isVideo ? "Video Performance" : "Sperimentazione Visuale";
        const base = `Melaverde Bodypaint Milano - ${typeLabel}`;
        const vibeMap = {
            psy: "Psychedelic Glitch Art ed Estetica Acid Neon",
            natural: "Fotografia Organica, Texture e Forme Naturali",
            bdsm: "Underground Performance, Bondage Visual e Dark Aesthetic"
        };
        return `${base} ${vibeMap[vibe] || 'Artistica'}`;
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setUploading(true);
        const formData = new FormData();

        // LOGICA DI RINOMINA E RILEVAMENTO TIPO
        selectedFiles.forEach((file, index) => {
            const extension = file.name.split('.').pop().toLowerCase();
            const timestamp = Date.now();
            const isVideo = ['mp4', 'mov', 'avi', 'webm'].includes(extension);

            // Nome file temporaneo che il backend userà come base
            const customFileName = `${uploadVibe}_melaverde_bodypaint_${timestamp}_${index}.${extension}`;

            const renamedFile = new File([file], customFileName, { type: file.type });
            formData.append('images', renamedFile);
        });

        formData.append('vibe', uploadVibe);
        // Generiamo l'alt text basandoci sul primo file per semplicità di bulk upload
        const hasVideo = selectedFiles.some(f => f.type.includes('video'));
        formData.append('alt_text', generateAltText(uploadVibe, hasVideo));

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:3001/api/gallery/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus(`SUCCESS: ${selectedFiles.length} ASSETS_ELABORATI_DAL_SERVER`);
            setSelectedFiles([]);
            fetchPhotos();
        } catch (err) {
            setStatus('SYSTEM_FAILURE: UPLOAD_NON_RIUSCITO');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (imageUrl, vibe, id, type) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const ext = type === 'video' ? 'webm' : 'webp';
            const fileName = `${vibe}_melaverde_bodypaint_${id}.${ext}`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Errore download asset");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("PROCEDERE CON L'ELIMINAZIONE DEFINITIVA?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:3001/api/gallery/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPhotos(photos.filter(p => p.id !== id));
        } catch (err) {
            alert("Errore eliminazione");
        }
    };

    const filteredPhotos = filterVibe === 'all' ? photos : photos.filter(p => p.vibe === filterVibe);

    return (
        <div className="space-y-12">
            {/* SEZIONE UPLOAD IBRIDO */}
            <div className="p-8 bg-[#0A0A0A] border border-white/5">
                <div className="flex items-center gap-3 mb-8">
                    <Film className="text-[#FFFF00]" size={24} />
                    <h2 className="text-[#FFFF00] font-black uppercase italic text-2xl tracking-tighter">Asset_Injection_System</h2>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mv-input-group">
                            <label className="text-[10px] font-black text-white/30 uppercase mb-2 block">Vibe_Protocol</label>
                            <select
                                className="w-full bg-main border border-white/10 p-4 text-[#FFFF00] font-black italic outline-none focus:border-[#FFFF00]"
                                value={uploadVibe}
                                onChange={e => setUploadVibe(e.target.value)}
                            >
                                <option value="natural">NATURAL</option>
                                <option value="psy">PSY</option>
                                <option value="bdsm">BDSM</option>
                            </select>
                        </div>
                        <div className="mv-input-group">
                            <label className="text-[10px] font-black text-white/30 uppercase mb-2 block">Media_Source (JPG/PNG/MP4/MOV)</label>
                            <div className="relative border border-dashed border-white/20 p-4 hover:border-[#FFFF00]/50 transition-colors cursor-pointer group text-center">
                                <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*,video/*" />
                                <span className="text-[10px] font-black uppercase italic text-white/40">
                                    {selectedFiles.length > 0 ? `${selectedFiles.length} file pronti per conversione` : "Select_Media_Files"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/5">
                            {selectedFiles.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-2 py-1 bg-main text-[8px] font-mono text-white/60 border border-white/10">
                                    {f.type.includes('video') ? <Film size={10} className="text-[#FFFF00]" /> : <ImageIcon size={10} />}
                                    {f.name.substring(0, 15)}...
                                    <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))} />
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="w-full py-4 bg-[#FFFF00] text-black font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-30" disabled={uploading || selectedFiles.length === 0}>
                        {uploading ? <Loader2 className="animate-spin" /> : 'CONVERT_AND_PUSH_TO_ARCHIVE'}
                    </button>
                    {status && <p className="text-[10px] font-black uppercase italic text-[#FFFF00] text-center tracking-widest">{status}</p>}
                </form>
            </div>

            {/* SEZIONE GESTORE ARCHIVIO */}
            <div className="p-8 bg-[#0A0A0A] border border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-3">
                        <Filter className="text-white/20" />
                        <h2 className="text-white font-black uppercase italic text-2xl tracking-tighter">Media_Database_Manager</h2>
                    </div>
                    <div className="flex bg-main border border-white/10 p-1">
                        {['all', 'natural', 'psy', 'bdsm'].map(v => (
                            <button key={v} onClick={() => setFilterVibe(v)} className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${filterVibe === v ? 'bg-[#FFFF00] text-black' : 'text-white/40 hover:text-white'}`}>
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {fetching ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#FFFF00]" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredPhotos.map((photo) => (
                            <div key={photo.id} className="group relative aspect-square bg-main border border-white/5 overflow-hidden">

                                {/* PREVIEW IBRIDA */}
                                {photo.type === 'video' ? (
                                    <video src={photo.image_url} className="w-full h-full object-cover opacity-50" muted loop onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} />
                                ) : (
                                    <img src={photo.image_url} alt={photo.alt_text} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-500" />
                                )}

                                <div className="absolute top-2 right-2 z-10">
                                    {photo.type === 'video' && <Play size={14} className="text-[#FFFF00] fill-current" />}
                                </div>

                                <div className="absolute inset-0 bg-main/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-20">
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 uppercase self-start ${photo.vibe === 'psy' ? 'bg-[#39ff14] text-black' : photo.vibe === 'bdsm' ? 'bg-[#ff0000] text-white' : 'bg-[#FFFF00] text-black'}`}>
                                        {photo.vibe} [{photo.type.toUpperCase()}]
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handleDownload(photo.image_url, photo.vibe, photo.id, photo.type)} className="w-full py-2 bg-white/10 border border-white/20 text-white hover:bg-[#FFFF00] hover:text-black transition-all flex items-center justify-center gap-2">
                                            <Download size={12} /> <span className="text-[10px] font-black uppercase italic">Get_Asset</span>
                                        </button>
                                        <button onClick={() => handleDelete(photo.id)} className="w-full py-2 bg-red-600/20 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                            <Trash2 size={12} /> <span className="text-[10px] font-black uppercase italic">Kill_Asset</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryAdmin;