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
import {useCreateCardMutation} from "../../redux";
import {IndexedFormValuesType} from "./types.ts";

type PropType = {
  mode?: 'show' | 'create' | 'edit',
}

export const Card: React.FC<PropType> = React.memo(({mode = 'show'}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [createCard] = useCreateCardMutation()
  const validationSchema = yup.object({
    org_employee: yup
      .string()
      .required('Это обязательное поле'),
    rep_beg_period: yup
      .date().required('Выберите начало периода'),
    rep_end_period: yup
      .date().required('Выберите конец периода')
  });

  const validate = values => {
    const errors = {};
    // if(values.target_1 === '0' && values.distribution_1 === '0'){
    //   errors.target_1 = 'error'
    // }
    return errors
  }

  const formik = useFormik<IndexedFormValuesType>({
    initialValues: {
      // row_1: {distribution_count: "0", target_count: "0"},
      // row_2: {distribution_count: "0", target_count: "0"},
      // row_3: {distribution_count: "0", target_count: "0"},
      // row_4: {distribution_count: "0", target_count: "0"},
      // row_5: {distribution_count: "0", target_count: "0"},
      distribution_1: "0",
      distribution_2: "0",
      distribution_3: "0",
      distribution_4: "0",
      distribution_5: "0",
      org_employee: location.state?.org_employee || "",
      rep_beg_period: mode === 'create' ? null : dayjs(location.state.rep_beg_period),
      rep_end_period: mode === 'create' ? null : dayjs(location.state.rep_end_period),
      target_1: "0",
      target_2: "0",
      target_3: "0",
      target_4: "0",
      target_5: "0",
    },
    // validationSchema: validationSchema,
    validate,
    onSubmit: async (values) => {
      // if (mode === 'create') {
      const data = {
        ...values,
        rep_beg_period: String(values.rep_beg_period?.format('YYYY-MM-DD')),
        rep_end_period: String(values.rep_end_period?.format('YYYY-MM-DD')),
        insert_date: dayjs().toISOString(),
        insert_user: "roman",
        update_date: dayjs().toISOString(),
        update_user: 'roman'
      }
      //   await createCard(data).unwrap()
      //     .then((response) => {
      //       const navigateData = {
      //         id: response.f_pers_young_spec_id,
      //         beg_period: response.beg_period,
      //         end_period: response.end_period,
      //         year: customizedYearCeilData(response.rep_beg_period),
      //         org_employee: response.org_employee
      //       }
      //
      //       return navigate(`/card/${navigateData.id}`, {state: navigateData})
      //     }).catch(() => {
      //       alert('что-то пошло не так')
      //     })
      // }

      // {
      //   "target_count": 0,
      //   "distribution_count": 0,
      //   "update_date": "2024-04-25T16:24:36.910Z",
      //   "update_user": "string",
      //   "nsi_pers_indicate_id": 1,
      //   "f_pers_young_spec_id": 34
      // }

      //const { org_employee, rep_beg_period, rep_end_period, ...rows } = initialValues;

      //const A = rows;
      //const B = { org_employee, rep_beg_period, rep_end_period };

      const row = {
        row_1: {distribution_count: "0", target_count: "0"},
        row_2: {distribution_count: "0", target_count: "0"},
        row_3: {distribution_count: "0", target_count: "0"},
        row_4: {distribution_count: "0", target_count: "0"},
        row_5: {distribution_count: "0", target_count: "0"},
      }

      const newArray = [];

      Object.entries(row).forEach(([key, value]) => {
        const nsi_pers_indicate_id = parseInt(key.replace('row_', ''), 10);
        newArray.push({
          nsi_pers_indicate_id,
          f_pers_young_spec_id: 34,
          update_date: "2024-04-25T16:24:36.910Z",
          update_user: "string",
          ...value,
        });
      });

      alert(JSON.stringify(data, null, 2));

    },
  });

  // const onclickButtonHandler = () => {
  //   switch (mode) {
  //     case 'edit':
  //       console.log("edit")
  //       break
  //     case 'create':
  //       console.log("create")
  //       break
  //     case 'show':
  //       navigate('/')
  //       break
  //     default:
  //       return;
  //   }
  // }

  return (

    <FormikProvider value={formik}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Header mode={mode} year={location?.state?.year}/>
        <Table mode={mode} locationState={location.state}/>
        {mode !== "show" &&
            <Button className={styles.button}
                    color="primary"
                    variant="outlined"
                    type={"submit"}>{mode === 'create' ? 'создать' : 'редактировать'}
            </Button>}
        </form>
    </FormikProvider>
)
})