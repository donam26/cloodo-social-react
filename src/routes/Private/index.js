import { Route, Navigate, useLocation } from "react-router-dom";
import Home from "../../pages/Home";
import Messenger from "../../pages/Messenger";
import Groups from "../../pages/Groups";
import Profile from "../../pages/Profile";
import HomeLayout from "../../layouts/Home";
import MessengerLayout from "../../layouts/Messenger";
import FriendLayout from "../../layouts/Friend";
import GroupLayout from "../../layouts/Group";
import SearchLayout from "../../layouts/Search";
import ProfileLayout from "../../layouts/Profile";
import ProfileDetail from "../../pages/Profile/Detail";
import FriendPage from "../../pages/Friend";
import LivestreamPage from "../../pages/Livestream";
import VideoPage from "../../pages/Video";
import VideoLayout from "../../layouts/Video";
import SearchPage from "../../pages/Search";
import PostDetail from "../../pages/PostDetail";
import GroupDetailPage from "../../pages/Groups/Detail";
import YourGroups from "../../pages/Groups/YourGroups";
import LivestreamLayout from "../../layouts/Livestream";
import CreateLivestream from "../../pages/Livestream/Create";
import LiveStudioPage from "../../pages/Livestream/Studio";
import WatchLiveStreamPage from "../../pages/Livestream/Watch";

const PrivateWrapper = ({ children }) => {
    const location = useLocation();
    const userData = localStorage.getItem('user_data');

    // Nếu đang ở trang login và có token trong URL, cho phép render
    if (location.pathname === '/login' && location.search.includes('token=')) {
        return children;
    }
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
        path="/messenger/:id"
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
        path="/livestreams"
        key="livestream"
        element={
            <PrivateWrapper>
                <LivestreamLayout>
                    <LivestreamPage />
                </LivestreamLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/livestreams/create"
        key="livestream-create"
        element={
            <PrivateWrapper>
                <LivestreamLayout>
                    <CreateLivestream />
                </LivestreamLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/livestreams/studio"
        key="livestream-studio"
        element={
            <PrivateWrapper>
                <LivestreamLayout>
                    <LiveStudioPage />
                </LivestreamLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/livestreams/watch/:channelName"
        key="livestream-watch"
        element={
            <PrivateWrapper>
                <LivestreamLayout>
                    <WatchLiveStreamPage />
                </LivestreamLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/groups"
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
        path="/groups/discover"
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
        path="/groups/your-groups"
        key="your-groups"
        element={
            <PrivateWrapper>
                <GroupLayout>
                    <YourGroups />
                </GroupLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/groups/:groupId"
        key="group"
        element={
            <PrivateWrapper>
                <GroupLayout>
                    <GroupDetailPage />
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
    />,
    <Route
        path="/profile/:id"
        key="profile"
        element={
            <PrivateWrapper>
                <ProfileLayout>
                    <ProfileDetail />
                </ProfileLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/search"
        key="search"
        element={
            <PrivateWrapper>
                <SearchLayout>
                    <SearchPage />
                </SearchLayout>
            </PrivateWrapper>
        }
    />,
    <Route
        path="/posts/:id"
        key="posts"
        element={
            <PrivateWrapper>
                <PostDetail />
            </PrivateWrapper>
        }
    />
];