import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

import { useNavigate } from 'react-router-dom';
import {
  deleteConstructorItems,
  deleteOrderModal,
  orderBurgerApiThunk,
  selectConstructorItems,
  selectIsAuthenticated,
  selectOrderModalData,
  selectOrderRequest
} from '@slices';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuth = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredientForOrder = [
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
      constructorItems.bun._id
    ];

    isAuth
      ? dispatch(orderBurgerApiThunk(ingredientForOrder))
      : navigate('/login');
  };

  const closeOrderModal = () =>
    !orderRequest &&
    (dispatch(deleteOrderModal()),
    dispatch(deleteConstructorItems()),
    navigate('/'));

  const price = useMemo(() => {
    const res = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TIngredient) => sum + ingredient.price,
      0
    );
    return (constructorItems.bun ? constructorItems.bun.price * 2 : 0) + res;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
