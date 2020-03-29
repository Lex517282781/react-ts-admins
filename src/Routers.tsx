import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'
import Layout from './layout'
import ClipUpload from './pages/clip-upload'
import ActionView from './pages/action-view'
import ColorPicker from './pages/color-picker'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Layout} />
      <Route path='/clip-upload' component={ClipUpload} />
      <Route path='/action-view' component={ActionView} />
      <Route path='/color-picker' component={ColorPicker} />
      <Route component={Layout} />
    </Switch>
  </BrowserRouter>
)
