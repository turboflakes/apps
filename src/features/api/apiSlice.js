import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectChain } from "../chain/chainSlice";
import { getNetworkHost } from "../../constants";
import { pkgActions } from "./pkgSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "",
});

const dynamicBaseQuery = async (args, api, extraOptions) => {
  const chainName = selectChain(api.getState());
  // gracefully handle scenarios where data to generate the URL is missing
  if (!chainName) {
    return {
      error: {
        status: 400,
        statusText: "Bad Request",
        data: "No chain selected",
      },
    };
  }

  // construct a dynamically generated portion of the url
  const protocol = getNetworkHost(chainName).includes("localhost")
    ? "http:"
    : "https:";
  const adjustedUrl = `${protocol}//${getNetworkHost(chainName)}/api/v1`;

  const adjustedArgs =
    typeof args === "string"
      ? `${adjustedUrl}${args}`
      : { ...args, url: `${adjustedUrl}${args.url}` };

  // provide the amended url and other params to the raw base query
  return rawBaseQuery(adjustedArgs, api, extraOptions);
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    getPkg: builder.query({
      query: () => "",
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(pkgActions.pkgReceived(data));
        } catch (err) {
          console.error("error fetching api package version");
        }
      },
    }),
  }),
});

export const { useGetPkgQuery } = apiSlice;

export default apiSlice;
