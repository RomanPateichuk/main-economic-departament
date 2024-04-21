export const mounths: { [key: string]: string } = {
  0: 'Январь',
  1: 'Февраль',
  2: 'Март',
  3: 'Апрель',
  4: 'Май',
  5: 'Июнь',
  6: 'Июль',
  7: 'Август',
  8: 'Сентябрь',
  9: 'Октябрь',
  10: 'Ноябрь',
  11: 'Декабрь',
}

export const customizedYearCeilData = (date: string) => {
  return new Date(date).getFullYear()
}

export const customizedPeriodCeilData = (begin: string, end: string) => {
  const dateBegin = new Date(begin).getMonth()
  const dateEnd = new Date(end).getMonth()
  return dateBegin === dateEnd ? `${mounths[dateBegin]}` : `${mounths[dateBegin]}-${mounths[dateEnd]}`
}
