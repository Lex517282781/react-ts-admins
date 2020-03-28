import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Layout from './layout'
import ClipUpload from './pages/clip-upload'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Layout} />
      <Route path='/clip-upload' component={ClipUpload} />
      <Route component={Layout} />
    </Switch>
  </BrowserRouter>
)
