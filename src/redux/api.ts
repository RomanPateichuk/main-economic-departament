import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type HeaderDataType = {
  f_pers_young_spec_id: number
  insert_date: string
  insert_user: string
  org_employee: string
  rep_beg_period: string
  rep_end_period: string
  update_date: string
  update_user: string
}

type LinesType = {
  nsi_pers_young_spec_id: number
  actual_date: string
  name: string
  range: number
  update_date: string
  update_user: string
}

type LinesDataType = {
  f_pers_young_spec_line_id: number
  target_count: number
  distribution_count: number
  update_date: string
  update_user: string
  nsi_pers_indicate_id: number
  f_pers_young_spec_id: number
}


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: 'https://olegegoism.pythonanywhere.com/'}),
  endpoints: (build) => ({
    getHeaderData: build.query<Array<HeaderDataType>, void>({
      query: () => `/f_pers_young_spec`,
    }),
    getLinesData: build.query<Array<LinesDataType>, void>({
      query: () => `/f_pers_young_spec_line`,
    }),
    getLines: build.query<Array<LinesType>, void>({
      query: () => `/nsi_pers_young_spec`,
    }),
  })
});

export const {
  useGetHeaderDataQuery,
  useGetLinesDataQuery,
  useGetLinesQuery} = api;