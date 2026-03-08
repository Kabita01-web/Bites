import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '5rem 0 2rem',
            backgroundColor: 'white',
            borderTop: '1px solid #eee'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    <div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                            marginBottom: '1.5rem'
                        }}>
                            BITES
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Where every bite is a masterpiece. join us for an unforgettable dining experience in the heart of the city.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {['Home', 'Menu', 'About Us', 'Contact Us'].map(link => (
                                <li key={link}>
                                    <a href={`#${link.toLowerCase().replace(' ', '-')}`} style={{
                                        textDecoration: 'none',
                                        color: 'var(--text-secondary)',
                                        transition: 'var(--transition)'
                                    }} onMouseEnter={e => e.target.style.color = 'var(--accent-color)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Social Media</h4>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {['Instagram', 'Facebook', 'Twitter'].map(social => (
                                <a key={social} href="#" style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    transition: 'var(--transition)'
                                }}
                                    onMouseEnter={e => e.target.style.color = 'var(--accent-color)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Newsletter</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="email" placeholder="Your Email" style={{
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #eee',
                                flex: 1,
                                outline: 'none'
                            }} />
                            <button className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Join</button>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #eee',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                }}>
                    © 2024 Bites Restaurant. Designed with Passion for Taste.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
