import {Dayjs} from "dayjs";

export type HeaderDataType = {
  f_pers_young_spec_id: number
  insert_date: string
  insert_user: string
  org_employee: string
  rep_beg_period: string
  rep_end_period: string
  update_date: string
  update_user: string
  [key: string]: number | string
}

export type LinesType = {
  nsi_pers_young_spec_id: number
  actual_date: string
  name: string
  range: number
  update_date: string
  update_user: string
}

export type LinesDataType = {
  f_pers_young_spec_line_id: number
  target_count: number
  distribution_count: number
  update_date: string
  update_user: string
  nsi_pers_indicate_id: number
  f_pers_young_spec_id: number
}

export type requestCardPostDataType = {
  insert_date: string
  insert_user: string
  org_employee: string
  rep_beg_period: string | Dayjs
  rep_end_period: string | Dayjs
  update_date: string
  update_user: string
}

export type requestTableRowPostDataType = {
  target_count: number,
  distribution_count: number,
  update_date: string,
  update_user: string,
  nsi_pers_indicate_id: number,
  f_pers_young_spec_id: number
}

export type requestTableRowEditDataType = {
  [key: string]:  string | number;
}

export type requestCardEditDataType = {
  [key: string]:  string | number;
}