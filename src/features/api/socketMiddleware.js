import { useSelector } from 'react-redux';
import { socketActions } from './socketSlice'
import { socketBlockReceived } from './blocksSlice'
import { socketSessionReceived } from './sessionsSlice'
import { 
  socketValidatorReceived,
  useGetValidatorByStashQuery,
  selectValidatorsAll } from './validatorsSlice'
  import {
    selectAddress
  } from '../chain/chainSlice';

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
              store.dispatch(socketSessionReceived(message.result.session))
              break
            }
            case 'validator': {
              store.dispatch(socketValidatorReceived(message.result.validator))
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
          const allValidators = selectValidatorsAll(store.getState())
          const address = selectAddress(store.getState())
          if (address) {
            const previous = allValidators.find(o => o.auth.address === address)
            if (!!previous && previous.is_para) {
              const addresses = [
                address,
                ...allValidators.filter(o => previous.para.peers.includes(o.auth.index)).map(o => o.auth.address)
              ];
              const msg = JSON.stringify({ method: "unsubscribe_validator", params: addresses });
              store.dispatch(socketActions.submitMessage(msg))
            } else {
              const msg = JSON.stringify({ method: "unsubscribe_validator", params: [address] });
              store.dispatch(socketActions.submitMessage(msg))
            }
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