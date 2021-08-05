import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { sumTxsTotalSpentByAddress } from './tx-utils';

const mempoolTxs: MempoolTransaction[] = [
  {
    tx_id: '0x9f9e1d4505e5c5f7e9b039f537c73e8189bf796d90b3944db000371a041277b2',
    tx_status: 'pending',
    tx_type: 'contract_call',
    receipt_time: 1615994184,
    receipt_time_iso: '2021-03-17T15:16:24.000Z',
    nonce: 0,
    fee_rate: '216',
    sender_address: 'SP6EQ6KBBYWCSD11XNKMS0VGQCPTT0G7PVWPBYW2',
    sponsored: false,
    post_condition_mode: 'deny',
    post_conditions: [],
    anchor_mode: 'any',
    contract_call: {
      contract_id: 'SP000000000000000000002Q6VF78.pox',
      function_name: 'delegate-stx',
      function_signature: '',
    },
  },
  {
    tx_id: '0xf530f0f4b0f6fdddcce1b4f6636f46a1f9ca740d2ce43fd129e095b33290e028',
    tx_status: 'pending',
    tx_type: 'token_transfer',
    receipt_time: 1615994162,
    receipt_time_iso: '2021-03-17T15:16:02.000Z',
    nonce: 5,
    fee_rate: '180',
    sender_address: 'SP6EQ6KBBYWCSD11XNKMS0VGQCPTT0G7PVWPBYW2',
    sponsored: false,
    anchor_mode: 'any',
    post_conditions: [],
    post_condition_mode: 'deny',
    token_transfer: {
      recipient_address: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
      amount: '13700000',
      memo: '0x31303332343230343100000000000000000000000000000000000000000000000000',
    },
  },
  {
    tx_id: '0x1a81cdd02d031fe1ddd0bc419b2e9fb9cf027a26e6ec86a0ca2b3f7070e0a466',
    tx_status: 'pending',
    tx_type: 'token_transfer',
    receipt_time: 1615994030,
    receipt_time_iso: '2021-03-17T15:13:50.000Z',
    nonce: 130,
    fee_rate: '400',
    anchor_mode: 'any',
    post_conditions: [],
    sender_address: 'SP6EQ6KBBYWCSD11XNKMS0VGQCPTT0G7PVWPBYW2',
    sponsored: false,
    post_condition_mode: 'deny',
    token_transfer: {
      recipient_address: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
      amount: '10298970000',
      memo: '0x31303131363839323300000000000000000000000000000000000000000000000000',
    },
  },
];

describe(sumTxsTotalSpentByAddress.name, () => {
  test('it sums a collection of txs correctly', () => {
    const result = sumTxsTotalSpentByAddress(
      mempoolTxs,
      'SP6EQ6KBBYWCSD11XNKMS0VGQCPTT0G7PVWPBYW2'
    );
    expect(result.toNumber()).toEqual(10312670796);
  });
});
