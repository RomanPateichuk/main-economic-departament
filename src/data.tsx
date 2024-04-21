type column = {
  f_pers_young_spec_id: number
  insert_date: string
  insert_user: string
  org_employee: string
  rep_beg_period: string
  rep_end_period: string
  update_date: string
  update_user: string
}

type formLineData = {
  f_pers_young_spec_line_id: number
  target_count: number
  distribution_count: number
  update_date: string
  update_user: string
  nsi_pers_indicate_id: number
  f_pers_young_spec_id: number
}

type formLine = {
  nsi_pers_young_spec_id: number
  actual_date: string
  name: string
  range: number
  update_date: string
  update_user: string
}

// представляет шапку для формы и также для таблицы
export const f_pers_young_spec: Array<column> = [
  {
    "f_pers_young_spec_id": 1,
    "insert_date": "2024-04-17T17:55:58+03:00",
    "insert_user": "Иван Иванович Иванов",
    "org_employee": "Иван Иванович Иванов + 375292221212",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-17T17:55:58+03:00",
    "update_user": "admin"
  },
  {
    "f_pers_young_spec_id": 2,
    "insert_date": "2024-04-18T09:29:04+03:00",
    "insert_user": "Oleg",
    "org_employee": "Oleg  +375292224545",
    "rep_beg_period": "2024-03-01",
    "rep_end_period": "2024-06-31",
    "update_date": "2024-04-18T09:29:04+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 3,
    "insert_date": "2024-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 4,
    "insert_date": "2024-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 5,
    "insert_date": "2024-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 6,
    "insert_date": "2024-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 7,
    "insert_date": "2023-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 8,
    "insert_date": "2023-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 9,
    "insert_date": "2024-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  },
  {
    "f_pers_young_spec_id": 10,
    "insert_date": "2024-04-18T09:29:04.411000+03:00",
    "insert_user": "udp",
    "org_employee": "udp +375292224545",
    "rep_beg_period": "2024-04-01",
    "rep_end_period": "2024-04-30",
    "update_date": "2024-04-18T09:29:04.411000+03:00",
    "update_user": "string"
  }
]

// представляет данные для формы по конкретным линиям
export const f_pers_young_spec_line: Array<formLineData> = [
  {
    "f_pers_young_spec_line_id": 1,
    "target_count": 2,
    "distribution_count": 2,
    "update_date": "2024-04-18T09:22:13.292000+03:00",
    "update_user": "string",
    "nsi_pers_indicate_id": 1,
    "f_pers_young_spec_id": 1
  },
  {
    "f_pers_young_spec_line_id": 2,
    "target_count": 2,
    "distribution_count": 2,
    "update_date": "2024-04-18T09:18:25+03:00",
    "update_user": "udp",
    "nsi_pers_indicate_id": 1,
    "f_pers_young_spec_id": 1
  },
  {
    "f_pers_young_spec_line_id": 3,
    "target_count": 10,
    "distribution_count": 10,
    "update_date": "2024-04-18T09:21:26.321000+03:00",
    "update_user": "Vika",
    "nsi_pers_indicate_id": 1,
    "f_pers_young_spec_id": 1
  }
]

// представляет линии для формы
export const nsi_pers_young_spec: Array<formLine> = [
  {
    "nsi_pers_young_spec_id": 1,
    "actual_date": "2100-01-01",
    "name": "Количество уволенных молодых специалистов",
    "range": 1,
    "update_date": "2024-04-17T17:54:24+03:00",
    "update_user": "admin"
  },
  {
    "nsi_pers_young_spec_id": 2,
    "actual_date": "2100-01-01",
    "name": "Истечение срока обязательной отработки",
    "range": 2,
    "update_date": "2024-04-17T17:54:59+03:00",
    "update_user": "admin"
  },
  {
    "nsi_pers_young_spec_id": 3,
    "actual_date": "2100-01-01",
    "name": "Призыв на срочную службу",
    "range": 3,
    "update_date": "2024-04-17T17:55:10+03:00",
    "update_user": "admin"
  },
  {
    "nsi_pers_young_spec_id": 4,
    "actual_date": "2100-01-01",
    "name": "Поступление в учреждения образования",
    "range": 4,
    "update_date": "2024-04-17T17:55:19+03:00",
    "update_user": "admin"
  },
  {
    "nsi_pers_young_spec_id": 5,
    "actual_date": "2100-01-01",
    "name": "Переезд в другую местность",
    "range": 5,
    "update_date": "2024-04-17T17:55:27+03:00",
    "update_user": "admin"
  }
]