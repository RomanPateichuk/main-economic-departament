import React, {ChangeEvent, useEffect, useState} from "react"
import {
  Alert,
  Button,
  ButtonGroup, IconButton, MenuItem,
  Paper, Select, SelectChangeEvent, Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, TablePagination,
  TableRow, TableSortLabel, Tooltip
} from "@mui/material"
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import {useNavigate} from "react-router-dom";
import {useGetHeaderDataQuery} from "./redux";
import {customizedPeriodCeilData, customizedYearCeilData} from "./helpers/customizedDate.ts";
import {Loader} from "./components/Loader/Loader.tsx";

export const App: React.FC = () => {
  const {data = [], isLoading, isError, refetch} = useGetHeaderDataQuery()
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [navigateData, setNavigateData] = useState({})
  const [showSnackBar, setShowSnackBar] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      setShowSnackBar(true);
      setTimeout(() => setShowSnackBar(false), 3000);
    }
  }, [isError]);

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

  const onClickCreateCardHandler = () => {
    navigate("/create")
  }

  const onclickEditHandler = () => {
    navigate(`/edit/${selectedRow}`, {state: navigateData})
  }

  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortBy) {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      return 0
    }
    return 0
  });

  const rowsPerPageOptions = [10, 25, 35]

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0])


  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {

    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)

  }

  const [filter, setFilter] = useState("insert_date")

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value)
  };

  useEffect(() => {
    setFilter("insert_date")
  }, [showFilter]);

  type FilterValuesType = {
    [key: string]: string
  }

  const filterValues: FilterValuesType = {
    "insert_date": "По дате добавления",
    "rep_beg_period": "По дате начала отчетного периода",
    "rep_end_period": "По дате конца отчетного периода",
    "update_date": "По дате обновления"
  } as const

  const refetchHandler = () => {
    refetch()
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
              <IconButton onClick={refetchHandler}>
                <CachedOutlinedIcon/>
              </IconButton>
              <IconButton onClick={onClickFilterHandler}>
                {showFilter ? <FilterListOffIcon/> : <FilterListIcon/>}
              </IconButton>
              <Button onClick={onClickCreateCardHandler}>Добавить</Button>
              <Button disabled={selectedRow === null} onClick={onClickShowCardHandler}>Просмотреть</Button>
              <Button disabled={selectedRow === null} onClick={onclickEditHandler}>Редактировать</Button>
            </ButtonGroup>
            {showFilter && <Select
                sx={{display: 'block', width: "55%", margin: "1rem"}}
                value={filter}
                size={"small"}
                onChange={handleFilterChange}
            >
                <MenuItem value={"insert_date"}>По дате добавления</MenuItem>
                <MenuItem value={"rep_beg_period"}>По дате начала отчетного периода</MenuItem>
                <MenuItem value={"rep_end_period"}>По дате конца отчетного периода</MenuItem>
                <MenuItem value={"update_date"}>По дате обновления</MenuItem>
            </Select>
            }
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Tooltip title={filterValues[filter]} placement="left-start">
                      <TableSortLabel
                        active={sortBy === filter}
                        direction={sortBy === filter ? sortOrder : 'asc'}
                        onClick={() => handleSort(filter)}
                      >
                        За период
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Сортировать по году конца отчетного периода" placement="left-start">
                      <TableSortLabel
                        active={sortBy === "rep_beg_period"}
                        direction={sortBy === "rep_beg_period" ? sortOrder : 'asc'}
                        onClick={() => handleSort("rep_beg_period")}
                      >
                        Год
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {
                  sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => <TableRow
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
                        `${index + 1}.` + ' ' + customizedPeriodCeilData(row.rep_beg_period, row.rep_end_period)
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
            <TablePagination
              labelRowsPerPage="Строк на странице:"
              labelDisplayedRows={({from, to, count}) => `От ${from} до ${to} из ${count}`}
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, page) => {
                setPage(page)
              }}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
      }
      <Snackbar open={showSnackBar} autoHideDuration={3000}>
        <Alert severity="error">
          Что-то пошло не так. Попробуйте еще раз
        </Alert>
      </Snackbar>
    </>
  )
}


