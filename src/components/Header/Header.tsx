import React from "react";
import styles from "./Header.module.scss";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {Button, TextField} from "@mui/material";
import {useFormik} from "formik";
import {customizedYearCeilData} from "../../helpers/customizedDate.ts";
import {useNavigate} from "react-router-dom";
import {ruRU} from "@mui/x-date-pickers/locales";
import * as yup from "yup";
import {useCreateCardMutation} from "../../redux";
import {PropType} from "./types.ts";

export const Header: React.FC<PropType> = React.memo(({mode = 'show', locationState}) => {
  const ruLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
  const navigate = useNavigate()
  const [createCard] = useCreateCardMutation();

  const validationSchema = yup.object({
    org_employee: yup
      .string()
      .required('Это обязательное поле'),
    rep_beg_period: yup
      .date().required('Выберите начало периода'),
    rep_end_period: yup
      .date().required('Выберите конец периода')
  });

  const formik = useFormik({
    initialValues: {
      rep_beg_period: mode === 'create' ? null : dayjs(locationState.beg_period),
      rep_end_period: mode === 'create' ? null : dayjs(locationState?.end_period),
      org_employee: mode === 'create' ? '' : locationState?.org_employee
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (mode === 'create') {
        const data = {
          ...values,
          rep_beg_period: String(values.rep_beg_period?.format('YYYY-MM-DD')),
          rep_end_period: String(values.rep_end_period?.format('YYYY-MM-DD')),
          insert_date: dayjs().toISOString(),
          insert_user: "roman",
          update_date: dayjs().toISOString(),
          update_user: 'roman'
        }
        await createCard(data).unwrap()
          .then((response) => {
            const navigateData = {
              id: response.f_pers_young_spec_id,
              beg_period: response.beg_period,
              end_period: response.end_period,
              year: customizedYearCeilData(response.rep_beg_period),
              org_employee: response.org_employee
            }

            return navigate(`/card/${navigateData.id}`, {state: navigateData})
          }).catch(() => {
            alert('что-то пошло не так')
          })
      }

      alert(JSON.stringify(values, null, 2));
    },
  });


  return <form className={styles.form} onSubmit={formik.handleSubmit}>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={ruLocale}>

      <div className={styles.dateBlock}>
        <span>За период</span>
        <DatePicker
          name="rep_beg_period"
          onChange={(value) => formik.setFieldValue("rep_beg_period", value, true)}
          value={dayjs(formik.values.rep_beg_period)}
          format="MMMM"
          sx={{position: "relative"}}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                '& .MuiFormHelperText-root': {position: 'absolute', bottom: '-25px'}
              },
              helperText: formik.errors.rep_beg_period,
              error: Boolean(formik.errors.rep_beg_period),
            }
          }}

          disabled={mode === 'show'}
        />

        <span>&mdash;</span>
        <DatePicker
          name="rep_end_period"
          onChange={(value) => formik.setFieldValue("rep_end_period", value, true)}
          value={dayjs(formik.values.rep_end_period)}
          format="MMMM"
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                '& .MuiFormHelperText-root': {position: 'absolute', bottom: '-25px'}
              },
              helperText: formik.errors.rep_end_period,
              error: Boolean(formik.errors.rep_end_period),
            }
          }}
          disabled={mode === 'show'}
        />
        <span>{locationState?.year}</span>
      </div>

    </LocalizationProvider>

    <div className={styles.nameLabel}>Ответственный заполнивший форму:</div>
    <TextField
      name="org_employee"
      fullWidth
      size="small"
      value={formik.values.org_employee}
      onChange={formik.handleChange}
      disabled={mode === 'show'}
      placeholder={"Введите данные"}
      error={formik.touched.org_employee && Boolean(formik.errors.org_employee)}
      sx={{
        '& .MuiFormHelperText-root': {position: 'absolute', bottom: '-25px'}
      }}
      helperText={formik.touched.org_employee && formik.errors.org_employee}
    />
    {mode !== "show" && <Button className={styles.button} onClick={() => {
    }} color="primary" variant="outlined" type={"submit"}>
      {mode === 'create' ? 'создать' : 'редактировать'}
    </Button>}

  </form>
})