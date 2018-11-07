// @flow
import { 
	WALLET_TYPE,
  CREATE_WALLET,
	SET_NAME,
	CREATE_NEW_SEED,
	SET_ADDRESS,
  UPDATE_BALANCE,
	USE_HARDWARE_WALLET,
	SET_HARDWARE_ERROR,
	SET_PAYLOAD,
  ERASE_DATA,
  ERASE_SEED,
  ACCEPT_TERMS
} from '../actions/wallet';

export type walletStateType = {
	wallet: {
		name: string,
    +created: bool,
		+walletType: string,
		+seed: string,
	  +address: string,
    +btcAddress: string,
    +stacksBalance: number,
    +btcBalance: number,
	  +publicKey: string,
	  +error: string,
	  +payload: string,
    +termsAccepted: bool
	}
};

type actionType = {
  +type: string,
};

export const initialState = {
	name: null,
  created: false,
	walletType: null,
  seed: null,
  address: null,
  btcAddress: null,
  stacksBalance: null,
  btcBalance: null,
  publicKey: null,
  error: null,
  payload: null,
  termsAccepted: false,
}

export default function wallet(state = initialState, action: actionType) {
  switch (action.type) {
    case CREATE_WALLET:
      return {
        ...state,
        address: action.stacksAddress,
        btcAddress: action.btcAddress,
        walletType: action.walletType,
        created: true
      }
  	case SET_NAME:
  		return { 
  			...state, 
  			name: action.name 
  		}
    case CREATE_NEW_SEED:
      return { 
      	...state, 
      	walletType: WALLET_TYPE.NORMAL,
      	seed: action.seed, 
      	address: action.address, 
      	publicKey: action.publicKey, 
      }
    case SET_ADDRESS:
    	return {
    		...state,
    		address: action.address
    	}
    case UPDATE_BALANCE:
      return {
        ...state,
        stacksBalance: action.stacksBalance,
        btcBalance: action.btcBalance
      }
    case USE_HARDWARE_WALLET:
      return { 
      	...state, 
      	walletType: WALLET_TYPE.HARDWARE,
      	address: action.address, 
      	publicKey: action.publicKey 
      }
    case SET_HARDWARE_ERROR:
    	return { 
    		...state, 
    		error: action.error 
    	}
    case SET_PAYLOAD:
    	return { 
    		...state, 
    		payload: action.payload
    	}
    case ERASE_DATA:
      return { 
        ...initialState, 
        termsAccepted: true
      }
    case ERASE_SEED:
      return {
        ...state,
        seed: '',
      }
    case ACCEPT_TERMS:
      return {
        ...state,
        termsAccepted: true
      }
    default:
      return state;
  }
}
