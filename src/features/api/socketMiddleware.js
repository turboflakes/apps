import { socketActions, selectIsSocketConnected, selectMessagesInQueue } from './socketSlice'
import { socketBlockReceived } from './blocksSlice'
import { 
  selectSessionCurrent,
  socketSessionReceived } from './sessionsSlice'
import { 
  socketValidatorReceived,
  socketValidatorsReceived,
  selectValidatorsAll } from './validatorsSlice'
import {
  selectAddress,
  selectChain
} from '../chain/chainSlice';
import {
  selectPage
} from '../layout/layoutSlice';
import { getNetworkHost } from '../../constants'


const unsubscribeValidator = (store) => {
  const previous_address = selectAddress(store.getState())
  const allValidators = selectValidatorsAll(store.getState())
  if (previous_address) {
    const principal = allValidators.find(o => o.address === previous_address)
    if (!!principal && principal.is_para) {
      const addresses = [
        previous_address,
        ...allValidators.filter(o => principal.para.peers.includes(o.auth.aix)).map(o => o.address)
      ];
      const msg = JSON.stringify({ method: "unsubscribe_validator", params: addresses });
      store.dispatch(socketActions.messageQueued(msg))
    } else {
      const msg = JSON.stringify({ method: "unsubscribe_validator", params: [previous_address] });
      store.dispatch(socketActions.messageQueued(msg))
    }
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
            unsubscribeValidator(store)
          }
        }
        // unsubscribe to address and peers previously subscribed
        if (action.type === 'layout/pageChanged') {
          const previousPage = selectPage(store.getState())
          const currentSession = selectSessionCurrent(store.getState());
          switch (previousPage) {
            case 'parachains/overview': {
              const msg = JSON.stringify({ method: 'unsubscribe_para_authorities', params: [currentSession.toString()] });
              store.dispatch(socketActions.messageQueued(msg))
              break
            }
            case 'parachains/val-group': {
              unsubscribeValidator(store)
              break
            }
            default:
              break
          }
        }
        // subscribe/unsubscribe all subscriptions
        if (action.type === 'layout/modeChanged') {
          const currentSession = selectSessionCurrent(store.getState());
          const currentPage = selectPage(store.getState())
          switch (currentPage) {
            case 'parachains/overview': {
              if (action.payload === 'History') {
                const msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [currentSession.toString()] });
                store.dispatch(socketActions.messageQueued(msg))
              } else if (action.payload === 'Live') {
                const msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [currentSession.toString()] });
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