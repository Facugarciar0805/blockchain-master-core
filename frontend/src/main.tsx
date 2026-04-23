import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Homepage from "./pages/Homepage.tsx";


const router = createBrowserRouter([
    // {
    //     path: "/register",
    //     element: <RegisterPage/>,
    // },
    // {
    //     path: "/login",
    //     element: <LoginPage/>
    // },
    {
        path: "/homepage",
        element: <Homepage/>
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
);