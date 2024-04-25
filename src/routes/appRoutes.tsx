import {App} from "../App.tsx";
import {useRoutes} from "react-router-dom";
import {Card} from "../components/Card";


export const AppRoutes = () => {
  return useRoutes([
      {
        path: '/',
        element: <App/>,
        children: [

        ],
      },
      {
        path: '/card/:id',
        element: <Card/>,
      },
    {
      path: "/create",
      element: <Card mode={'create'}/>,
    },
    ]
  );
}


