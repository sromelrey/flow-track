'use client'

import { Mountain, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Tasks', href: '#', current: false },
    { name: 'Plans', href: '#', current: false },
    { name: 'Settings', href: '#', current: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Mountain className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FocusFlow</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium ${
                  item.current
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium ${
                    item.current
                      ? 'text-green-600 bg-green-50 border-l-4 border-green-600'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
