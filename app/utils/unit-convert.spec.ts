import { toHumanReadableStx, microStxToStx, stxToMicroStx } from './unit-convert';
import BN from 'bn.js';

describe(microStxToStx.name, () => {
  test('given some numerical inputs it outs a known-correct formatting', () => {
    expect(microStxToStx(1).toNumber()).toEqual(0.000001);
    expect(microStxToStx(2).toNumber()).toEqual(0.000002);
    expect(microStxToStx(298234).toNumber()).toEqual(0.298234);
    expect(microStxToStx(1000000).toNumber()).toEqual(1);
    expect(microStxToStx(1000000000).toNumber()).toEqual(1000);
    expect(microStxToStx(999999).toNumber()).toEqual(0.999999);
    expect(microStxToStx(999999999).toNumber()).toEqual(999.999999);
    expect(microStxToStx('1000000000001').toNumber()).toEqual(1000000.000001);
  });

  test('error is thrown when a decimal value is passed', () => {
    expect(() => microStxToStx(0.1)).toThrowError();
  });

  test('BN values are accepted', () => {
    expect(microStxToStx(new BN('10000001')).toNumber()).toEqual(10.000001);
  });
});

describe(stxToMicroStx.name, () => {
  test('it converts an amount of stx into micro units', () => {
    expect(stxToMicroStx(1).toNumber()).toEqual(1000000);
    expect(stxToMicroStx(2).toNumber()).toEqual(2000000);
    expect(stxToMicroStx(1000000).toNumber()).toEqual(1000000000000);
    expect(stxToMicroStx('99999').toNumber()).toEqual(99999000000);
  });
});

describe(toHumanReadableStx.name, () => {
  test('it presents numbers correctly according to en-US locale', () => {
    expect(toHumanReadableStx('1000000000001')).toEqual('1,000,000.000001 STX');
    expect(toHumanReadableStx('1')).toEqual('0.000001 STX');
    expect(toHumanReadableStx('100123435')).toEqual('100.123435 STX');
    expect(toHumanReadableStx('9876543210001')).toEqual('9,876,543.210001 STX');
    expect(toHumanReadableStx('111111111111111')).toEqual('111,111,111.111111 STX');
    expect(toHumanReadableStx('9999999999999998')).toEqual('9,999,999,999.999998 STX');
    expect(toHumanReadableStx('9999999999999999')).toEqual('9,999,999,999.999999 STX');
    expect(toHumanReadableStx('999999999999999999998')).toEqual('999,999,999,999,999.999998 STX');
  });
});
