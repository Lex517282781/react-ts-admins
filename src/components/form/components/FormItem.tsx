import React, { useContext, useMemo } from 'react'
import {
  Form,
  Input,
  Row,
  Col
} from 'antd'
import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import { mergeWith } from 'lodash'
import { FormTypePops, ExtendSourceFormItemProps, FormItemProps, DataProps } from '../config/interface'
import { namespace as defaultnamespace, getFieldsConfig } from '../config/config'
import FormContext, { ContextProps } from '../Context'

const Item = Form.Item

/** 渲染formitem控件部件 */
function renderWrapperContent (
  payload: {
    name?: string,
    type?: FormTypePops,
    formItemProps: ExtendSourceFormItemProps,
    form: WrappedFormUtils,
    children: any,
    fieldDecoratorOptions: GetFieldDecoratorOptions
  }
) {
  const {
    name,
    type,
    form,
    children,
    fieldDecoratorOptions
  } = payload
  const formItemProps = Object.assign({}, payload.formItemProps)
  delete formItemProps.addonAfterCol
  if (form && name) {
    /** 如果字段存在，type为text或是form不存在的情况下 */
    if (type === 'text') {
      return (
        <>
          <Item
            {...formItemProps}
            wrapperCol={{ span: 24 }}
          >
            {children}
          </Item>
          <Item
            style={{ display: 'none' }}
          >
            {
              form.getFieldDecorator(
                name
              )(
                <Input />
              )
            }
          </Item>
        </>
      )
    } else {
      return (
        <Item
          {...formItemProps}
          wrapperCol={{ span: 24 }}
        >
          {
            form.getFieldDecorator(
              name,
              {
                ...fieldDecoratorOptions
              }
            )(
              children
            )
          }
        </Item>
      )
    }
  } else {
    return (
      <Item
        {...formItemProps}
        wrapperCol={{ span: 24 }}
      >
        {children}
      </Item>
    )
  }
}

function FormItem (props: FormItemProps) {
  const context = useContext<ContextProps>(FormContext)
  const { name, addonAfter, className, style } = props
  const namespace = props.namespace || (context && context.props && context.props.namespace) || defaultnamespace
  const form = context && context.props && context.props.form
  const config = (context.props && context.props.config) || getFieldsConfig()
  const layout = (context.props && context.props.layout) || 'horizontal'
  const option = useMemo(() => {
    const data: DataProps = mergeWith(
      {
        optionFieldexchange: { label: 'label', value: 'value' },
        controlProps: {},
        formItemProps: {},
        fieldDecoratorOptions: { rules: [] }
      },
      config && config[namespace] && name && config[namespace][name],
      props
    )
    data.options = props.options && props.options.length > 0 ? props.options : data.options
    const optionFieldexchange = Object.assign({}, data.optionFieldexchange)
    if (data.options instanceof Array) {
      data.options = data.options.map((item: any) => {
        return {
          ...item,
          label: item[optionFieldexchange.label],
          value: item[optionFieldexchange.value]
        }
      })
    }
    data.type = data.name && (data.type || 'input')
    const verifiable = props.verifiable || false
    data.fieldDecoratorOptions.rules = verifiable ? data.fieldDecoratorOptions.rules : []
    data.controlProps = Object.assign({}, data.controlProps)
    data.formItemProps = Object.assign({}, data.formItemProps, {
      labelCol: data.labelCol || data.formItemProps.labelCol || context.props.labelCol,
      wrapperCol: data.wrapperCol || data.formItemProps.wrapperCol || context.props.wrapperCol,
      addonAfterCol: data.addonAfterCol || data.formItemProps.addonAfterCol || context.props.addonAfterCol,
      colon: !(data.name || data.label) ? false : (props.colon !== undefined ? props.colon : true),
      required: data.required !== undefined ? data.required : data.fieldDecoratorOptions.rules && (data.fieldDecoratorOptions.rules.length > 0)
    })
    if (layout === 'horizontal' && !data.formItemProps.labelCol) {
      data.formItemProps.labelCol = { span: 4 }
    }
    if (layout === 'horizontal' && !data.formItemProps.wrapperCol) {
      data.formItemProps.wrapperCol = { span: 20 }
    }
    return data
  }, [props, context.props.config, context.props.namespace])
  const {
    type,
    label,
    formItemProps,
    fieldDecoratorOptions
  } = option
  const { labelCol, wrapperCol, addonAfterCol, colon } = formItemProps
  const children = props.children || (props.inner && props.inner(form))
  const hidden = props.hidden || false
  const readonly = option.readonly !== undefined ? option.readonly : (context.props.readonly || false)
  const required = readonly ? false : formItemProps.required
}

export default FormItem
