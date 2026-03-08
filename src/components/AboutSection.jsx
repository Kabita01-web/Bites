import React from 'react';

const AboutSection = () => {
    return (
        <section id="about-us">
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
            }}>
                <div className="fade-up">
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Our Story"
                            style={{ borderRadius: '30px', boxShadow: 'var(--shadow-md)' }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '-30px',
                            right: '-30px',
                            background: 'var(--accent-color)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            display: 'none' // Hide on smaller screens
                        }} className="about-badge">
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>15+</span><br />
                            Years of Passion
                        </div>
                    </div>
                </div>

                <div className="fade-up">
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Our Story: A Passion for <span style={{ color: 'var(--accent-color)' }}>Culinary Excellence</span></h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Founded in 2009, Bites began with a simple vision: to create a space where food is celebrated as an art form. We believe that every dish should be a balance of flavor, texture, and visual beauty.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Our chefs source the finest local ingredients, working closely with farmers and producers to ensure that only the freshest seasonal items make it to your plate.
                    </p>
                    <button className="btn-outline">More About Us</button>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
