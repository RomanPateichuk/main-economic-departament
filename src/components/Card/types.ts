import {Dayjs} from "dayjs"

export type FormValues = {
  row_1: RowType,
  row_2: RowType,
  row_3: RowType,
  row_4: RowType,
  row_5: RowType,
  org_employee:  string,
  rep_beg_period: string | Dayjs,
  rep_end_period: string | Dayjs
};

type RowType = {
  distribution_count: number
  target_count: number
  id: number
}

export type IndexedFormValuesType = FormValues & {
  [key: string]: any
}

export type IndexedFormErrorsType = {
  [key: string]: {
    distribution_count: string;
    target_count: string;
  };
}

export type IndexedAccumulatorType = {
  [key: string]: any
}