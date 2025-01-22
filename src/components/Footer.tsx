import React from 'react';
import { Github, Instagram, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 mb-6">
            <a href="https://github.com/quantumNexus0" className="hover:text-blue-400" target="_blank" rel="noopener noreferrer">
              <Github size={24} />
            </a>
            <a href="https://www.instagram.com/vipulyadav_02" className="hover:text-blue-400" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} />
            </a>
            <a href="mailto:fusionfission55@gmail.com" className="hover:text-blue-400">
              <Mail size={24} />
            </a>
          </div>
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Vipul Yadav. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;