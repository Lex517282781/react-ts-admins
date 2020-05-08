import { mergeWith } from 'lodash'
import { FieldsConfig } from './interface'

export const defaultRangeMap = {
  orderTime: {
    fields: ['orderStartTime', 'orderEndTime'],
    format: 'YYYY-MM-DD HH:mm:ss'
  },
  deliverTime: {
    fields: ['deliverStartTime', 'deliverEndTime'],
    format: 'YYYY-MM-DD HH:mm:ss'
  },
  createTime: {
    fields: ['createTimeBegin', 'createTimeEnd'],
    format: 'YYYY-MM-DD HH:mm:ss'
  }
}

export const getFieldsConfig = (partial?: FieldsConfig): FieldsConfig => {
  const defaultConfig = {}
  return mergeWith(defaultConfig, partial)
}

export const namespace = 'common'
