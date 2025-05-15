import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactUs.css";
import TopPanel from './TopPanel';
import Footer from './Footer'

function ContactUs({ userImg, username, displayName, token }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", formData);
    alert("Your message has been sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
    <TopPanel userImg={userImg} username={username} displayName={displayName} navigate={navigate} token={token} />
    <div className="main-container">
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Fill out the form below to get in touch.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="send-button">Send</button>
      </form>

      </div>
    </div>
    <Footer />
    </>
    
  );
}

export default ContactUs;
