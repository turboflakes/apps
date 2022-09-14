import { socketActions, selectIsSocketConnected, selectMessagesInQueue } from './socketSlice'
import { socketBlockReceived } from './blocksSlice'
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
  selectPage
} from '../layout/layoutSlice';
import apiSlice from './apiSlice';
import { getNetworkHost, getMaxHistorySessions } from '../../constants'


const dispatchValidator = (store, method = 'subscribe') => {
  const selectedAddress = selectAddress(store.getState())
  const msg = JSON.stringify({ method: `${method}_validator`, params: [selectedAddress] });
  store.dispatch(socketActions.messageQueued(msg));
  const currentSession = selectSessionCurrent(store.getState());
  const validator = selectValidatorBySessionAndAddress(store.getState(), currentSession, selectedAddress);
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
  const protocol = document.location.protocol === 'http:' ? 'ws:' : 'wss:'
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
          case 'best_block': {
            store.dispatch(socketBlockReceived(message.result))
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
          const isConnected = selectIsSocketConnected(store.getState())
          if (isConnected) {
            dispatchValidator(store, "unsubscribe");
          }
        }
        // unsubscribe to address and peers previously subscribed
        if (action.type === 'layout/pageChanged') {
          const previousPage = selectPage(store.getState())
          const currentSession = selectSessionCurrent(store.getState());
          switch (previousPage) {
            case 'parachains/overview': {
              const msg = JSON.stringify({ method: 'unsubscribe_parachains', params: [currentSession.toString()] });
              store.dispatch(socketActions.messageQueued(msg))
              break
            }
            case 'parachains/val-groups': {
              break
            }
            case 'parachains/val-group': {
              dispatchValidator(store, "unsubscribe");
              break
            }
            default:
              break
          }
        }
        // subscribe/unsubscribe all subscriptions
        if (action.type === 'layout/modeChanged') {
          const currentSession = selectSessionCurrent(store.getState());
          const currentPage = selectPage(store.getState());
          switch (currentPage) {
            case 'parachains/overview': {
              if (action.payload === 'History') {
                let msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg))
                msg = JSON.stringify({ method: 'unsubscribe_parachains', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg))
              } else if (action.payload === 'Live') {
                let msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg));
                msg = JSON.stringify({ method: 'subscribe_parachains', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg))
              }
              break
            }
            case 'parachains/val-groups': {
              if (action.payload === 'History') {
                let msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg))
              } else if (action.payload === 'Live') {
                let msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg));
              }
              break
            }
            case 'parachains/val-group': {
              if (action.payload === 'History') {
                // unsubscribe
                dispatchValidator(store, "unsubscribe");
                let msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg))

                // get summary data for the selected address for the last X sessions
                const selectedAddress = selectAddress(store.getState())
                const chainName = selectChain(store.getState())
                const maxSessions = getMaxHistorySessions(chainName);
                store.dispatch(apiSlice.endpoints.getValidators.initiate({address: selectedAddress, number_last_sessions: maxSessions, show_summary: true, show_stats: true }, {forceRefetch: true}))

              } else if (action.payload === 'Live') {
                dispatchValidator(store, "subscribe");
                let msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg));
              }
              break
            }
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