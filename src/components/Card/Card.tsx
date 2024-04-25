import 'dayjs/locale/ru';
import React from "react"
import {useLocation} from "react-router-dom"
import {Header} from "../Header";
import {Table} from "../Table"

type PropType = {
  mode?: 'show' | 'create' | 'edit',
}

export const Card: React.FC<PropType> = React.memo(({mode = 'show'}) => {
  const location = useLocation()

  return (
    <>
      <Header mode={mode} locationState={location.state}/>
      {mode !== 'create' && <Table mode={mode} locationState={location.state}/>}
    </>
  )
})