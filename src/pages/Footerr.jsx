import React from 'react';

const Footer = () => {
  // Theme Colors
  const colors = {
    bg: '#cecfee',      // Dark Sage Green
    text: '#000000',    // Cream/Off-white
    accent: '#ba6d29',  // Peach/Sand
    muted: '#092380',   // Lighter Sage for secondary text
  };

  // Inline Styles
  const styles = {
    footer: {
      backgroundColor: colors.bg,
      color: colors.text,
      marginTop:"30px",
      fontFamily: '"Inter", sans-serif',
      padding: '2rem 2% 5rem 5%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden', // Ensures the corner image doesn't scroll
    },
    // LEFT SIDE: Logo + Illustration
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: '1 1 300px', // Grow, shrink, basis
      minHeight: '300px',
      paddingRight: '2rem',
    },
    logo: {
      fontFamily: '"Recoleta", "Merriweather", serif',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: '2rem',
    },
    illustrationPlaceholder: {
      // This mimics the flowers in the bottom left of your reference
      marginTop: 'auto',
      width: '250px',
      opacity: '0.9',
      // In a real app, replace the src below with your flower/brain illustration
      // For now, I'm styling a text block to represent where the image goes
    },
    illustrationImage: {
        width: '100%',
        maxWidth: '280px',
        display: 'block',
        // Example filter to make a standard image blend with the dark theme
        filter: 'brightness(0.9)', 
    },

    // RIGHT SIDE: Links + Bottom Bar
    rightSection: {
      flex: '2 1 500px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    linksContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4rem',
      marginBottom: '4rem',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    columnHeader: {
      fontSize: '1rem',
      fontWeight: '700',
      color: colors.text,
      marginBottom: '0.5rem',
    },
    link: {
      color: colors.muted,
      textDecoration: 'none',
      fontSize: '0.95rem',
      transition: 'color 0.2s',
      cursor: 'pointer',
    },
    
    // BOTTOM BAR: Copyright + Socials
    bottomBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid rgba(252, 251, 248, 0.1)`, // Very faint divider
      paddingTop: '2rem',
      fontSize: '0.85rem',
      color: colors.muted,
    },
    socialIcons: {
      display: 'flex',
      gap: '1rem',
    },
    icon: {
      width: '32px',
      height: '32px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.text,
      textDecoration: 'none',
      fontSize: '14px',
    }
  };

  return (
    <footer style={styles.footer}>
      
      {/* LEFT SECTION: Brand & Illustration */}
      <div style={styles.leftSection}>
        <div style={styles.logo}>
          {/* Optional Icon could go here */}
          <span>✿ MINDCARE</span>
        </div>
        
        {/* The Floral/Organic Illustration Area */}
        <div style={styles.illustrationPlaceholder}>
          {/* Replace this src with your actual illustration asset (e.g., flowers or the brain art) */}
           <img 
            src="https://cdn-icons-png.flaticon.com/512/6233/6233226.png" 
            alt="Organic Flourish" 
            style={styles.illustrationImage} 
           />
        </div>
      </div>

      {/* RIGHT SECTION: Navigation & Copyright */}
      <div style={styles.rightSection}>
        
        {/* Navigation Columns */}
        <div style={styles.linksContainer}>
          {/* Column 1 */}
          <div style={styles.column}>
            <span style={styles.columnHeader}>Our Company</span>
            <a href="/blog" style={styles.link}>Wellness Blog</a>
            <a href="/podcast" style={styles.link}>Mindful Podcast</a>
            <a href="/careers" style={styles.link}>Careers</a>
            <a href="/news" style={styles.link}>Newsroom</a>
          </div>

          {/* Column 2 */}
          <div style={styles.column}>
            <span style={styles.columnHeader}>Resources</span>
            <a href="/tools" style={styles.link}>Mood Tracker</a>
            <a href="/music" style={styles.link}>Calming Music</a>
            <a href="/journal" style={styles.link}>Daily Journal</a>
            <a href="/community" style={styles.link}>Community Stories</a>
          </div>

          {/* Column 3 */}
          <div style={styles.column}>
            <span style={styles.columnHeader}>Support</span>
            <a href="/faq" style={styles.link}>FAQs</a>
            <a href="/contact" style={styles.link}>Contact Us</a>
            <a href="/crisis" style={{...styles.link, color: colors.accent}}>Crisis Support</a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div style={styles.bottomBar}>
          <span>© {new Date().getFullYear()} MindCare Wellness. All rights reserved.</span>
          
          <div style={styles.socialIcons}>
            {/* Simple social placeholders */}
            <a href="#" style={styles.icon}>Fb</a>
            <a href="#" style={styles.icon}>In</a>
            <a href="#" style={styles.icon}>Yt</a>
            <a href="#" style={styles.icon}>Sp</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;