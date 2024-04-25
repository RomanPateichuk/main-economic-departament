import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {HeaderDataType, LinesDataType, LinesType, requestCardDataType} from "./types.ts";

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: 'https://olegegoism.pythonanywhere.com/'}),
  endpoints: (build) => ({
    getHeaderData: build.query<Array<HeaderDataType>, void>({
      query: () => `/f_pers_young_spec`,
    }),
    getLinesData: build.query<Array<LinesDataType>, boolean>({
      query: () => `/f_pers_young_spec_line`,
    }),
    getLines: build.query<Array<LinesType>, void>({
      query: () => `/nsi_pers_young_spec`,
    }),
    createCard: build.mutation({
      query: (requestCardData: requestCardDataType) => ({
        url: '/f_pers_young_spec/',
        method: 'POST',
        body: requestCardData,
      }),
    }),
  })
});

export const {
  useGetHeaderDataQuery,
  useGetLinesDataQuery,
  useGetLinesQuery,
  useCreateCardMutation
} = api;