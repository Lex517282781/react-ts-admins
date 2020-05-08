import { FormComponentProps, FormItemProps as SourceFormItemProps } from 'antd/lib/form'
import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/lib/form/Form'

/** 表单类型 */
export type FormTypePops = '' | 'input' | 'number' | 'text' | 'rangepicker' | 'select' | 'radio' | 'checkbox' | 'date' | 'textarea'

/** 控件原属性 */
export interface ControlProps {
  className?: string
  style?: React.CSSProperties
  placeholder?: string | string[]
  [props: string]: any
}

export interface OptionProps {
  className?: string
  style?: React.CSSProperties
  field?: string
  type?: FormTypePops
  label?: React.ReactNode
  options?: any[]
  /** option数据字段转换 */
  optionFieldexchange?: {label: string, value: string}
  /** 控件原属性 */
  controlProps?: ControlProps
  fieldDecoratorOptions?: GetFieldDecoratorOptions
  /** 多选时启用，参数为全部的值，点击全部勾选或全部取消勾选 */
  allValue?: any
}

export type NamespaceProps = string

export interface FieldsConfig {
  [namespace: string]: { [field: string]: OptionProps }
}

/** form 属性 */
export interface FormProps extends FormComponentProps {
  /** 是否显示搜索、清除按钮 */
  showButton?: boolean
  /** 搜索按钮标题 */
  searchText?: string
  /** 重置按钮标题 */
  clearText?: string
  config?: FieldsConfig
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'middle'
  layout?: 'inline' | 'horizontal' | 'vertical'
  onChange?: (field?: string, value?: any, values?: any) => void
  getInstance?: (ref: any) => void
  wrapperCol?: ColProps
  labelCol?: ColProps
  addonAfterCol?: ColProps
  className?: string
  style?: React.CSSProperties
  namespace?: NamespaceProps
  addonAfter?: React.ReactNode
  /** 日期范围字段映射 */
  rangeMap?: {[field: string]: {fields: string[], format?: string}}
  onSubmit?: (value: any, form: FormInstance) => void
  onReset?: () => void
  formItemClassName?: string
  formItemStyle?: React.CSSProperties
  /** setvalues是否触发onChange */
  silent?: boolean
  mounted?: () => void
  destroyed?: () => void
  updated?: () => void
}

/** form 实例 */
export interface FormInstance {
  /** silent为true时不触发form change回调，默认触发 */
  setValues: <T = any> (values: T, silent?: boolean) => void
  asyncSetValues: <T = any> (values: T) => void
  getValues: <T = any> () => T
  resetValues: () => void
  reset: () => void
  props: FormProps
}

export interface ColProps {span?: number, offset?: number}

export interface ExtendSourceFormItemProps extends SourceFormItemProps {
  addonAfterCol?: ColProps
}

export interface FormItemProps extends OptionProps, ExtendSourceFormItemProps {
  hidden?: boolean
  name?: string
  namespace?: string
  className?: string
  style?: React.CSSProperties
  /** 设置后置标签 */
  addonAfter?: React.ReactNode
  children?: React.ReactNode
  inner?: (form: WrappedFormUtils) => React.ReactNode
  placeholder?: string | string[]
  /** 控件是否校验 默认false，不进行校验 */
  verifiable?: boolean
  disabled?: boolean
  readonly?: boolean
}

export interface DataProps extends FormItemProps {
  fieldDecoratorOptions: GetFieldDecoratorOptions
  formItemProps: FormItemProps
}
