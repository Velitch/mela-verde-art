import React from 'react';
import { Link } from 'react-router-dom';
import { useMood } from '../../context/MoodContext';
import { Activity, ShieldCheck } from 'lucide-react';

const Footer = () => {
    const { getActiveColor, isNeon, vibe } = useMood();
    const accentColor = getActiveColor(); // Prende il colore dinamico (Fucsia, Verde, Rosso o Giallo)
    const currentYear = new Date().getFullYear();

    const footerStyle = {
        width: '100%',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: '80px 25px 40px 25px',
        borderTop: `1px solid ${accentColor}33`, // Bordo dinamico leggero
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
        transition: 'border-top 0.5s ease'
    };

    const columnTitleStyle = {
        color: accentColor,
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '20px',
        display: 'block',
        transition: 'color 0.5s ease'
    };

    const linkStyle = {
        color: 'rgba(255,255,255,0.5)',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'color 0.3s ease',
        display: 'block',
        marginBottom: '12px'
    };

    return (
        <footer style={footerStyle}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '60px',
                    marginBottom: '80px'
                }}>

                    {/* BRAND INFO */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <span style={{
                            fontSize: '24px',
                            fontWeight: 900,
                            fontStyle: 'italic',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '15px'
                        }}>
                            Mela<span style={{ color: accentColor, transition: 'color 0.5s' }}>verde</span>
                        </span>
                        <p style={{
                            fontSize: '11px',
                            lineHeight: '1.6',
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase',
                            fontWeight: '700'
                        }}>
                            Sperimentazione visuale. <br />
                            Nei pressi di Roma, Italia. <br />
                        </p>
                    </div>

                    {/* NAVIGAZIONE UTILE */}
                    <div>
                        <span style={columnTitleStyle}>Navigazione</span>
                        <Link to="/events" style={linkStyle} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Prossimi Eventi</Link>
                        <Link to="/gallery" style={linkStyle} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Galleria Visual</Link>
                        <Link to="/archivio-eventi" style={linkStyle} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Archivio Storico</Link>
                    </div>

                    {/* LEGAL & INFO */}
                    <div>
                        <span style={columnTitleStyle}>Informazioni</span>
                        <Link to="/chi-siamo" style={linkStyle} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Bio</Link>
                        <Link to="/privacy-policy" style={linkStyle} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Privacy Policy</Link>
                        <Link to="/termini-condizioni" style={linkStyle} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Cookie Policy</Link>
                    </div>

                    {/* CONTACT PREVIEW */}
                    <div>
                        <span style={columnTitleStyle}>Supporto</span>
                        <Link to="/contatti" style={linkStyle} onMouseEnter={(e) => e.target.style.color = accentColor} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}>Contatti</Link>
                        <span style={{ ...linkStyle, cursor: 'default' }}>Booking</span>
                    </div>
                </div>

                {/* BOTTOM STRIP */}
                <div style={{
                    borderTop: `2px solid ${accentColor}`,
                    paddingTop: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px',
                    transition: 'border-color 0.5s ease'
                }}>
                    <div style={{
                        fontSize: '16px',
                        color: '#FFFFFF',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontStyle: 'italic'
                    }}>
                        © {currentYear} // MELAVERDE
                    </div>

                    
                </div>
            </div>
        </footer>
    );
};

export default Footer;