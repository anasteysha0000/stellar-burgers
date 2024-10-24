// ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@slices';

type ProtectedRouteProps = {
  OnlyAuth?: boolean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  OnlyAuth = false
}) => {
  const location = useLocation();
  const isAuthorized = useSelector(selectIsAuthenticated);
  const from = location.state?.from || '/';

  if (!OnlyAuth && isAuthorized) {
    return <Navigate to={from} />;
  }

  if (OnlyAuth && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <Outlet />;
};
