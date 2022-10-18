import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf
} from '@reduxjs/toolkit'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'
import { 
  selectSessionByIndex } from './sessionsSlice'
import { calculateMvr } from '../../util/mvr'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Parachains'],
  endpoints: (builder) => ({
    getParachains: builder.query({
      query: ({session, retry}) => ({
        url: `/parachains`,
        params: { session, retry }
      }),
      providesTags: (result, error, arg) => [{ type: 'Parachains', id: arg }],
      async onQueryStarted(params, { getState, dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // `onSuccess` subscribe for updates
          const session = selectSessionByIndex(getState(), params.session)
          if (session.is_current) {
            let msg = JSON.stringify({ method: 'subscribe_parachains', params: [params.session.toString()] });
            dispatch(socketActions.messageQueued(msg))
            // NOTE: always unsubscribe previous session
            msg = JSON.stringify({ method: 'unsubscribe_parachains', params: [(params.session - 1).toString()] });
            dispatch(socketActions.messageQueued(msg))
          }       
        } catch (err) {
          // `onError` side-effect
          const parsed = parseInt(params.retry, 10);
          const retry = isNaN(parsed) ? 1 : parsed + 1;
          if (retry < 6) {
            setTimeout(() => {
              dispatch(extendedApi.endpoints.getParachains.initiate({session: params.session, retry }))
            }, 1000)
          }
        }
      },
    }),
  }),
})

export const {
  useGetParachainsQuery,
} = extendedApi

// Actions
export const socketParachainsReceived = createAction(
  'parachains/parachainsReceived'
)

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => `${data.session}_${data.pid}`,
})

export const matchParachainsReceived = isAnyOf(
  socketParachainsReceived,
  extendedApi.endpoints.getParachains.matchFulfilled
)

const parachainsSlice = createSlice({
  name: 'parachains',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    // .addMatcher(matchValidatorReceived, (state, action) => {
    //   adapter.upsertOne(state, { ...action.payload, _ts: + new Date()})
    // })
    .addMatcher(matchParachainsReceived, (state, action) => {
      const parachains = action.payload.data.map(parachain => ({
        ...parachain,
        session: action.payload.session,
        _backing_points: !!parachain.stats ? parachain.stats.pt - (parachain.stats.ab * 20) : 0,
        _mvr: !!parachain.stats ? calculateMvr(parachain.stats.ev, parachain.stats.iv, parachain.stats.mv) : undefined,
        _ts: + new Date()
      }))
      adapter.upsertMany(state, parachains)
    })
  }
})

export default parachainsSlice;

// Selectors
const { 
  selectById,
} = adapter.getSelectors(state => state.parachains)

export const selectParachainBySessionAndParaId = (state, session, paraId) => !!selectById(state, `${session}_${paraId}`) ? 
  selectById(state, `${session}_${paraId}`)  : undefined;

export const selectParachainMvrBySessionAndParaId = (state, session, paraId) => !!selectById(state, `${session}_${paraId}`) ? 
  (!!selectById(state, `${session}_${paraId}`)._mvr ? selectById(state, `${session}_${paraId}`)._mvr : undefined) : undefined;

  export const selectParachainBackingPointsBySessionAndParaId = (state, session, paraId) => !!selectById(state, `${session}_${paraId}`) ? 
  (!!selectById(state, `${session}_${paraId}`)._backing_points ? selectById(state, `${session}_${paraId}`)._backing_points : 0) : 0;
