import React, { PureComponent } from 'react'
import { Form } from 'antd'
import moment from 'moment'
import { defaultRangeMap, getFieldsConfig } from './config/config'
import { FormProps } from './config/interface'
import { hasOwnProperty } from './config/util'

function handleValues <T = any> (
  rangeMap: { [field: string]: { fields: string[], format?: string } },
  rawValues: any
): T {
  for (const field in rangeMap) {
    if (field in rangeMap) {
      if (field in rawValues) {
        const rangeFields = rangeMap[field]
        const rangeValue: any[] = rawValues[field] || []
        rangeFields.fields.map((rangeField, index) => {
          rawValues[rangeField] = rangeValue[index] && rangeValue[index].format && (
            rangeFields.format ? rangeValue[index].format(rangeFields.format) : rangeValue[index].unix() * 1000
          )
        })
        /** 是否存在日期字段与映射字段重复场景 */
        if (rangeFields.fields.indexOf(field) === -1) {
          delete rawValues[field]
        }
      }
    }
  }
  // console.log(rawValues, 'result =-------')
  return rawValues
}

let tempSilent: boolean | undefined

class FormMain extends PureComponent<FormProps> {
  public static create = Form.create
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
  }

  public componentDidMount () {
    if (this.props.mounted) {
      this.props.mounted()
    }
  }

  public componentDidUpdate () {
    if (this.props.updated) {
      this.props.updated()
    }
  }

  public componentWillUnmount () {
    if (this.props.destroyed) {
      this.props.destroyed()
    }
  }

  public asyncSetValues (values: {[field: string]: any}) {
    setTimeout(() => {
      this.setValues(values)
    }, 0)
  }

  public setValues (values: { [field: string]: any }, silent?: boolean) {
    silent = silent !== undefined ? silent : this.props.silent
    if (!values) {
      return
    }
    values = { ...values }
    const rangeMap = this.props.rangeMap || defaultRangeMap
    for (const field in rangeMap) {
      const rangeFields = rangeMap[field]
      const rangeValue: any[] = []
      /** 是否存在日期字段 */
      let isExistField = false
      rangeFields.fields.map((rangeField) => {
        rangeValue.push(
          values[rangeField] && moment(values[rangeField])
        )
        if (hasOwnProperty(values, rangeField)) {
          isExistField = true
        }
        delete values[rangeField]
      })
    }
    /** 过滤掉未注册form数据 */
    const rawValues = this.props.form.getFieldsValue()
    const result: any = {}
    for (const key in rawValues) {
      if (hasOwnProperty(rawValues, key) && hasOwnProperty(values, key)) {
        result[key] = values[key]
      }
    }
    tempSilent = silent
    this.props.form.setFieldsValue(result, () => {
      tempSilent = undefined
    })
    const { onChange } = this.props
    if (silent !== true && onChange) {
      onChange(undefined, result, result)
    }
  }

  public getValues <T = any> (): T {
    const rawValues: any = this.props.form.getFieldsValue()
    const rangeMap = this.props.rangeMap || defaultRangeMap
    return {
      ...handleValues<T>(rangeMap, rawValues)
    }
  }

  public renderItems () {
    const nodes: React.ReactNode[] = []
    const config = this.props.config || getFieldsConfig()
    for (const namespace in config) {
      const fields = config[namespace]
      for (const field in fields) {
        const item = fields[field]
        // const node =
        // nodes.push(node)
      }
    }
  }

  render () {
    return (
      <div>Form</div>
    )
  }
}

export default Form.create<FormProps>({})(FormMain)
