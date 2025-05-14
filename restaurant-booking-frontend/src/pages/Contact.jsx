import React, { useState } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await axios.post('http://localhost:5000/api/contact', formData); // update URL in production
      if (res.data.success) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-beige-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-brown-800 mb-4">
        Contact Us
      </h1>
      <p className="text-center text-brown-600 mb-10">
        We'd love to hear from you. Reach out with questions, feedback, or reservations!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-gold-600 mb-4">Visit Us</h2>
          <p className="text-brown-700 mb-2">🏢 Elegant Bites Restaurant</p>
          <p className="text-brown-700 mb-2">123 Luxe Avenue, Nairobi, Kenya</p>
          <p className="text-brown-700 mb-2">📞 +254 712 345 678</p>
          <p className="text-brown-700">✉️ info@elegantbites.co.ke</p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gold-600 mb-2">Opening Hours</h3>
            <p className="text-brown-700">Mon - Sun: 11:00 AM – 11:00 PM</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-gold-600 mb-6">Send Us a Message</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-brown-700 font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-brown-700 font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-brown-700 font-medium mb-1" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-full font-semibold shadow-sm transition"
            >
              Send Message
            </button>
            {status && (
              <p className="text-center mt-4 text-sm text-brown-700">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
