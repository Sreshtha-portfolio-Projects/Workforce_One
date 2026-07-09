import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! Your message has been received.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/home')}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>

          <h1 className="text-5xl font-bold text-white mb-4">
            Let's Build Something
          </h1>
          <p className="text-xl text-gray-400">
            Have a project in mind? Let's make it happen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full glass px-4 py-3 rounded-lg text-white border border-white/20 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full glass px-4 py-3 rounded-lg text-white border border-white/20 focus:border-primary focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full glass px-4 py-3 rounded-lg text-white border border-white/20 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass px-6 py-4 rounded-lg text-lg font-semibold text-white border border-accent/50 hover:border-accent transition-all glow-gold"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-white mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-gray-400">sreshtha@example.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">LinkedIn</h4>
                    <p className="text-gray-400">linkedin.com/in/sreshtha</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🐙</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">GitHub</h4>
                    <p className="text-gray-400">github.com/sreshtha</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Location</h4>
                    <p className="text-gray-400">Available for remote work</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">What I Can Help With</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span>
                  Full-stack web development
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span>
                  React & TypeScript applications
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span>
                  API design & integration
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span>
                  Database architecture
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary">✓</span>
                  Project management
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
