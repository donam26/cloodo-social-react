import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import NotFound from './pages/NotFound';
import publicRoutes from './routes/Public';
import privateRoutes from './routes/Private';
function App() {
  return (
    <Router>
      <Routes>
        {publicRoutes}
        {privateRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
