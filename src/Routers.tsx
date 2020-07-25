import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'
import Layout from './layout'
import { categorys } from './layout/config'

const routers = categorys.reduce((pre: any, next: any) => {
  return [
    ...pre,
    ...(next.list || [])
  ]
}, [])

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Layout} />
      {
        routers.map((router: any) => (
          <Route
            key={router.url}
            path={router.url}
            component={router.component}
          />
        ))
      }
      <Route component={Layout} />
    </Switch>
  </BrowserRouter>
)
