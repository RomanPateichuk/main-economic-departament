import React, {useEffect, useState} from "react";
import {
  Paper,
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
import {calculatedDataType, IndexedCalculatedDataType, PropType} from "./types.ts";
import {ErrorMessage, FormikContextType, useFormikContext} from "formik";
import {IndexedFormValuesType} from "../Card/types.ts";

export const CustomTable: React.FC<PropType> = ({mode, locationState}) => {
  const [calculatedData, setCalculatedData] = useState<Array<calculatedDataType> | []>([])
  const {data: linesData = [], isLoading: linesDataLoading} = useGetLinesDataQuery(mode === "create" && skipToken)
  const {data: lines = [], isLoading: linesLoading} = useGetLinesQuery()

  const formik: FormikContextType<IndexedFormValuesType> = useFormikContext();

  const columns = [
    {id: 1, value: "Наименование показателя"},
    {id: 2, value: "Общее количество молодых специалистов"},
    {id: 3, value: "Целевое"},
    {id: 4, value: "Распределение"},
  ]

  const findCellData = (id: number) => {
    const findData = linesData.filter((item) => item.f_pers_young_spec_id === id)

    const rowData = findData.map((data) => {
      const id = data.nsi_pers_indicate_id
      const result = lines.find(field => field.nsi_pers_young_spec_id === id)
      return {...data,...result}
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

    const result = Object.entries(lines).map(([, value ], index) => {
      const line = filteredData.find(obj => obj.name === value.name);
      if (!line) {
        return {
          distribution_count: 0,
          target_count: 0,
          f_pers_young_spec_id: "",
          name: value.name,
          nsi_pers_indicate_id: index+1,
          f_pers_young_spec_line_id: "",
        };
      }
      return line;
    });


    setCalculatedData(result as Array<calculatedDataType>)
    if(mode === "edit"){
      result.forEach(item =>{
        formik.values[`row_${item.nsi_pers_indicate_id}`].id = item.f_pers_young_spec_line_id
        formik.values[`row_${item.nsi_pers_indicate_id}`].target_count = item.target_count
        formik.values[`row_${item.nsi_pers_indicate_id}`].distribution_count = item.distribution_count
      })
    }
  }

  useEffect(() => {
    findCellData(locationState?.id)
  }, [linesDataLoading, linesLoading]);


  const getTotal = (key: string, param: string = "") => {
    if (param) {
      return calculatedData.reduce((total: number, item: IndexedCalculatedDataType) => total + item[key] + item[param], 0);
    } else {
      return calculatedData.reduce((total: number, item: IndexedCalculatedDataType) => total + item[key], 0);
    }
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
                            row.target_count + row.distribution_count
                          }
                        </TableCell>
                        <TableCell>
                          <TextField value={
                                      mode === "show"
                                       ? row.target_count
                                       : formik.values[`row_${row.nsi_pers_indicate_id}`]["target_count"]
                                      }
                                     sx={{position: "relative"}}
                                     name={`row_${row.nsi_pers_indicate_id}.target_count`}
                                     onChange={formik.handleChange}
                                     size={"small"}
                                     disabled={mode === "show"}
                                     type={"number"}
                                     error={Boolean(formik.errors[`row_${row.nsi_pers_indicate_id}`]?.target_count)}
                          />
                          <ErrorMessage className={styles.error} name={`row_${row.nsi_pers_indicate_id}.target_count`} component="div" />
                        </TableCell>
                        <TableCell>
                          <TextField  value={
                                       mode === "show"
                                         ? row.distribution_count
                                         : formik.values[`row_${row.nsi_pers_indicate_id}`]["distribution_count"]
                                     }
                                     sx={{position: "relative"}}
                                     name={`row_${row.nsi_pers_indicate_id}.distribution_count`}
                                     onChange={formik.handleChange}
                                     size={"small"}
                                     disabled={mode === "show"}
                                     type={"number"}
                                     error={Boolean(formik.errors[`row_${row.nsi_pers_indicate_id}`]?.distribution_count)}
                          />
                          <ErrorMessage className={styles.error} name={`row_${row.nsi_pers_indicate_id}.distribution_count`} component="div" />
                        </TableCell>
                      </TableRow>
                    })
                  }
                  <TableRow>
                    <TableCell className={styles.cell}>
                      Всего
                    </TableCell>
                    <TableCell sx={{fontSize: "1rem"}}>
                      {calculatedData && getTotal("target_count", "distribution_count")}
                    </TableCell>
                    <TableCell sx={{fontSize: "1rem"}}>
                      {calculatedData && getTotal("target_count")}
                    </TableCell>
                    <TableCell sx={{fontSize: "1rem"}}>
                      {calculatedData && getTotal("distribution_count")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
        }
      </>

}