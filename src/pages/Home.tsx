// src/pages/Home.tsx
import React from 'react';
import { CurrencyDollar, CurrencyNgn } from "phosphor-react";

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to the Simple Webpage App!</h1>
      <p>This is the content of the home page.</p>
      <p>It's working with the layout and routes.</p>
    </div>
  );
};

export default Home;