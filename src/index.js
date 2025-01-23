import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactQueryProvider from './providers/ReactQueryProvider';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ReactQueryProvider>
    <Provider store={store}>
        <App />
      </Provider>
    </ReactQueryProvider>
  </React.StrictMode>
);

reportWebVitals();
