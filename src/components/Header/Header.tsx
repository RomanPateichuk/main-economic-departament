import React from "react";
import styles from "./Header.module.scss";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {TextField} from "@mui/material";
import {ruRU} from "@mui/x-date-pickers/locales";
import {PropType} from "./types.ts";
import {FormikContextType, useFormikContext} from "formik";
import {FormValues} from "../Card/types.ts";

export const Header: React.FC<PropType> = React.memo(({mode = 'show', year}) => {
  const ruLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
  const formik: FormikContextType<FormValues> = useFormikContext();

  return <>
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
        <span>{year}</span>
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
  </>
})