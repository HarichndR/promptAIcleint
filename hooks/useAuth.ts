import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user, loading, logout, openAuthModal } = useAuthContext();
  
  const requireAuth = (action: () => void) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    action();
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    requireAuth,
    isAdmin: user?.role === 'admin',
    logout,
    openAuthModal,
  };
};
