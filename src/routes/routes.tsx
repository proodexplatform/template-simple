// src/routes/routes.tsx

import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/layout'; // Import your layout
import Home from '../pages/Home';     // Import your home page

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  // Layout is the parent element
    children: [           // Children routes are rendered inside the Layout's <Outlet />
      {
        index: true,      // This path is the default one for the parent '/'
        element: <Home />, // Renders Home component
      },
      /*
      {
        path: 'about',
        element: <About />, // assuming you have an About.tsx page
      }
      */
    ],
  },
]);