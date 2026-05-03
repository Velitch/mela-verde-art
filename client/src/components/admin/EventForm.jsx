import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, CheckCircle2, AlertCircle, X, Image as ImageIcon, FileEdit, Save } from 'lucide-react';
import '../../styles/Dashboard.css';

const EventForm = () => {
    const initialState = {
        name: '',
        customFileName: '',
        date: '',
        endDate: '',
        location: '',
        mood: '',
        vibe: 'natural',
        description: '',
        organizer: '',
        performer: '',
        external_link: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const fileInputRef = useRef(null);

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selected);

            if (!formData.customFileName && formData.name) {
                setFormData(prev => ({ ...prev, customFileName: slugify(formData.name) }));
            }
        }
    };

    const resetForm = () => {
        setFormData(initialState);
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setStatus({ type: 'error', msg: 'Inserisci un\'immagine' });

        setUploading(true);
        setStatus({ type: '', msg: '' });
        setProgress(0);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            const value = key === 'customFileName' ? slugify(formData[key]) : formData[key];
            data.append(key, value);
        });
        data.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:3001/api/events', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            setStatus({ type: 'success', msg: 'Evento pubblicato!' });
            resetForm();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Errore durante il caricamento';
            setStatus({ type: 'error', msg: errorMsg });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="event-form-container animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* COLONNA SINISTRA */}
                    <div className="space-y-6">
                        <div className="mv-input-group">
                            <label className="mv-label">Titolo Evento</label>
                            <input
                                type="text" className="mv-input" required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Esempio: TECHNO GARDEN"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="mv-input-group">
                                <label className="mv-label">Data Inizio</label>
                                <input
                                    type="date" className="mv-input" required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="mv-input-group">
                                <label className="mv-label">Data Fine</label>
                                <input
                                    type="date" className="mv-input"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="mv-input-group">
                                <label className="mv-label">Location</label>
                                <input
                                    type="text" className="mv-input" required
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Location Name"
                                />
                            </div>
                            <div className="mv-input-group">
                                <label className="mv-label">Performer</label>
                                <input
                                    type="text" className="mv-input"
                                    value={formData.performer}
                                    onChange={e => setFormData({ ...formData, performer: e.target.value })}
                                    placeholder="Artist Name"
                                />
                            </div>
                        </div>

                        <div className="mv-input-group">
                            <label className="mv-label">Scegli Vibe (Tema Sito)</label>
                            <select
                                className="mv-input"
                                value={formData.vibe}
                                onChange={e => setFormData({ ...formData, vibe: e.target.value })}
                                required
                            >
                                <option value="natural">NATURAL</option>
                                <option value="psy">PSY</option>
                                <option value="bdsm">BDSM</option>
                            </select>
                        </div>

                        <div className="mv-input-group">
                            <label className="mv-label">Descrizione Breve</label>
                            <textarea
                                className="mv-input h-32 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* COLONNA DESTRA */}
                    <div className="space-y-6">
                        <div className="mv-label">Locandina / Artwork</div>
                        <div
                            className="upload-zone relative overflow-hidden group cursor-pointer"
                            onClick={() => !uploading && fileInputRef.current.click()}
                            style={{ border: '1px dashed rgba(255,255,255,0.1)', minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover animate-in zoom-in-95" />
                            ) : (
                                <div className="flex flex-col items-center text-white/20 group-hover:text-[#FFFF00]/40 transition-colors">
                                    <ImageIcon size={64} strokeWidth={1} />
                                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em]">Seleziona File</p>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </div>

                        <div className="mv-input-group">
                            <label className="mv-label flex items-center gap-2">
                                <FileEdit size={12} className="text-[#FFFF00]" />
                                Nome URL Immagine
                            </label>
                            <input
                                type="text" className="mv-input font-mono text-[10px] text-[#FFFF00]"
                                value={formData.customFileName}
                                onChange={e => setFormData({ ...formData, customFileName: slugify(e.target.value) })}
                            />
                            <p className="text-[9px] text-white/20 mt-1 uppercase italic">Salvataggio: {formData.customFileName || '...'}.webp</p>
                        </div>

                        <div className="mv-input-group">
                            <label className="mv-label">Link Biglietti</label>
                            <input type="url" className="mv-input" value={formData.external_link} onChange={e => setFormData({ ...formData, external_link: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* AREA SUBMIT */}
                <div className="pt-8 border-t border-white/5">
                    {uploading && (
                        <div className="mb-6">
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2 italic text-[#FFFF00]">
                                <span>Encoding...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1"><div className="bg-[#FFFF00] h-full transition-all" style={{ width: `${progress}%` }}></div></div>
                        </div>
                    )}

                    {status.msg && (
                        <div className={`p-4 mb-6 font-black uppercase italic text-xs tracking-widest ${status.type === 'success' ? 'bg-[#FFFF00]/10 text-[#FFFF00]' : 'bg-red-500/10 text-red-500'}`}>
                            {status.msg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={uploading || !file || !formData.name}
                        className="w-full py-5 flex items-center justify-center gap-2 font-black uppercase italic tracking-widest transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                        style={{
                            backgroundColor: '#FFFF00',
                            color: '#000000',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <Save size={18} />
                        {uploading ? 'Processing Media...' : 'Pubblica Evento'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;