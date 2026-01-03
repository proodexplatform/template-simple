import './App.css';
import { ThemeProvider } from "@/context/theme-provider";
import { RouterProvider } from "react-router";
import { ClientScriptHandler } from '@/client-script-handler';

export function App() {
  return (
    <>
      <ClientScriptHandler />
      <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
        <div className="app-container">
          {/* Your website content goes here */}
          <h1>Welcome to My Website</h1>
          <p>This is the main page of your website.</p>
          <p>Just testing the content.</p>
        </div>
      </ThemeProvider>
    </>
  );
};