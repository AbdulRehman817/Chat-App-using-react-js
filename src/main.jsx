// src/index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import Signup from "./signin/Signup.jsx";
import MessageSend from "./MessageSend/MessageSend.jsx";

import Layout from "../Layout.jsx";
import Login from "./login/Login.jsx";
import Check from "./Check.jsx";
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />, // Layout component is here
    children: [
      {
        path: "/",
        element: <MessageSend />,
      },
    ],
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

// Render the RouterProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <Outlet />
    </RouterProvider>
  </StrictMode>
);
