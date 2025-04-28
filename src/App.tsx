import React, { FC, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { HomePage } from './pages/HomePage/HomePage';

const App: FC = () => {
  const isAuth = useSelector((state: any) => state.auth.isAuth);

  useEffect(() => {}, [isAuth]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#4d1d88',
        light: '#62727b'
      },
      secondary: {
        main: '#f8bbd0',
        light: '#efebe9'
      }
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/"
            element={isAuth ? <Navigate to="home" /> : <Navigate to="login" />}
          />
          <Route
            path="login"
            element={isAuth ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="home"
            element={!isAuth ? <Navigate to="/" replace /> : <HomePage />}
          />
        </Routes>
        <ToastContainer
          progressClassName="toastProgressBar"
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ThemeProvider>
    </div>
  );
};

export default App;
