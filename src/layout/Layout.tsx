// src/layout/Layout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { LinkWrapper } from '@/components/ui/link-wrapper';

const Layout: React.FC = () => {
  return (
    <div>
      {/* --- Header Section (Always Visible) --- */}
      <header style={{ 
        backgroundColor: '#333', 
        color: 'white', 
        padding: '10px 20px', 
        textAlign: 'center' 
      }}>
        <nav>
          <LinkWrapper href="/hh" style={{ color: 'white', textDecoration: 'none' }}><span>Click </span><span>Home Link</span></LinkWrapper>
        </nav>
        <LinkWrapper href="/register"><button className="bg-blue">Register</button></LinkWrapper>
      </header>

      {/* --- Main Content Area (Where the Home page will be rendered) --- */}
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet /> 
      </main>

      {/* --- Footer Section (Always Visible) --- */}
      <footer style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '10px 20px', 
        textAlign: 'center', 
        borderTop: '1px solid #ccc' 
      }}>
        <p>&copy; {new Date().getFullYear()} <span>Simple App</span></p>
      </footer>
    </div>
  );
};

export default Layout;