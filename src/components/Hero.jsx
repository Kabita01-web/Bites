import React from 'react';

const Hero = () => {
    return (
        <section style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url("https://images.unsplash.com/photo-1550966842-28df05094254?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            paddingBottom: '4rem'
        }}>
            <div className="container">
                <div className="fade-up" style={{ maxWidth: '650px' }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 5rem)',
                        lineHeight: 1.1,
                        color: 'var(--text-primary)',
                        marginBottom: '1.5rem'
                    }}>
                        Experience the <span style={{ color: 'var(--accent-color)' }}>Art of Taste</span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '2.5rem',
                        maxWidth: '500px'
                    }}>
                        Discover a culinary journey where every bite tells a story. Fresh ingredients, masterful techniques, and a touch of elegance.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button className="btn-primary">Book a Table</button>
                        <button className="btn-outline">View Menu</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
