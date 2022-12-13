import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Ethereum',
  'Bitcoin',
  'Tether',
  'Binance Coin',
  'USDC',
  'XRP',
  'Dogecoin',
  'Cardano',
 
];
const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

const products = [...Array(8)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: `/assets/images/products/product_${setIndex}.jpg`,
    name: PRODUCT_NAME[index],
    price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
    priceSale: setIndex % 3 ? null : null,
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 0)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(0, 0)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(0, 0)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(0, 0)) ||
      (setIndex === 23 && PRODUCT_COLOR.slice(0, 0)) ||
      (setIndex === 24 && PRODUCT_COLOR.slice(0, 0)) ||
      PRODUCT_COLOR,
    status: sample(['sale', 'new', '', '']),
  };
});

export default products;
