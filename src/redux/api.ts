import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  HeaderDataType,
  LinesDataType,
  LinesType, requestCardEditDataType,
  requestCardPostDataType,
  requestTableRowEditDataType,
  requestTableRowPostDataType
} from "./types.ts";

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
      query: (requestCardPostData: requestCardPostDataType) => ({
        url: '/f_pers_young_spec/',
        method: 'POST',
        body: requestCardPostData,
      }),
    }),
    createTableRow: build.mutation({
      query: (requestTableRowPostData: requestTableRowPostDataType) => ({
        url: '/f_pers_young_spec_line/',
        method: 'POST',
        body: requestTableRowPostData,
      }),
    }),
    editTableRow: build.mutation<requestTableRowEditDataType, {f_pers_young_spec_line_id: number, requestTableRowEditData: requestTableRowEditDataType}>({
      query: ({f_pers_young_spec_line_id, requestTableRowEditData} ) => ({
        url: `/f_pers_young_spec_line/${f_pers_young_spec_line_id}/`,
        method: 'PATCH',
        body: requestTableRowEditData,
      }),
    }),
    editCard: build.mutation<requestCardEditDataType, {f_pers_young_spec_id: number, requestEditCardData: requestCardEditDataType}>({
      query: ({f_pers_young_spec_id, requestEditCardData} ) => ({
        url: `/f_pers_young_spec/${f_pers_young_spec_id}/`,
        method: 'PATCH',
        body: requestEditCardData,
      }),
    }),
  })
});

export const {
  useGetHeaderDataQuery,
  useGetLinesDataQuery,
  useGetLinesQuery,
  useCreateCardMutation,
  useCreateTableRowMutation,
  useEditTableRowMutation,
  useEditCardMutation,
} = api;