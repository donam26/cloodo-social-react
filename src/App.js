import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import NotFound from './pages/NotFound';
import { publicRoutes } from './routes/Public';
import { privateRoutes } from './routes/Private';
import WebSocketProvider from './providers/WebSocketProvider';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          {publicRoutes}
          {privateRoutes}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
