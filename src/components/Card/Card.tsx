import 'dayjs/locale/ru';
import React from "react"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {Header} from "../Header";
import {Table} from "../Table"
import {Button} from "@mui/material";
import {FormikProvider, useFormik} from "formik";
import dayjs from "dayjs";
import * as yup from "yup";
import styles from "./Card.module.scss";
import {
  useCreateCardMutation,
  useCreateTableRowMutation,
  useEditCardMutation,
  useEditTableRowMutation, useGetHeaderDataQuery
} from "../../redux";
import {IndexedAccumulatorType, IndexedFormValuesType} from "./types.ts";
import {customizedYearCeilData} from "../../helpers/customizedDate.ts";

type PropType = {
  mode?: 'show' | 'create' | 'edit',
}

export const Card: React.FC<PropType> = React.memo(({mode = 'show'}) => {
  const location = useLocation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [createCard] = useCreateCardMutation()
  const [createTableRow] = useCreateTableRowMutation()
  const [editCard] = useEditCardMutation()
  const [editTableRow] = useEditTableRowMutation()
  const {data = [], isLoading} = useGetHeaderDataQuery();
  const validationSchema = yup.object({
    org_employee: yup
      .string()
      .required('Это обязательное поле'),
    rep_beg_period: yup
      .date().required('Выберите начало периода'),
    rep_end_period: yup
      .date().required('Выберите конец периода')
  });

  const formik = useFormik<IndexedFormValuesType>({
    initialValues: {
      row_1: {distribution_count: 0, target_count: 0, id: 0},
      row_2: {distribution_count: 0, target_count: 0, id: 0},
      row_3: {distribution_count: 0, target_count: 0, id: 0},
      row_4: {distribution_count: 0, target_count: 0, id: 0},
      row_5: {distribution_count: 0, target_count: 0, id: 0},
      org_employee: location.state?.org_employee || "",
      rep_beg_period: mode === 'create' ? null : dayjs(location.state.rep_beg_period),
      rep_end_period: mode === 'create' ? null : dayjs(location.state.rep_end_period),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const {org_employee, rep_beg_period, rep_end_period, ...rows} = values

      const headerData = {org_employee, rep_beg_period, rep_end_period}
      const tableData = rows

      if (mode === "create") {
        const requestCardData = {
          ...headerData,
          rep_beg_period: String(values.rep_beg_period?.format('YYYY-MM-DD')),
          rep_end_period: String(values.rep_end_period?.format('YYYY-MM-DD')),
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
                update_date: "2024-04-25T16:24:36.910Z",
                update_user: "string",
                target_count: value.target_count,
                distribution_count: value.distribution_count,
              }
            }).filter(value => value.target_count !== 0 || value.distribution_count !== 0)

            let hasError = false

            for (const tableRow of requestTableData) {
              await createTableRow(tableRow).unwrap()
                .then(() => {

                })
                .catch(() => {
                  hasError = true
                  alert(`Что-то пошло не так! Данные строки ${tableRow.nsi_pers_indicate_id} не сохранились. Попробуйте еще раз`)
                })
            }

            if (!hasError) {
              alert("Данные сохранились")
              return navigate(`/card/${navigateData.id}`, {state: navigateData})
            }

          }).catch(() => {
            alert('Что-то пошло не так! Данные шапки таблицы не сохранились. Попробуйте еще раз')
          })


      } else if (mode === "edit") {

        const changedValues = Object.keys(values).reduce((acc: IndexedAccumulatorType, key) => {
          const regex = /^(row|rep)/
          if (key === "org_employee" && values[key] !== formik.initialValues[key]) {
              acc[key] = values[key];
          }
          else if(regex.test(key)){
            if(JSON.stringify(values[key]) !== JSON.stringify(formik.initialValues[key])){
              acc[key] = values[key]
            }

          }
          return acc;
        }, {});


        // нужна id карточки(из урла) и id строки данных таблицы(из ключа)

        // деструктуризировать объект значений
        const {org_employee, rep_beg_period, rep_end_period, ...rows} = changedValues

        if(!(Object.keys(rows).length === 0)){
          for(const key of Object.keys(rows)){
            const f_pers_young_spec_line_id = rows[key].id
            console.log(f_pers_young_spec_line_id)
            const requestTableRowEditData = {
              f_pers_young_spec_line_id: rows[key].id,
              requestTableRowEditData: {
                target_count: rows[key].target_count,
                distribution_count: rows[key].distribution_count,
                update_date: dayjs().toISOString(),
                update_user: "roman",
              }
            }

            console.log(requestTableRowEditData)
            await editTableRow(requestTableRowEditData).unwrap()
              .then(() => {
              })
              .catch(() => {
                alert(`Что-то пошло не так! Данные строки ${f_pers_young_spec_line_id} не сохранились. Попробуйте еще раз`)
              })
          }



        }

        if(org_employee || rep_beg_period || rep_end_period){
          const headerData =Object.fromEntries(Object.entries({org_employee, rep_beg_period, rep_end_period}).filter(([, value]) => value !== undefined))

          if(headerData.rep_beg_period){
            headerData.rep_beg_period = String(headerData.rep_beg_period?.format('YYYY-MM-DD'))
          }

          if(headerData.rep_end_period){
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
           .then(()=>{
              alert("Данные успешно изменены")
           })
           .catch(()=>{
             alert("Что-то пошло не так. Попробуйте еще раз")
           })
        }
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Header mode={mode} year={location?.state?.year}/>
        <Table mode={mode} locationState={location.state}/>
        <div className={styles.buttonsWrapper}>
          <Button className={styles.closeButton}
                  onClick={()=>{navigate("/")}}
                  color="primary"
                  variant="outlined">
          {"Закрыть"}
          </Button>

          {mode !== "show" &&
          <Button className={styles.actionButton}
                  color="primary"
                  variant="outlined"
                  type={"submit"}>
          {mode === "create" ? "создать" : "редактировать"}
          </Button>
          }

        </div>
      </form>
    </FormikProvider>
  )
})