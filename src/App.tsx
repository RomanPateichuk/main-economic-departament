import React, {useState} from "react"
import {
  Button,
  ButtonGroup, IconButton, Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import {useNavigate} from "react-router-dom";
import {useGetHeaderDataQuery} from "./redux";
import {customizedPeriodCeilData, customizedYearCeilData} from "./helpers/customizedDate.ts";
import {Loader} from "./components/Loader/Loader.tsx";

export const App: React.FC = () => {
  const {data = [], isLoading} = useGetHeaderDataQuery();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false)
  const [navigateData, setNavigateData] = useState({})
  const navigate = useNavigate();


  const columns = [
    {id: 1, value: 'За период'},
    {id: 2, value: 'Год'},
  ]

  const onClickRowHandler = (id: number, rep_beg_period: string, rep_end_period: string, org_employee: string, year: number) => {
    const navigateData = {
      id,
      rep_beg_period,
      rep_end_period,
      year,
      org_employee
    }
    setNavigateData(navigateData)
    if (selectedRow === id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(id);
    }
  }

  const onClickFilterHandler = () => {
    setShowFilter((prev => !prev))
  }

  const onClickShowCardHandler = () => {
    navigate(`/card/${selectedRow}`, {state: navigateData})
  }

  const onClickCreateCardHandler = ()=>{
    navigate("/create" )
  }

  const onclickEditHandler = ()=>{
    navigate(`/edit/${selectedRow}`, {state: navigateData})
  }

  return (
    <>
      {
        isLoading
          ?
          <Loader/>
          :
          <TableContainer component={Paper}>
            <ButtonGroup variant="outlined" size="small" aria-label="buttons group" sx={{
              '& button:focus': {
                outline: 'none',
              }
            }}>
              <IconButton>
                <CachedOutlinedIcon/>
              </IconButton>
              <IconButton onClick={onClickFilterHandler}>
                {showFilter ? <FilterListOffIcon/> : <FilterListIcon/>}
              </IconButton>
              <Button onClick={onClickCreateCardHandler}>Добавить</Button>
              <Button disabled={selectedRow === null} onClick={onClickShowCardHandler}>Просмотреть</Button>
              <Button disabled={selectedRow === null} onClick={onclickEditHandler}>Редактировать</Button>
            </ButtonGroup>
            {showFilter && <Input placeholder="Введите значение фильтра" sx={{display: 'block', margin: "1rem"}}/>}
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
                  data.map(row => <TableRow
                    onClick={() => {
                      onClickRowHandler(
                        row.f_pers_young_spec_id,
                        row.rep_beg_period,
                        row.rep_end_period,
                        row.org_employee,
                        customizedYearCeilData(row.rep_beg_period)
                      )
                    }}
                    key={row.f_pers_young_spec_id}
                    sx={{backgroundColor: selectedRow === row.f_pers_young_spec_id ? '#e0f7fa' : 'inherit'}}
                  >
                    <TableCell>
                      {
                        customizedPeriodCeilData(row.rep_beg_period, row.rep_end_period)
                      }
                    </TableCell>
                    <TableCell>
                      {
                        customizedYearCeilData(row.rep_end_period)
                      }
                    </TableCell>
                  </TableRow>)
                }
              </TableBody>
            </Table>
          </TableContainer>
      }
    </>
  )
}


