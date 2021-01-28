import * as yup from 'yup';

export function stxAmountSchema() {
  return yup
    .number()
    .required('Enter an amount of STX')
    .positive('You cannot Stack a negative quantity of STX')
    .typeError('STX amount must be a number');
}
