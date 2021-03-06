import { map } from 'lodash';

import { cfe, impot, social } from './config';

export const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);

  return Math.round(number * factor) / factor;
};

export const sum = (accumulator, currentValue) => accumulator + parseFloat(currentValue);

export const subPoucent = (a, b) => {
  if (b === 0) {
    return 0;
  }

  return a - a * (b / 100);
};

export const getRevenue = consultations => {
  const payments = map(consultations, 'payment');
  const revenueNet = payments.reduce(sum, 0);

  const revenueNetDeductCfe = subPoucent(revenueNet, cfe);
  const revenueNetDeductImpot = subPoucent(revenueNetDeductCfe, impot);
  const renvenueNetDeductSocial = subPoucent(revenueNetDeductImpot, social);

  return precisionRound(renvenueNetDeductSocial, 2);
};

export const getExpenses = charges => {
  const amounts = map(charges, 'price');

  return precisionRound(amounts.reduce(sum, 0), 2);
};
