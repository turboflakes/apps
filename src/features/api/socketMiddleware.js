import { socketActions, selectIsSocketConnected } from './socketSlice'
import { socketBlockReceived } from './blocksSlice'
import { selectSessionsAll, socketSessionReceived } from './sessionsSlice'
import { 
  socketValidatorReceived,
  socketValidatorsReceived,
  selectValidatorsAll } from './validatorsSlice'
import {
  selectAddress
} from '../chain/chainSlice';
import {
  selectPage
} from '../layout/layoutSlice';


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
      store.dispatch(socketActions.submitMessage(msg))
    } else {
      const msg = JSON.stringify({ method: "unsubscribe_validator", params: [previous_address] });
      store.dispatch(socketActions.submitMessage(msg))
    }
  }
}

const socketMiddleware = (store) => {
  if (window["WebSocket"]) {
    // TODO get connected chain from store
    let socket = new WebSocket('ws://localhost:5010/api/v1/ws')

    // listen to onopen event
    socket.onopen = () => {
      console.log(`websocket opened on ${socket.url}`);
      store.dispatch(socketActions.connectionEstablished());
    }

    // listen to onclose event
    socket.onclose = event => {
      console.warn("websocket closed: ", event.message)
      // TODO retry start a new connection
      // clearTimeout(retryInterval)
      // retryInterval = setTimeout(()=>startWebSocket(store), 5000)
    }

    // listen to onerror event
    socket.onerror = event => {
      console.warn("websocket error: ", event.message)    
      // TODO handle socket error
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

    return (next) => {
      return (action) => {
        // console.log('dispatching', action);
        if (action.type === 'socket/submitMessage') {
          socket.send(action.payload);
        }
        // unsubscribe to address and peers previously subscribed
        if (action.type === 'chain/addressChanged') {
          const isConnected = selectIsSocketConnected(store.getState())
          if (isConnected) {
            unsubscribeValidator(store)
          }
        }
        // unsubscribe to address and peers previously subscribed
        if (action.type === 'layout/pageChanged') {
          const previous_page = selectPage(store.getState())
          const sessions = selectSessionsAll(store.getState())
          const session = sessions[sessions.length-1]
          switch (previous_page) {
            case 'parachains/overview': {
              const msg = JSON.stringify({ method: 'unsubscribe_para_authorities', params: [session.six.toString()] });
              store.dispatch(socketActions.submitMessage(msg))
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