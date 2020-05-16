import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'
import Layout from './layout'

import ClipUpload from './pages/clip-upload'
import ColorPicker from './pages/color-picker'
import Form from './pages/form'
import SelectSearchFetch from './pages/select-search-fetch'

import ActionView from './pages/action-view'
import ListPage from './pages/list-page'
import CarouselPreviewPage from './pages/carousel-preview'
import ColumnWrap from './pages/column-wrap'
import Demo from './pages/demo'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Layout} />
      <Route path='/clip-upload' component={ClipUpload} />
      <Route path='/color-picker' component={ColorPicker} />
      <Route path='/form' component={Form} />
      <Route path='/select-search-fetch' component={SelectSearchFetch} />

      <Route path='/action-view' component={ActionView} />
      <Route path='/list-page' component={ListPage} />
      <Route path='/carousel-preview' component={CarouselPreviewPage} />
      <Route path='/column-wrap' component={ColumnWrap} />
      <Route path='/demo' component={Demo} />

      <Route component={Layout} />
    </Switch>
  </BrowserRouter>
)
