import 'dayjs/locale/ru';
import React, {useEffect, useState} from "react"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {Header} from "../Header"
import {Table} from "../Table"
import {Alert, Button, Snackbar} from "@mui/material";
import {FormikProvider, useFormik} from "formik"
import dayjs from "dayjs";
import * as yup from "yup";
import styles from "./Card.module.scss";
import {
  useCreateCardMutation,
  useCreateTableRowMutation,
  useEditCardMutation,
  useEditTableRowMutation
} from "../../redux";
import {IndexedAccumulatorType, IndexedFormValuesType} from "./types.ts"
import {customizedYearCeilData} from "../../helpers/customizedDate.ts"
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';

type PropType = {
  mode?: 'show' | 'create' | 'edit',
}

export const Card: React.FC<PropType> = React.memo(({mode = 'show'}) => {
  const location = useLocation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [createCard, {isLoading: createCardLoading}] = useCreateCardMutation()
  const [createTableRow, {isLoading: createTableRowLoading}] = useCreateTableRowMutation()
  const [editCard, {isLoading: editCardLoading}] = useEditCardMutation()
  const [editTableRow, {isLoading: editTableRowLoading}] = useEditTableRowMutation()

  const [showErrorSnackBar, setShowErrorSnackBar] = useState(false)
  const [showSuccessSnackBar, setShowSuccessSnackBar] = useState(false)
  const [status, setStatus] = useState<"success" | "error" | "">("")


  useEffect(() => {
     if(status === "success"){
       setShowSuccessSnackBar(true);
       setTimeout(() => setShowSuccessSnackBar(false), 3000);
     }
     else if(status === "error"){
       setShowErrorSnackBar(true);
       setTimeout(() => setShowErrorSnackBar(false), 3000);
     }


  }, [status]);


  const rowSchema = yup.object().shape({
    distribution_count: yup.number()
      .required('Это обязательное поле')
      .min(0, 'Не может быть отрицательным'),
    target_count: yup.number()
      .required('Это обязательное поле')
      .min(0, 'Не может быть отрицательным'),
  });

  const validationSchema = yup.object({
    org_employee: yup
      .string()
      .required('Это обязательное поле'),
    rep_beg_period: yup
      .date().required('Выберите начало периода'),
    rep_end_period: yup
      .date().required('Выберите конец периода'),
    row_1: rowSchema,
    row_2: rowSchema,
    row_3: rowSchema,
    row_4: rowSchema,
    row_5: rowSchema,
  });


  const formik = useFormik<IndexedFormValuesType>({
    initialValues: {
      row_1: {distribution_count: 0, target_count: 0, id: 0},
      row_2: {distribution_count: 0, target_count: 0, id: 0},
      row_3: {distribution_count: 0, target_count: 0, id: 0},
      row_4: {distribution_count: 0, target_count: 0, id: 0},
      row_5: {distribution_count: 0, target_count: 0, id: 0},
      org_employee: location.state?.org_employee || "",
      rep_beg_period: mode === 'create' ? "" : dayjs(location.state.rep_beg_period),
      rep_end_period: mode === 'create' ? "" : dayjs(location.state.rep_end_period),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setStatus("")
      const {org_employee, rep_beg_period, rep_end_period, ...rows} = values

      const headerData = {org_employee, rep_beg_period, rep_end_period}
      const tableData = rows

      if (mode === "create") {
        const requestCardData = {
          ...headerData,
          rep_beg_period: dayjs.isDayjs(values.rep_beg_period) ? String(values.rep_beg_period?.format('YYYY-MM-DD')) : values.rep_beg_period,
          rep_end_period: dayjs.isDayjs(values.rep_end_period) ? String(values.rep_end_period?.format('YYYY-MM-DD')) : values.rep_beg_period,
          insert_date: dayjs().toISOString(),
          insert_user: "roman",
          update_date: dayjs().toISOString(),
          update_user: 'roman'
        }

        await createCard(requestCardData).unwrap()
          .then(async (response) => {
            const navigateData = {
              id: response.f_pers_young_spec_id,
              beg_period: response.beg_period,
              end_period: response.end_period,
              year: customizedYearCeilData(response.rep_beg_period),
              org_employee: response.org_employee
            }

            const requestTableData = Object.values(tableData).map((value, index) => {
              return {
                nsi_pers_indicate_id: index + 1,
                f_pers_young_spec_id: navigateData.id,
                update_date: dayjs().toISOString(),
                update_user: "roman",
                target_count: value.target_count,
                distribution_count: value.distribution_count,
              }
            }).filter(value => value.target_count !== 0 || value.distribution_count !== 0)

            //let hasError = false

            for (const tableRow of requestTableData) {
              await createTableRow(tableRow).unwrap()
                .then(() => {
                  return navigate(`/card/${navigateData.id}`, {state: navigateData})
                })
                .catch(() => {
                   setStatus("error")
                   console.error(`Что-то пошло не так! Данные строки ${tableRow.nsi_pers_indicate_id} не сохранились. Попробуйте еще раз`)
                })
            }

          }).catch((e) => {
            setStatus("error")
            console.error(e.status)
          })


      } else if (mode === "edit") {

        const changedValues = Object.keys(values).reduce((acc: IndexedAccumulatorType, key) => {
          const regex = /^(row|rep)/
          if (key === "org_employee" && values[key] !== formik.initialValues[key]) {
            acc[key] = values[key];
          } else if (regex.test(key)) {
            if (JSON.stringify(values[key]) !== JSON.stringify(formik.initialValues[key])) {
              acc[key] = values[key]
            }

          }
          return acc;
        }, {});

        const {org_employee, rep_beg_period, rep_end_period, ...rows} = changedValues

        if (!(Object.keys(rows).length === 0)) {
          for (const key of Object.keys(rows)) {
            const f_pers_young_spec_line_id = rows[key].id
            const requestTableRowEditData = {
              f_pers_young_spec_line_id: rows[key].id,
              requestTableRowEditData: {
                target_count: rows[key].target_count,
                distribution_count: rows[key].distribution_count,
                update_date: dayjs().toISOString(),
                update_user: "roman",
              }
            }


            if (f_pers_young_spec_line_id === "") {
              const requestTableData = {
                nsi_pers_indicate_id: parseInt(key.replace("row_", ""), 10),
                f_pers_young_spec_id: Number(id),
                update_date: dayjs().toISOString(),
                update_user: "roman",
                target_count: rows[key].target_count,
                distribution_count: rows[key].distribution_count,
              }

              await createTableRow(requestTableData).unwrap()
                .then(()=>{
                  setStatus("success")
                })
                .catch((e) => {
                  setStatus("error")
                  console.error(e.status)
                })
            } else {
              await editTableRow(requestTableRowEditData).unwrap()
                .then(()=>{
                  setStatus( "success")
                })
                .catch(() => {
                  setStatus("error")
                  console.error(`Что-то пошло не так! Данные строки ${f_pers_young_spec_line_id} не сохранились. Попробуйте еще раз`)
                })


            }
          }
        }

        if (org_employee || rep_beg_period || rep_end_period) {
          const headerData = Object.fromEntries(Object.entries({
            org_employee,
            rep_beg_period,
            rep_end_period
          }).filter(([, value]) => value !== undefined))

          if (headerData.rep_beg_period) {
            headerData.rep_beg_period = String(headerData.rep_beg_period?.format('YYYY-MM-DD'))
          }

          if (headerData.rep_end_period) {
            headerData.rep_end_period = String(headerData.rep_end_period?.format('YYYY-MM-DD'))
          }

          const requestEditCardData = {
            f_pers_young_spec_id: Number(id),
            requestEditCardData: {
              ...headerData,
              update_date: dayjs().toISOString(),
              update_user: "roman"
            },
          }

          await editCard(requestEditCardData).unwrap()
            .then(() => {
              setStatus("success")
            })
            .catch((e) => {
              setStatus("error")
              console.error(e.status)
            })
        }
      }
    },
  });

  return <>
    <FormikProvider value={formik}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Header mode={mode} year={location?.state?.year}/>
        <Table mode={mode} locationState={location.state}/>
        <div className={styles.buttonsWrapper}>
          <Button className={styles.closeButton}
                  onClick={() => {
                    navigate("/")
                  }}
                  color="primary"
                  variant="outlined">
            {"Закрыть"}
          </Button>

          {mode !== "show" &&
              <LoadingButton
                  type={"submit"}
                  loading={createCardLoading || createTableRowLoading || editCardLoading || editTableRowLoading}
                  loadingPosition="start"
                  startIcon={<SaveIcon/>}
                  variant="outlined"
              >
                {mode === "create" ? "создать" : "редактировать"}
              </LoadingButton>
          }
        </div>
      </form>
    </FormikProvider>
    <Snackbar open={showErrorSnackBar} autoHideDuration={3000}>
      <Alert severity="error">
        Что-то пошло не так. Попробуйте еще раз
      </Alert>
    </Snackbar>
    <Snackbar open={showSuccessSnackBar} autoHideDuration={3000}>
      <Alert severity="success">
        Данные успешно сохранены
      </Alert>
    </Snackbar>

  </>
})