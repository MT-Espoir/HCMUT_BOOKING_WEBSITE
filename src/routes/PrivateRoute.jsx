import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @param {ReactNode} children - Nội dung cần bảo vệ
 * @param {string} redirectPath - Trang sẽ redirect nếu chưa login
 */
const PrivateRoute = ({ children, redirectPath = '/' }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
