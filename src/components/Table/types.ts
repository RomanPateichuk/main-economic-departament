export type PropType = {
  mode: 'show' | 'create' | 'edit',
  locationState: {
    id: number,
    beg_period: string,
    end_period: string,
    year: string,
    org_employee: string
  }
}

export type calculatedDataType = {
  actual_date: string
  distribution_count: number
  f_pers_young_spec_line_id: number
  name: string
  nsi_pers_indicate_id: number
  nsi_pers_young_spec_id: number
  range: number
  target_count: number
  update_date: string
  update_user: string
}

export type IndexedCalculatedDataType = calculatedDataType & {
  [key: string]: any;
};