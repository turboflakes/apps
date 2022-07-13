import apiSlice from '../api/apiSlice'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Pool'],
  endpoints: (builder) => ({
    getPools: builder.query({
      query: () => '/pool',
      providesTags: (result, error, arg) => [{ type: 'Pool' }],
    }),
    getPool: builder.query({
      query: (poolId) => `/pool/${poolId}`,
      providesTags: (result, error, arg) => [{ type: 'Pool', id: arg }],
    }),
    getPoolNominees: builder.query({
      query: (poolId) => `/pool/${poolId}/nominees`,
      providesTags: (result, error, arg) => [{ type: 'Pool', id: arg }],
    }),
    getPoolNomination: builder.query({
      query: (poolId) => `/pool/${poolId}/nomination`,
      providesTags: (result, error, arg) => [{ type: 'Pool', id: arg }],
    }),
  }),
})

export const {
  useGetPoolsQuery,
  useGetPoolQuery,
  useGetPoolNomineesQuery,
  useGetPoolNominationQuery,
} = extendedApi
