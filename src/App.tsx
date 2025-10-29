import './App.css';
import { ThemeProvider } from "@/layout/theme-provider";
import { RouterProvider } from "react-router";
import { router } from "@/routes/routes";
import { ClientScriptHandler } from './clientScriptHandler';

function App() {
  return (
    <>
      <ClientScriptHandler /> {/* ✅ add component */}
      <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
