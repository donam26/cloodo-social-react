import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import NotFound from './pages/NotFound';
import { publicRoutes } from './routes/Public';
import { privateRoutes } from './routes/Private';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {publicRoutes}
          {privateRoutes}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
