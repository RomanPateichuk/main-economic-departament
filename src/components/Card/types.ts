import {Dayjs} from "dayjs";

export type FormValues = {
  row_1: RowType,
  row_2: RowType,
  row_3: RowType,
  row_4: RowType,
  row_5: RowType,
  org_employee:  string
  rep_beg_period: null | Dayjs
  rep_end_period: null | Dayjs

};

type RowType = {
  distribution_count: number
  target_count: number
}

export type IndexedFormValuesType = FormValues & {
  [key: string]: any;
};