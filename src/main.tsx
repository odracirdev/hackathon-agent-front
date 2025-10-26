import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { AgentsView } from "./pages/AgentsView";
import { InventoryView } from "./pages/InventoryView"; 
import App from "./App";
import "./index.css";

const routes = [
    {
        path: "/",
        element: <App />,
    },
    {
        path: "agents",
        element: <AgentsView onOpenChat={() => {}} />,
    },
    {
        path: "inventory",
        element: <InventoryView />,
    },
];
const root = document.getElementById("root");
    if (!root) throw new Error('Root element with id "root" not found');

createRoot(root).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
 );