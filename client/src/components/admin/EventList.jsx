import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Assicurati che sia importato se lo usi nel Modal
import { Trash2, Edit3, Eye, EyeOff, X, Save, Image as ImageIcon } from 'lucide-react';

// ✅ CORRETTO: Recuperiamo l'indirizzo dinamico da Render/Vercel
const API_BASE = import.meta.env.VITE_API_URL;

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch iniziale
    const fetchEvents = async () => {
        try {
            // Se VITE_API_URL finisce già con /api, togliamo la ripetizione
            const res = await axios.get(`${API_BASE}/events`);
            setEvents(res.data);
        } catch (err) {
            console.error("Errore caricamento eventi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleEditClick = (event) => {
        setEditingEvent({
            ...event,
            date: event.date ? event.date.split('T')[0] : '',
            endDate: event.endDate ? event.endDate.split('T')[0] : '',
            organizer: event.organizer || '',
            performer: event.performer || '',
            description: event.description || '',
            external_link: event.external_link || '',
            location: event.location || '',
            name: event.name || ''
        });

        // Gestione immagine preview nel modal: se è un nuovo file usa l'URL blob, 
        // altrimenti usa il percorso del server Render
        setPreview(event.image_url);
        setIsEditModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const createEventFormData = (eventData) => {
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            if (key === 'ig_link' || key === 'image_url') return; // Non inviamo il vecchio URL
            const value = eventData[key];
            formData.append(key, value === null ? '' : value);
        });
        return formData;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = createEventFormData(editingEvent);
        if (newFile) formData.append('image', newFile);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.put(`${API_BASE}/events/${editingEvent.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? res.data : ev));
            setIsEditModalOpen(false);
            setNewFile(null);
            alert("Sincronizzazione completata.");
        } catch (err) {
            console.error(err);
            alert("Errore aggiornamento");
        }
    };

    const toggleStatus = async (event) => {
        const newStatus = event.eventStatus === 'active' ? 'hidden' : 'active';

        setEvents(prev => prev.map(ev =>
            ev.id === event.id ? { ...ev, eventStatus: newStatus } : ev
        ));

        try {
            const token = localStorage.getItem('adminToken');
            // Nota: inviamo solo lo stato per semplicità se il backend lo permette, 
            // altrimenti usiamo createEventFormData
            const formData = createEventFormData({ ...event, eventStatus: newStatus });
            await axios.put(`${API_BASE}/events/${event.id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
            setEvents(prev => prev.map(ev =>
                ev.id === event.id ? event : ev
            ));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Eliminare definitivamente l'evento?")) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_BASE}/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            alert("Errore eliminazione");
        }
    };

    if (loading) return (
        <div className="p-12 text-[#FFFF00] animate-pulse font-black italic text-xs uppercase tracking-widest">
            LOADING_DATABASE_HISTORY...
        </div>
    );

    return (
        <div className="w-full px-4 sm:px-0">
            {/* VERSIONE MOBILE */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {events.map((event) => (
                    <div key={event.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={event.image_url}
                                alt=""
                                className="w-16 h-16 object-cover border border-white/10"
                            />
                            <div className="flex-1">
                                <div className="font-black uppercase text-sm italic text-white leading-tight">{event.name}</div>
                                <div className="text-[10px] text-[#FFFF00] font-black uppercase mt-1 tracking-tighter">{event.vibe}</div>
                            </div>
                            <button onClick={() => toggleStatus(event)} className="p-2">
                                {event.eventStatus === 'active' ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-white/20" />}
                            </button>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-3">
                            <span className="text-[9px] text-white/40 font-mono uppercase truncate max-w-[150px]">
                                {event.performer || 'N/A'} @ {event.location}
                            </span>
                            <div className="flex gap-4">
                                <button onClick={() => handleEditClick(event)} className="text-white/40 hover:text-[#FFFF00]"><Edit3 size={18} /></button>
                                <button onClick={() => handleDelete(event.id)} className="text-white/40 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* VERSIONE DESKTOP */}
            <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-left">
                            <th className="p-4 mv-label text-[10px] tracking-widest">Preview</th>
                            <th className="p-4 mv-label text-[10px] tracking-widest">Evento / Artist</th>
                            <th className="p-4 mv-label text-[10px] tracking-widest">Vibe</th>
                            <th className="p-4 mv-label text-[10px] tracking-widest text-center">Status</th>
                            <th className="p-4 mv-label text-[10px] tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group">
                                <td className="p-4">
                                    <div className="relative w-12 h-12 overflow-hidden border border-white/10">
                                        <img
                                            src={event.image_url}
                                            crossOrigin="anonymous"
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                        />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-black uppercase text-sm italic text-white">{event.name}</div>
                                    <div className="text-[9px] text-white/30 uppercase font-mono">{event.performer || 'N/A'} @ {event.location}</div>
                                </td>
                                <td className="p-4">
                                    <span className="text-[9px] font-black uppercase border border-white/10 px-2 py-1 text-[#FFFF00] bg-white/5">
                                        {event.vibe}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => toggleStatus(event)} className="transition-transform hover:scale-125">
                                        {event.eventStatus === 'active' ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-white/20" />}
                                    </button>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-3 text-white/20">
                                        <button onClick={() => handleEditClick(event)} className="hover:text-[#FFFF00] transition-colors"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(event.id)} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDIT */}
            {isEditModalOpen && editingEvent && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
                    <div className="bg-[#0A0A0A] border-y sm:border border-white/10 w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto p-6 sm:p-10 custom-scrollbar">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-[#FFFF00] font-black uppercase italic text-xl tracking-tighter">System_Edit_Update</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/30 hover:text-white"><X size={28} /></button>
                        </div>

                        <form onSubmit={handleUpdate} className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8">
                            <div className="space-y-6">
                                <label className="mv-label text-[10px] block">Artwork_Preview</label>
                                <div
                                    className="relative border border-dashed border-white/10 p-2 cursor-pointer group"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <img src={preview} alt="Preview" className="w-full aspect-video object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-black/80 px-4 py-2 border border-white/20 text-[10px] font-bold uppercase italic">Upload_New</div>
                                    </div>
                                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                                </div>
                                <div className="mv-input-group">
                                    <label className="mv-label text-[10px]">Description</label>
                                    <textarea
                                        className="mv-input h-32 sm:h-48 resize-none"
                                        value={editingEvent.description}
                                        onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="mv-input-group">
                                    <label className="mv-label text-[10px]">Event_Name</label>
                                    <input type="text" className="mv-input" value={editingEvent.name} onChange={e => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="mv-input-group">
                                        <label className="mv-label text-[10px]">Start_Date</label>
                                        <input type="date" className="mv-input" value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                                    </div>
                                    <div className="mv-input-group">
                                        <label className="mv-label text-[10px]">End_Date</label>
                                        <input type="date" className="mv-input" value={editingEvent.endDate} onChange={e => setEditingEvent({ ...editingEvent, endDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mv-input-group">
                                        <label className="mv-label text-[10px]">Vibe_Type</label>
                                        <select className="mv-input" value={editingEvent.vibe} onChange={e => setEditingEvent({ ...editingEvent, vibe: e.target.value })}>
                                            <option value="natural">Natural</option>
                                            <option value="psy">Psy</option>
                                            <option value="bdsm">BDSM</option>
                                        </select>
                                    </div>
                                    <div className="mv-input-group">
                                        <label className="mv-label text-[10px]">Visibility</label>
                                        <select className="mv-input" value={editingEvent.eventStatus} onChange={e => setEditingEvent({ ...editingEvent, eventStatus: e.target.value })}>
                                            <option value="active">Active</option>
                                            <option value="hidden">Hidden</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mv-input-group">
                                    <label className="mv-label text-[10px]">Location</label>
                                    <input type="text" className="mv-input" value={editingEvent.location} onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })} />
                                </div>
                                <div className="mv-input-group">
                                    <label className="mv-label text-[10px]">External_Link_ID</label>
                                    <input type="text" className="mv-input" value={editingEvent.external_link} onChange={e => setEditingEvent({ ...editingEvent, external_link: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full py-4 mt-6 flex items-center justify-center gap-3 font-black uppercase italic bg-[#FFFF00] text-black hover:bg-white transition-colors">
                                    <Save size={18} /> SYNC_DATABASE_CORE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventList;