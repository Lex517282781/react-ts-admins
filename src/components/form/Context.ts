import React from 'react'
import { FormProps } from './config/interface'

export interface ContextProps {
  props: FormProps
}

const FormContext = React.createContext<any>({
  props: {}
})

export default FormContext
