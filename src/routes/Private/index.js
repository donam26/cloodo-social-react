import { Route, Navigate, useLocation } from "react-router-dom";
import Home from "../../pages/Home";
import Messenger from "../../pages/Messenger";
import Groups from "../../pages/Groups";
import Profile from "../../pages/Profile";
import HomeLayout from "../../layouts/Home";
import MessengerLayout from "../../layouts/Messenger";
import FriendLayout from "../../layouts/Friend";
import GroupLayout from "../../layouts/Group";
import ProfileLayout from "../../layouts/Profile";
import FriendPage from "../../pages/Friend";
import LivestreamPage from "../../pages/Livestream";
import VideoPage from "../../pages/Video";
import VideoLayout from "../../layouts/Video";

const PrivateWrapper = ({ children }) => {
    const location = useLocation();
    const userData = localStorage.getItem('user_data');
    
    // Nếu đang ở trang login và có token trong URL, cho phép render
    if (location.pathname === '/login' && location.search.includes('token=')) {
        return children;
    }
    
    // Kiểm tra authentication bằng token trong localStorage
    return userData ? children : <Navigate to="/login" state={{ from: location }} />;
};

export const privateRoutes = [
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
    />,
    <Route
        path="/friend"
        key="friend"
        element={
            <PrivateWrapper>
                <FriendLayout>
                    <FriendPage />
                </FriendLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/messenger"
        key="messenger"
        element={
            <PrivateWrapper>
                <MessengerLayout>
                    <Messenger />
                </MessengerLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/video"
        key="video"
        element={
            <PrivateWrapper>
                <VideoLayout>
                    <VideoPage />
                </VideoLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/livestream"
        key="livestream"
        element={
            <PrivateWrapper>
                <LivestreamPage />
            </PrivateWrapper>
        }
    />,
    <Route
        path="/group"
        key="group"
        element={
            <PrivateWrapper>
                <GroupLayout>
                    <Groups />
                </GroupLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/profile"
        key="profile"
        element={
            <PrivateWrapper>
                <ProfileLayout>
                    <Profile />
                </ProfileLayout>
            </PrivateWrapper>
        }
    />
];