import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Layout from './layout'
import ClipUploadPage from '@/pages/clip-upload'
import ActionViewPage from '@/pages/action-view'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Layout} />
      <Route path="/clip-upload" component={ClipUploadPage} />
      <Route path="/action-view" component={ActionViewPage} />
      <Route component={Layout} />
    </Switch>
  </BrowserRouter>
);