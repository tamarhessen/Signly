import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Signly. All rights reserved.</p>
      <p>
        <a href="/about" className="footer-link">About Us</a> | 
        <a href="/contact" className="footer-link">Contact</a>
      </p>
    </footer>
  );
}

export default Footer;
