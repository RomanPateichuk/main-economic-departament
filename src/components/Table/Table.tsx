import React, {useEffect, useState} from "react";
import {
  Alert,
  Paper, Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import styles from "./Table.module.scss";
import {useGetLinesDataQuery, useGetLinesQuery} from "../../redux";
import {skipToken} from "@reduxjs/toolkit/query/react";
import {Loader} from "../Loader/Loader.tsx";
import {calculatedDataType, PropType} from "./types.ts";
import {ErrorMessage, FormikErrors, useFormikContext} from "formik";
import {IndexedFormErrorsType, IndexedFormValuesType} from "../Card/types.ts";

export const CustomTable: React.FC<PropType> = ({mode, locationState}) => {
  const [calculatedData, setCalculatedData] = useState<Array<calculatedDataType> | []>([])
  const [showErrorSnackBar, setShowErrorSnackBar] = useState(false)
  const {data: linesData = [], isLoading: linesDataLoading, isError: linesDataError} = useGetLinesDataQuery(mode === "create" && skipToken)
  const {data: lines = [], isLoading: linesLoading, isError: linesError} = useGetLinesQuery()

  const formik = useFormikContext<IndexedFormValuesType>();
  const errors: FormikErrors<IndexedFormErrorsType> = formik.errors;

  const columns = [
    {id: 1, value: "Наименование показателя"},
    {id: 2, value: "Общее количество молодых специалистов"},
    {id: 3, value: "Целевое"},
    {id: 4, value: "Распределение"},
  ]

  useEffect(() => {
    if (linesDataError || linesError) {
      setShowErrorSnackBar(true);
      setTimeout(() => setShowErrorSnackBar(false), 3000);
    }
  }, [linesDataError, linesError]);

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

    const result = Object.entries(lines).map(([, value], index) => {
      const line = filteredData.find(obj => obj.name === value.name);
      if (!line) {
        return {
          distribution_count: 0,
          target_count: 0,
          f_pers_young_spec_id: "",
          name: value.name,
          nsi_pers_indicate_id: index + 1,
          f_pers_young_spec_line_id: "",
        };
      }
      return line;
    });

    setCalculatedData(result as Array<calculatedDataType>)

    result.forEach(item => {
      formik.values[`row_${item.nsi_pers_indicate_id}`].id = item.f_pers_young_spec_line_id
      formik.values[`row_${item.nsi_pers_indicate_id}`].target_count = item.target_count
      formik.values[`row_${item.nsi_pers_indicate_id}`].distribution_count = item.distribution_count
    })

  }

  useEffect(() => {
    findCellData(locationState?.id)
  }, [linesDataLoading, linesLoading]);

  const getTotal = (params: "all" | "distribution" | "target") => {
    const data = Object.entries(formik.values)

    return data.reduce((total, [, value]) => {
      if (typeof value === 'object' && 'distribution_count' in value && 'target_count' in value) {
        if (params === "all") {
          total += value.distribution_count + value.target_count;
        } else if (params === "distribution") {
          total += value.distribution_count;
        } else if (params === "target") {
          total += value.target_count;
        }
      }
      return total

    }, 0)
  };

  return <>
    {linesDataLoading ? <Loader/> :
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
                  key={row.nsi_pers_indicate_id}
                >
                  <TableCell>
                    {
                      row.name
                    }
                  </TableCell>
                  <TableCell sx={{fontSize: "1rem"}}>
                    {
                      formik.values[`row_${row.nsi_pers_indicate_id}`]["target_count"] + formik.values[`row_${row.nsi_pers_indicate_id}`]["distribution_count"]
                    }
                  </TableCell>
                  <TableCell>
                    <TextField value={formik.values[`row_${row.nsi_pers_indicate_id}`]["target_count"]}
                               sx={{position: "relative"}}
                               name={`row_${row.nsi_pers_indicate_id}.target_count`}
                               onChange={formik.handleChange}
                               size={"small"}
                               disabled={mode === "show"}
                               type={"number"}
                               error={Boolean(errors[`row_${row.nsi_pers_indicate_id}`]?.target_count)}
                    />
                    <ErrorMessage className={styles.error} name={`row_${row.nsi_pers_indicate_id}.target_count`}
                                  component="div"/>
                  </TableCell>
                  <TableCell>
                    <TextField value={formik.values[`row_${row.nsi_pers_indicate_id}`]["distribution_count"]}
                               sx={{position: "relative"}}
                               name={`row_${row.nsi_pers_indicate_id}.distribution_count`}
                               onChange={formik.handleChange}
                               size={"small"}
                               disabled={mode === "show"}
                               type={"number"}
                               error={Boolean(errors[`row_${row.nsi_pers_indicate_id}`]?.distribution_count)}
                    />
                    <ErrorMessage className={styles.error} name={`row_${row.nsi_pers_indicate_id}.distribution_count`}
                                  component="div"/>
                  </TableCell>
                </TableRow>
              })
            }
            <TableRow>
              <TableCell className={styles.cell}>
                Всего
              </TableCell>
              <TableCell sx={{fontSize: "1rem"}}>
                {getTotal("all")}
              </TableCell>
              <TableCell sx={{fontSize: "1rem"}}>
                {getTotal("target")}
              </TableCell>
              <TableCell sx={{fontSize: "1rem"}}>
                {getTotal("distribution")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    }
    <Snackbar open={showErrorSnackBar} autoHideDuration={3000}>
      <Alert severity="error">
        Что-то пошло не так. Попробуйте еще раз
      </Alert>
    </Snackbar>
  </>

}