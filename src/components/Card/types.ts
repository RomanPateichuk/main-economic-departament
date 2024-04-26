import {Dayjs} from "dayjs";

export type FormValues = {
  rep_beg_period: null | Dayjs
  rep_end_period: null | Dayjs
  org_employee: null | string
  target_1: string
  distribution_1: string
  target_2: string
  distribution_2: string
  target_3: string
  distribution_3: string
  target_4: string
  distribution_4: string
  target_5: string
  distribution_5: string
};

export type IndexedFormValuesType = FormValues & {
  [key: string]: any;
};