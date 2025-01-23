import { Route } from "react-router-dom";
import Login from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import ForgotPassword from "../../pages/Auth/ForgotPassword";

export const publicRoutes = [
    <Route path="/login" element={<Login />} key="login" />,
    <Route path="/register" element={<Register />} key="register" />,
    <Route path="/forgot-password" element={<ForgotPassword />} key="forgot-password" />
];