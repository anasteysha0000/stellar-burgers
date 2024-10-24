import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsApiThunk, selectFeedOrders, selectFeedRequest } from '@slices';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedRequest);
  const handleGetFeeds = () => {
    dispatch(getFeedsApiThunk());
  };
  useEffect(() => {
    dispatch(getFeedsApiThunk());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
