import { IConstructorState } from "@slices";
import { TOrder, TOrdersData, TUser } from "@utils-types";

export const mockIngredients = [
  {
    id: '111111111111111111111111',
    _id: '111111111111111111111111',
    name: 'Звездная булка X-200i',
    type: 'bun',
    proteins: 75,
    fat: 20,
    carbohydrates: 55,
    calories: 400,
    price: 1350,
    image: 'https://code.s3.yandex.net/react/code/bun-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-03-large.png',
    __v: 0
  },
  {
    id: '222222222222222222222222',
    _id: '222222222222222222222222',
    name: 'Мясной бургер из Небулы',
    type: 'main',
    proteins: 390,
    fat: 150,
    carbohydrates: 240,
    calories: 4100,
    price: 450,
    image: 'https://code.s3.yandex.net/react/code/meat-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
    __v: 0
  },
  {
    id: '333333333333333333333333',
    _id: '333333333333333333333333',
    name: 'Соус фирменный космический',
    type: 'sauce',
    proteins: 10,
    fat: 20,
    carbohydrates: 5,
    calories: 100,
    price: 150,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    __v: 0
  }
];


export const mockInitialState: IConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false
};

export const notEmptyState = {
  bun: {
    id: '111111111111111111111111',
    _id: '111111111111111111111111',
    name: 'Звездная булка X-200i',
    type: 'bun',
    proteins: 75,
    fat: 20,
    carbohydrates: 55,
    calories: 400,
    price: 1350,
    image: 'https://code.s3.yandex.net/react/code/bun-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-03-large.png',
    __v: 0
  },
  ingredients: [
    {
      id: '222222222222222222222222',
      _id: '222222222222222222222222',
      name: 'Мясной бургер из Небулы',
      type: 'main',
      proteins: 390,
      fat: 150,
      carbohydrates: 240,
      calories: 4100,
      price: 450,
      image: 'https://code.s3.yandex.net/react/code/meat-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
      __v: 0
    },
    {
      id: '333333333333333333333333',
      _id: '333333333333333333333333',
      name: 'Космическое филе Акулы',
      type: 'main',
      proteins: 40,
      fat: 25,
      carbohydrates: 80,
      calories: 620,
      price: 970,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
      __v: 0
    }
  ]
};

export const mockFeedData: TOrdersData = {
  orders: [
    {
      _id: 'order1',
      ingredients: ['111111111111111111111111', '222222222222222222222222'],
      status: 'done',
      name: 'Order 1',
      createdAt: '2024-10-22T10:30:45.686Z',
      updatedAt: '2024-10-22T10:31:00.608Z',
      number: 1
    },
    {
      _id: 'order2',
      ingredients: ['111111111111111111111111', '333333333333333333333333'],
      status: 'pending',
      name: 'Order 2',
      createdAt: '2024-10-23T08:15:30.686Z',
      updatedAt: '2024-10-23T08:30:00.608Z',
      number: 2
    }
  ],
  total: 100,
  totalToday: 5
};

export const mockOrderData: TOrder = {
  _id: 'order123',
  status: 'done',
  name: 'Burger',
  createdAt: '2024-10-23T08:15:30.686Z',
  updatedAt: '2024-10-23T08:30:00.608Z',
  number: 123,
  ingredients: ['111111111111111111111111']
};

export const mockUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};


export const mockLoginData = {
  email: 'test@example.com',
  password: 'password',
};

export const mockAuthResponse = {
  user: mockUser,
  accessToken: 'access',
  refreshToken: 'refresh',
};
