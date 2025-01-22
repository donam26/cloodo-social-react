import { Route, Navigate } from "react-router-dom";
import Home from "../../pages/Home";
import HomeLayout from "../../layouts/Home";

const PrivateWrapper = ({ children }) => {
    const isAuthenticated = true;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const privateRoutes = [
    <Route 
        path="/" 
        key="home"
        element={
            <PrivateWrapper>
                <HomeLayout>
                    <Home />
                </HomeLayout>
            </PrivateWrapper>
        }
    />
];

export default privateRoutes;