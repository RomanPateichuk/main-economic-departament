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