import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { getCurrentUser } from './store/slices/authSlice';
// import websocketService from './services/websocket';
import websocketService from './mocks/mockWebsocket';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import TicketList from './components/features/ticket/TicketList';
import TicketDetail from './components/pages/TicketDetail';
import TicketForm from './components/features/ticket/TicketForm';
import NotFound from './components/pages/NotFound';

// Components
import ProtectedRoute from './common/ProtectedRoute';
import { UserRole } from './types';

// Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#e91e63',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
      websocketService.connect();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [dispatch, token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/login'
              element={
                isAuthenticated ? <Navigate to='/' replace /> : <Login />
              }
            />

            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute
                    allowedRoles={[UserRole.ADMIN, UserRole.AGENT]}
                  >
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path='tickets' element={<TicketList />} />

              <Route
                path='tickets/new'
                element={
                  <ProtectedRoute>
                    <div style={{ padding: '20px' }}>
                      <TicketForm
                        onSubmit={(data) => {
                          console.log(data);
                          // In a real app, dispatch createTicket action here
                        }}
                      />
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path='tickets/:id'
                element={
                  <ProtectedRoute>
                    <TicketDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path='users'
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <div>Users Management (Admin Only)</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path='settings'
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <div>Settings (Admin Only)</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path='profile'
                element={
                  <ProtectedRoute>
                    <div>User Profile</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path='notifications'
                element={
                  <ProtectedRoute>
                    <div>All Notifications</div>
                  </ProtectedRoute>
                }
              />

              <Route path='*' element={<NotFound />} />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
