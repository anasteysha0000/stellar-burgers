import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { useDispatch } from '../../services/store';
import { getUserApiThunk, loadIngredients } from '@slices';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(getUserApiThunk());
    dispatch(loadIngredients());
  }, [dispatch]);

  const getOrderNumberFromPath = (path: string) =>
    path
      .split('/')
      .filter(Boolean)
      .find((part) => /^\d+$/.test(part)) || '';

  const handleModalClose = (fallbackPath: string) => {
    if (backgroundLocation) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title='Детали ингредиента'
              onClose={() => handleModalClose('/')}
            >
              <IngredientDetails />
            </Modal>
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal
              title={`#${getOrderNumberFromPath(location.pathname)}`}
              onClose={() => handleModalClose('/feed')}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route element={<ProtectedRoute OnlyAuth={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute OnlyAuth />}>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route
              path='orders/:number'
              element={
                <Modal
                  title={`#${getOrderNumberFromPath(location.pathname)}`}
                  onClose={() => handleModalClose('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${getOrderNumberFromPath(location.pathname)}`}
                onClose={() => navigate(-1)}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute OnlyAuth />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title={`#${getOrderNumberFromPath(location.pathname)}`}
                  onClose={() => handleModalClose('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
