import 'dayjs/locale/ru';
import React from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {Header} from "../Header";
import {Table} from "../Table"
import {Button} from "@mui/material";
import {FormikProvider, useFormik} from "formik";
import dayjs from "dayjs";
import * as yup from "yup";
import styles from "./Card.module.scss";
import {useCreateCardMutation, useCreateTableRowMutation} from "../../redux";
import {IndexedFormValuesType} from "./types.ts";
import {customizedYearCeilData} from "../../helpers/customizedDate.ts";

type PropType = {
  mode?: 'show' | 'create' | 'edit',
}

export const Card: React.FC<PropType> = React.memo(({mode = 'show'}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [createCard] = useCreateCardMutation()
  const [createTableRow, { error: createTableRowError }] = useCreateTableRowMutation()
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
      row_1: {distribution_count: 0, target_count: 0},
      row_2: {distribution_count: 0, target_count: 0},
      row_3: {distribution_count: 0, target_count: 0},
      row_4: {distribution_count: 0, target_count: 0},
      row_5: {distribution_count: 0, target_count: 0},
      org_employee: location.state?.org_employee || "",
      rep_beg_period: mode === 'create' ? null : dayjs(location.state.rep_beg_period),
      rep_end_period: mode === 'create' ? null : dayjs(location.state.rep_end_period),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { org_employee, rep_beg_period, rep_end_period, ...rows } = values

      const headerData = { org_employee, rep_beg_period, rep_end_period }
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

            const requestTableData = Object.values(tableData).map((value, index)=>{
              return {
                nsi_pers_indicate_id: index+1,
                f_pers_young_spec_id: navigateData.id,
                update_date: "2024-04-25T16:24:36.910Z",
                update_user: "string",
                target_count: value.target_count,
                distribution_count: value.distribution_count,
              }
            }).filter(value => value.target_count !==0 || value.distribution_count !==0)

            for(const tableRow of requestTableData){
              await createTableRow(tableRow).unwrap()
                .then(response =>{
                  console.log(response)
                })
                .catch(()=>{
                  alert(`Что-то пошло не так! Данные строки таблицы ${tableRow.nsi_pers_indicate_id} не сохранились. Попробуйте еще раз`)
                })
            }

            if(!createTableRowError){
              return navigate(`/card/${navigateData.id}`, {state: navigateData})
            }

          }).catch(() => {
            alert('Что-то пошло не так! Данные шапки таблицы не сохранились. Попробуйте еще раз')
          })


     }
      else if(mode === "edit"){
        console.log("edit")
      }
      else if(mode === "show"){
        navigate('/')
      }


    },
  });

  return (
    <FormikProvider value={formik}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Header mode={mode} year={location?.state?.year}/>
        <Table mode={mode} locationState={location.state}/>
        <Button className={styles.button}
                color="primary"
                variant="outlined"
                type={"submit"}>{mode === "create" ? "создать" : mode === "show" ? "закрыть" : "редактировать"}
        </Button>
      </form>
    </FormikProvider>
  )
})