import isUndefined from 'lodash/isUndefined'
import { socketActions, selectIsSocketConnected, selectMessagesInQueue } from './socketSlice'
import { 
  socketBlockReceived,
  socketBlocksReceived } from './blocksSlice'
import { 
  selectSessionCurrent,
  socketSessionReceived } from './sessionsSlice'
import { 
  socketValidatorReceived,
  socketValidatorsReceived,
  selectValidatorBySessionAndAddress,
} from './validatorsSlice'
import { 
  socketParachainsReceived,
} from './parachainsSlice'
import {
  selectValidatorBySessionAndAuthId
} from './authoritiesSlice';
import {
  selectAddress,
  selectChain
} from '../chain/chainSlice';
import {
  selectPage,
} from '../layout/layoutSlice';
// import apiSlice from './apiSlice';
import { 
  getNetworkHost
} from '../../constants'


const dispatchValidator = (store, address, method = 'subscribe') => {
  const msg = JSON.stringify({ method: `${method}_validator`, params: [address] });
  store.dispatch(socketActions.messageQueued(msg));
  const currentSession = selectSessionCurrent(store.getState());
  const validator = selectValidatorBySessionAndAddress(store.getState(), currentSession, address);
  if (!!validator && validator.is_para) {
    const addresses = validator.para.peers.map((peer) => {
      const validatorPeer = selectValidatorBySessionAndAuthId(store.getState(), currentSession, peer);
      return validatorPeer.address
    })
    const msg = JSON.stringify({ method: `${method}_validator`, params: addresses });
    store.dispatch(socketActions.messageQueued(msg))
  }
}

const initWebsocket = (store) => {
  
  const chainName = selectChain(store.getState())
  // const protocol = document.location.protocol === 'http:' ? 'ws:' : 'wss:'
  const protocol = getNetworkHost(chainName).includes("localhost") ? 'ws:' : 'wss:';
  const adjustedUrl = `${protocol}//${getNetworkHost(chainName)}/api/v1/ws`
  const socket = new WebSocket(adjustedUrl);
  
  // verify if there are any queued messages and dispatch
  const intervalId = setInterval(() => {
    if (selectMessagesInQueue(store.getState())) {
      store.dispatch(socketActions.messagesDispatched(socket))
    }
  }, 1000)

  // listen to onopen event
  socket.onopen = () => {
    console.log(`websocket opened on ${socket.url}`);
    store.dispatch(socketActions.connectionEstablished());
  }

  // listen to onmessage event
  socket.onmessage = event => {
    // console.log("onmessage", event)
    try {
      if (event.data){
        const message = JSON.parse(event.data)
        switch (message.type) {
          case 'block': {
            store.dispatch(socketBlockReceived(message.result))
            break
          }
          case 'blocks': {
            store.dispatch(socketBlocksReceived(message.result))
            break
          }
          case 'session': {
            store.dispatch(socketSessionReceived(message.result))
            break
          }
          case 'validator': {
            store.dispatch(socketValidatorReceived(message.result))
            break
          }
          case 'validators': {
            store.dispatch(socketValidatorsReceived(message.result))
            break
          }
          case 'parachains': {
            store.dispatch(socketParachainsReceived(message.result))
            break
          }
          default:
            break
        }
      }
    }
    catch (err) {
      console.warn(err)
    }
  }
  
    
  // listen to onclose event
  socket.onclose = event => {
    console.warn("websocket closed:", event)
    store.dispatch(socketActions.connectionClosed());
    // clear previous interval and start a new connection
    if (intervalId) {
      clearInterval(intervalId)
    }
    setTimeout(() => {
      initWebsocket(store)
    }, 2000)
  }

  // listen to onerror event
  socket.onerror = event => {
    console.warn("websocket error: ", event)
  }

  return socket;

}

const socketMiddleware = (store) => {
  if (window["WebSocket"]) {
    
    initWebsocket(store);

    return (next) => {
      return (action) => {
        // unsubscribe to address and peers previously subscribed
        if (action.type === 'chain/addressChanged') {
          const currentSession = selectSessionCurrent(store.getState());
          const previousAddress = selectAddress(store.getState())
          const previousValidator = selectValidatorBySessionAndAddress(store.getState(), currentSession, previousAddress);
          const nextAddress = action.payload;
          const nextValidator = selectValidatorBySessionAndAddress(store.getState(), currentSession, nextAddress);
          const isConnected = selectIsSocketConnected(store.getState())
          if (isConnected) {
            if (previousAddress !== nextAddress.payload && 
              !isUndefined(previousValidator) && 
              !isUndefined(nextValidator) && 
              previousValidator.is_para && nextValidator.is_para && 
              previousValidator.para.group !== nextValidator.para.group) {
              // NOTE: Only unsubscribe if address is in a different val. group
              dispatchValidator(store, previousAddress, "unsubscribe");
            }
          }
        }
        // unsubscribe to address and peers previously subscribed
        if (action.type === 'layout/pageChanged') {
          const nextPage = action.payload;
          const previousPage = selectPage(store.getState())
          const currentSession = selectSessionCurrent(store.getState());
          const currentAddress = selectAddress(store.getState())
          switch (previousPage) {
            case 'parachains/overview': {
              const msg = JSON.stringify({ method: 'unsubscribe_parachains', params: [currentSession.toString()] });
              store.dispatch(socketActions.messageQueued(msg))
              break
            }
            case 'parachains/val-groups': {
              break
            }
            case `validator/${currentAddress}`: {
              dispatchValidator(store, currentAddress, "unsubscribe");
              break
            }
            default:
              break
          }
          // switch (nextPage) {
          //   case 'parachains/val-group': {
          //     const isHistoryMode = selectIsHistoryMode(store.getState());
          //     if (isHistoryMode) {
          //       // get summary data for the selected address for the last X sessions
          //       // const selectedAddress = selectAddress(store.getState())
          //       // const chainName = selectChain(store.getState())
          //       // const maxSessions = getMaxHistorySessions(chainName);
          //       // store.dispatch(apiSlice.endpoints.getValidators.initiate({address: selectedAddress, number_last_sessions: maxSessions, show_summary: true, show_stats: false, fetch_peers: true }, {forceRefetch: true}))
          //       // // get all validators summary for the selected session (useful to get the comparison stats)
          //       // const historySession = selectSessionHistory(store.getState());
          //       // store.dispatch(apiSlice.endpoints.getValidators.initiate({session: historySession, role: "para_authority", show_summary: true}, {forceRefetch: true}));
          //     }
          //     break
          //   }
          //   default:
          //     break
          // }
        }
        // subscribe/unsubscribe all subscriptions
        if (action.type === 'layout/modeChanged') {
          const currentSession = selectSessionCurrent(store.getState());
          const currentPage = selectPage(store.getState());
          switch (currentPage) {
            case 'parachains/overview': {
              // if (action.payload === 'History') {
              //   let msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [currentSession.toString()] });
              //   store.dispatch(socketActions.messageQueued(msg))
              //   msg = JSON.stringify({ method: 'unsubscribe_parachains', params: [currentSession.toString()] });
              //   store.dispatch(socketActions.messageQueued(msg))
              // } else if (action.payload === 'Live') {
              //   let msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [currentSession.toString()] });
              //   store.dispatch(socketActions.messageQueued(msg));
              //   msg = JSON.stringify({ method: 'subscribe_parachains', params: [currentSession.toString()] });
              //   store.dispatch(socketActions.messageQueued(msg))
              // }
              break
            }
            case 'parachains/val-groups': {
              // if (action.payload === 'History') {
              //   let msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [currentSession.toString()] });
              //   store.dispatch(socketActions.messageQueued(msg))
              // } else if (action.payload === 'Live') {
              //   let msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [currentSession.toString()] });
              //   store.dispatch(socketActions.messageQueued(msg));
              // }
              break
            }
            // case 'parachains/val-group': {
            //   if (action.payload === 'History') {
            //     // // unsubscribe
            //     // dispatchValidator(store, "unsubscribe");
            //     // let msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [currentSession.toString()] });
            //     // store.dispatch(socketActions.messageQueued(msg))

            //     // get summary data for the selected address for the last X sessions
            //     // const selectedAddress = selectAddress(store.getState())
            //     // const chainName = selectChain(store.getState())
            //     // const maxSessions = getMaxHistorySessions(chainName);
            //     // store.dispatch(apiSlice.endpoints.getValidators.initiate({address: selectedAddress, number_last_sessions: maxSessions, show_summary: true, show_stats: false, fetch_peers: true }, {forceRefetch: true}))

            //   } else if (action.payload === 'Live') {
            //     // dispatchValidator(store, "subscribe");
            //     // let msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [currentSession.toString()] });
            //     // store.dispatch(socketActions.messageQueued(msg));
            //   }
            //   break
            // }
            default:
              break
          }
        }
        // unsubscribe to address and peers previously subscribed
        // if (action.type === 'sessions/sessionChanged') {
        //   const sessionSelected = selectSessionSelected(store.getState())
        //   const session_index = !!sessionSelected ? sessionSelected : "current"
        //   const msg = JSON.stringify({ method: 'unsubscribe_para_authorities', params: [session_index.toString()] });
        //   store.dispatch(socketActions.messageQueued(msg))
        // }


        const result = next(action);
        // console.log('next state', store.getState());
        return result;
      }
    }
  }
  else {
    console.warn("Your browser does not support WebSockets.")
  }
}
 
export default socketMiddleware;