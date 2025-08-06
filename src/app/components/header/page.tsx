'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 flex items-center h-full text-4xl transition-colors duration-300"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            SpeakGrade
          </span>
        </Link>

        {/* Desktop Nav - Hidden for now */}
        {/* <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium ${pathname === item.href
                ? 'text-purple-500'
                : 'text-gray-600 hover:text-purple-300'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav> */}

        {/* Mobile Menu Button - Hidden for now */}
        {/* <button
          className="md:hidden text-2xl text-purple-600"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button> */}
      </div>

      {/* Mobile Nav Menu - Hidden for now */}
      {/* {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`block text-base font-medium ${pathname === item.href
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-purple-500'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )} */}
    </header>
  );
}
