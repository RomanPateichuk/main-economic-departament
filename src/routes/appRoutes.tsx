import {App} from "../App.tsx";
import {useRoutes} from "react-router-dom";
import {Card} from "../components/Card/Card.tsx";

export const AppRoutes = () => {
    const element = useRoutes([
      {
        path: '/',
        element: <App/>
      },
      {
        path: '/card/:id',
        element: <Card/>,
      },
        {
          path: '/create',
          element: <Card mode={"create"}/>,
        }

  ]
);
return element
}


