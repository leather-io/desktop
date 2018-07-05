// @flow
import { 
	WALLET_TYPE,
	SET_NAME,
	CREATE_NEW_SEED,
	SET_ADDRESS,
	USE_HARDWARE_WALLET,
	SET_HARDWARE_ERROR,
	SET_PAYLOAD,
  ERASE_SEED
} from '../actions/wallet';

export type walletStateType = {
	wallet: {
		name: string,
		+walletType: string,
		+seed: string,
	  +address: string,
	  +publicKey: string,
	  +error: string,
	  +payload: string
	}
};

type actionType = {
  +type: string,
};

export const initialState = {
	name: null,
	walletType: null,
  seed: null,
  address: null,
  publicKey: null,
  error: null,
  payload: null
}

export default function wallet(state = initialState, action: actionType) {
  switch (action.type) {
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
    case ERASE_SEED:
      return {
        ...state,
        seed: '',
      }
    default:
      return state;
  }
}
