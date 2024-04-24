import 'dayjs/locale/ru';
import * as yup from 'yup'
import React, {useEffect, useState} from "react"
import dayjs from "dayjs";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {ruRU} from '@mui/x-date-pickers/locales';
import {useFormik} from "formik"
import {useLocation, useNavigate} from "react-router-dom"
import styles from "./Card.module.scss"
import {useGetLinesDataQuery, useGetLinesQuery} from "../../redux";
import {Loader} from "../Loader/Loader.tsx";

type calculatedDataType = {
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

type IndexedCalculatedDataType = calculatedDataType & {
  [key: string]: any;
};

type PropType = {
  mode: 'show' | 'create' | 'edit'
}

export const Card: React.FC<PropType> = React.memo(({mode='show'}) => {
  const ruLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
  const navigate = useNavigate()

  const linesData = []
  const linesDataLoading = false

  //const {data: linesData = [], isLoading: linesDataLoading} = useGetLinesDataQuery()

  const {data: lines = [], isLoading: linesLoading} = useGetLinesQuery()
  const [calculatedData, setCalculatedData] = useState<Array<calculatedDataType> | []>([])
  const location = useLocation()

  const columns = [
    {id: 1, value: 'Наименование показателя'},
    {id: 2, value: 'Общее количество молодых специалистов'},
    {id: 3, value: 'Целевое'},
    {id: 4, value: 'Распределение'},
  ]

  const findCellData = (id: number) => {
    const findData = linesData.filter((item) => item.f_pers_young_spec_id === id)
    const rowData = findData.map((data) => {
      const id = data.nsi_pers_indicate_id
      const result = lines.find(field => field.nsi_pers_young_spec_id === id)


      return {...data, ...result}
    })


    const uniqueNames: Record<string, typeof rowData[0]> = {}
    rowData.forEach((obj) => {
      if (obj.name) {
        if (!uniqueNames[obj.name] || new Date(uniqueNames[obj.name].update_date) < new Date(obj.update_date)) {
          uniqueNames[obj.name] = obj;
        }
      }
    });
    const filteredData = Object.values(uniqueNames);
    // console.log(filteredData)
    // console.log(lines)

    const result = Object.entries(lines).map(([, value]) => {
      const line = filteredData.find(obj => obj.name === value.name);

      console.log(line)

      if (!line) {
        return {
          f_pers_young_spec_line_id: Date.now() + value.range,
          "target_count": 0,
          "distribution_count": 0,
          "update_date": "",
          "update_user": "",
          "nsi_pers_indicate_id": value?.nsi_pers_young_spec_id,
          "f_pers_young_spec_id": filteredData[0]?.f_pers_young_spec_id,
          "nsi_pers_young_spec_id": 3,
          "actual_date": "",
          "name": value.name,
          "range": value.range
        };
      }
      return line;
    });

    console.log(result);


    setCalculatedData(result as Array<calculatedDataType>)
  }

  useEffect(() => {
    findCellData(location.state.id)
  }, [linesDataLoading, linesLoading]);

  const getTotal = (key: string, param: string = '') => {
    if (param) {
      return calculatedData.reduce((total: number, item: IndexedCalculatedDataType) => total + item[key] + item[param], 0);
    } else {
      return calculatedData.reduce((total: number, item: IndexedCalculatedDataType) => total + item[key], 0);
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

  const onclickButtonHandler = () => {
    switch (mode) {
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
    <>
      {linesDataLoading ? <Loader/> :
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
            <Table>
              <TableHead>
                <TableRow>
                  {
                    columns.map(column => <TableCell key={column.id}>{column.value}</TableCell>)
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  calculatedData.map(row => {
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
                                     disabled={mode === 'show' || mode === 'create'}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField value={row.distribution_count}
                                     size={'small'}
                                     disabled={mode === 'show' || mode === 'create'}
                          />
                        </TableCell>
                      </TableRow>
                    })
                }
                <TableRow>
                  <TableCell className={styles.cell}>
                    Всего
                  </TableCell>
                  <TableCell sx={{fontSize: "1rem"}}>
                    {calculatedData && getTotal('target_count', 'distribution_count')}
                  </TableCell>
                  <TableCell sx={{fontSize: "1rem"}}>
                    {calculatedData && getTotal('target_count')}
                  </TableCell>
                  <TableCell sx={{fontSize: "1rem"}}>
                    {calculatedData && getTotal('distribution_count')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button className={styles.button} onClick={() => {
            onclickButtonHandler()
          }} color="primary" variant="outlined" type={(mode === "create" || mode === "edit") ? "submit" : "button"}>
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
      }
    </>
  )
})