import React from 'react';

const ContactSection = () => {
    return (
        <section id="contact-us" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get In Touch</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>We'd love to hear from you. Plan your visit or ask a question.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '4rem'
                }}>
                    {/* Contact Info */}
                    <div className="fade-up">
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Contact Detail</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>📍</span>
                                    <div>
                                        <h4 style={{ fontWeight: '600' }}>Our Location</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>123 Gourmet Ave, Culinary City, NY 10012</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>📞</span>
                                    <div>
                                        <h4 style={{ fontWeight: '600' }}>Phone Number</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>✉️</span>
                                    <div>
                                        <h4 style={{ fontWeight: '600' }}>Email Address</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>hello@bitesrestaurant.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            padding: '2rem',
                            background: 'var(--accent-soft)',
                            borderRadius: '20px',
                            border: '1px solid rgba(193, 154, 107, 0.2)'
                        }}>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Opening Hours</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}><strong>Mon - Thu:</strong> 11:00 AM - 10:00 PM</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}><strong>Fri - Sun:</strong> 10:00 AM - 11:00 PM</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="fade-up" style={{
                        background: 'white',
                        padding: '3rem',
                        borderRadius: '30px',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="text" placeholder="Your Name" style={inputStyle} />
                                <input type="email" placeholder="Email Address" style={inputStyle} />
                            </div>
                            <input type="text" placeholder="Subject" style={inputStyle} />
                            <textarea placeholder="Your Message" rows="5" style={inputStyle}></textarea>
                            <button
                                type="button"
                                className="btn-primary"
                                style={{ alignSelf: 'flex-start', width: '100%' }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

const inputStyle = {
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid #eee',
    background: '#fcfcfc',
    fontFamily: 'inherit',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s'
};

export default ContactSection;
