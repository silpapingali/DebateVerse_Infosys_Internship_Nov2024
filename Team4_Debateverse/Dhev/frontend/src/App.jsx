import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Layout from './components/Layout';
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CreateDebate from "./pages/CreateDebate";
import Debates from './pages/Debates';
import DebateDetail from './pages/DebateDetail';
import UserDebates from './pages/UserDebates';
import LoadingSpinner from "./components/LoadingSpinner";
import { store } from './store';
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Provider } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    if (!user.isVerified) {
        return <Navigate to='/verify-email' replace />;
    }

    return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user.isVerified) {
        return <Navigate to='/' replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    // Check if the current path matches login or signup
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'|| location.pathname === '/verify-email'|| location.pathname === '/forgot-password' || location.pathname === ' reset-password/:token';

    return (
        <Provider store={store}>
            <div
                className={`${
                    isAuthPage
                        ? 'min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'
                        : ''
                }`}
            >
              
                    <>
                        <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                        <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
                        <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
                    </>
            
                <Routes>
                <Route
                        path='/login'
                        element={
                            <RedirectAuthenticatedUser>
                                <LoginPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route element={<Layout />}>
                        <Route path='/' element={<DashboardPage />} />
                        <Route path="/debates" element={<Debates />} />
                        <Route path="/debates/:id" element={<DebateDetail />} />
                        <Route path="/create" element={<CreateDebate />} />
                        <Route path="/user/:username" element={<UserDebates />} />
                    </Route>
                    <Route
                        path='/signup'
                        element={
                            <RedirectAuthenticatedUser>
                                <SignUpPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    
                    <Route path='/verify-email' element={<EmailVerificationPage />} />
                    <Route
                        path='/forgot-password'
                        element={
                            <RedirectAuthenticatedUser>
                                <ForgotPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path='/reset-password/:token'
                        element={
                            <RedirectAuthenticatedUser>
                                <ResetPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    {/* catch all routes */}
                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
                <Toaster />
            </div>
        </Provider>
    );
}

export default App;
