import zxcvbn, { ZXCVBNResult } from 'zxcvbn';
import { validatePassword } from './validate-password';

jest.mock('zxcvbn', () => jest.fn(() => ({ score: 4 })));

const badPassword = 'password';

describe(validatePassword.name, () => {
  test('that zxcvbn is called', () => {
    validatePassword(badPassword);
    expect(zxcvbn).toHaveBeenCalledWith(badPassword);
  });

  test('password of < 12 char length is invalid', () => {
    const result = validatePassword(badPassword);
    expect(result.meetsLengthRequirement).toBeFalsy();
  });

  test('really long passwords are truncated to 100chars', () => {
    const reallyLongPw = [
      '786293ebd1d043b685cd4d360d5c731d',
      '9a47843cdc1b49c0992f7fa63a8c671a',
      'd5515430068043fbb7200e6a71f05a42',
      '6cfab267043f4265a52120f7174bd553',
      '8b94e6678d8440eab7fb4dd0a5eae7ef',
      'bdd440b629e34307b1aeebf0722cfccd',
      '47c4f0539b7348ed81710cfeb50c1e2a',
      'ec57a8cc23334e1e962e6441871626c3',
      '4460527a5e10406796b4174c4dd979ed',
    ]
      .join('')
      .toString();
    validatePassword(reallyLongPw);
    expect(zxcvbn).toHaveBeenCalledWith(reallyLongPw.substr(0, 100));
  });
});
