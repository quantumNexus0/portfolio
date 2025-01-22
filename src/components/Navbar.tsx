import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-blue-600">Vipul Yadav</Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#projects" className="text-gray-700 hover:text-blue-600">Projects</a>
            <a href="#blog" className="text-gray-700 hover:text-blue-600">Blog</a>
            <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 py-2">Home</Link>
            <a href="#about" className="block text-gray-700 hover:text-blue-600 py-2">About</a>
            <a href="#projects" className="block text-gray-700 hover:text-blue-600 py-2">Projects</a>
            <a href="#blog" className="block text-gray-700 hover:text-blue-600 py-2">Blog</a>
            <Link to="/admin" className="block text-gray-700 hover:text-blue-600 py-2">Admin</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;