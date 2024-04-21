import 'dayjs/locale/ru';
import * as yup from 'yup'
import React, {useEffect, useState} from "react"
import dayjs from "dayjs";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {f_pers_young_spec_line, nsi_pers_young_spec} from "../../data.tsx"
import {ruRU} from '@mui/x-date-pickers/locales';
import {useFormik} from "formik"
import {useLocation, useNavigate} from "react-router-dom"
import styles from "./Card.module.scss"

export const Card: React.FC = () => {
  const ruLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
  const navigate = useNavigate()

  // передавать через пропс create | edit | show = ""
  const [mode, setMode] = useState('show')
  // отдает api
  const [data, setData] = useState(f_pers_young_spec_line)
  const [row, setRow] = useState(nsi_pers_young_spec)
  // соотносим поля и данные
  const [resultData, setResultData] = useState<any>()

  const location = useLocation()

  const columns = [
    {id: 1, value: 'Наименование показателя'},
    {id: 2, value: 'Общее количество молодых специалистов'},
    {id: 3, value: 'Целевое'},
    {id: 4, value: 'Распределение'},
  ]

  const findCellData = (id: number) => {
    const findData = data.filter((item) => item.f_pers_young_spec_id === id)
    const rowData = findData.map((data) => {
      const id = data.f_pers_young_spec_line_id
      const result = row.find(field => field.nsi_pers_young_spec_id === id)
      return {...data, ...result}
    })

    setResultData(rowData)
  }

  useEffect(() => {
    findCellData(location.state.id)
  }, []);

  const getTotal = (key: string, param: string = '') => {
    if(param){
      return resultData.reduce((total: number, item) => total + item[key] + item[param], 0);
    }
    else {
      return resultData.reduce((total: number, item) => total + item[key], 0);
    }
    };

  const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: 'foobar@example.com',
      password: 'foobar123421421',
      periodBegin: location.state.periodBegin,
      periodEnd: location.state.periodEnd,
      org_employee: location.state.org_employee
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const onclickButtonHandler = ()=>{
    switch (mode){
      case 'edit':
        console.log("edit")
        break
      case 'create':
        console.log("create")
        break
      case 'show':
        navigate('/')
        break
      default:
        return;
    }
  }


  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={ruLocale}>

        <div className={styles.dateBlock}>
          <span>За период</span>
          <DatePicker
            name="periodBegin"
            onChange={(value) => formik.setFieldValue("periodBegin", value, true)}
            value={dayjs(formik.values.periodBegin)}
            format="MMMM"
            slotProps={{textField: {size: 'small'}}}
            disabled={mode === 'show'}
          />
          <span>&mdash;</span>
          <DatePicker
            name="periodEnd"
            onChange={(value) => formik.setFieldValue("periodEnd", value, true)}
            value={dayjs(formik.values.periodEnd)}
            format="MMMM"
            slotProps={{textField: {size: 'small'}}}
            disabled={mode === 'show'}
          />
          <span>{location.state.year}</span>
        </div>

      </LocalizationProvider>

      <div className={styles.nameLabel}>Ответственный заполнивший форму:</div>
        <TextField
          fullWidth
          size="small"
          value={formik.values.org_employee}
          onChange={formik.handleChange}
          disabled={mode === 'show'}
        />


      <TableContainer component={Paper} className={styles.table}>
        <Table >
          <TableHead>
            <TableRow>
              {
                columns.map(column => <TableCell key={column.id}>{column.value}</TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              resultData ? resultData.map(row => {
                  return <TableRow
                    key={row.f_pers_young_spec_line_id}
                  >
                    <TableCell>
                      {
                        row.name
                      }
                    </TableCell>
                    <TableCell sx={{fontSize: "1rem"}}>
                      {
                        row.target_count + row.distribution_count
                      }
                    </TableCell>
                    <TableCell>
                      <TextField value={row.target_count}
                                 name="periodBegin"
                                 onChange={(value) => formik.setFieldValue("periodBegin", value, true)}
                                 size={'small'}
                                 disabled={mode === 'show'}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField value={row.distribution_count}
                                 size={'small'}
                                 disabled={mode === 'show'}
                      />
                    </TableCell>
                  </TableRow>
                }) :
                <TableRow>
                  <TableCell>
                    Данных нет
                  </TableCell>
                </TableRow>
            }
            <TableRow>
              <TableCell className={styles.cell}>
                Всего
              </TableCell>
              <TableCell sx={{fontSize: "1rem"}}>
                {resultData && getTotal('target_count', 'distribution_count')}
              </TableCell>
              <TableCell sx={{fontSize: "1rem"}}>
                {resultData && getTotal('target_count')}
              </TableCell>
              <TableCell  sx={{fontSize: "1rem"}}>
               {resultData && getTotal('distribution_count')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button className={styles.button} onClick={()=>{onclickButtonHandler()}} color="primary" variant="outlined" type={(mode==="create" || mode === "edit") ? "submit" : "button"} >
        {mode === 'show' ? 'закрыть' : mode === 'create' ? 'создать' : 'редактировать'}
      </Button>
      <br/>
      <br/>
      <div>
        {/*<div>*/}
        {/*  <TextField*/}
        {/*    fullWidth*/}
        {/*    size="small"*/}
        {/*    disabled={mode === 'show'}*/}
        {/*    name="email"*/}
        {/*    value={formik.values.email}*/}
        {/*    onChange={formik.handleChange}*/}
        {/*    onBlur={formik.handleBlur}*/}
        {/*    error={formik.touched.email && Boolean(formik.errors.email)}*/}
        {/*    helperText={formik.touched.email && formik.errors.email}*/}
        {/*  />*/}
        {/*  <TextField*/}
        {/*    fullWidth*/}
        {/*    size="small"*/}
        {/*    name="password"*/}
        {/*    value={formik.values.password}*/}
        {/*    onChange={formik.handleChange}*/}
        {/*    onBlur={formik.handleBlur}*/}
        {/*    error={formik.touched.password && Boolean(formik.errors.password)}*/}
        {/*    helperText={formik.touched.password && formik.errors.password}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>

    </form>
  )
}