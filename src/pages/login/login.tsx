import { FC, useEffect, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import {
  loginUserThunk,
  getUserApiThunk,
  selectUserError,
  selectIsAuthenticated
} from '@slices';
import store, { useDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const errorText = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUserThunk({ email: email, password: password }));
  };

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
