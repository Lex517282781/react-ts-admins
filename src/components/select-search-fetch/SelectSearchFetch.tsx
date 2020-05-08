import React, { PureComponent } from 'react'
import { Select, Spin } from 'antd'
import { SelectProps } from 'antd/lib/select'
import debounce from 'lodash/debounce'

const { Option } = Select

interface SelectSearchFetchProps extends SelectProps {
  /* 下拉异步请求分页接口 */
  api?: (props?: any) => Promise<any>
  /* 下拉异步请求全部数据接口 */
  allApi?: (props?: any) => Promise<any>
  /* 数据变动回调 */
  onChange?: (val: any) => void
  /* 下拉选择值 */
  value?: any
}

interface SelectSearchFetchState {
  /* 下拉列表 */
  records: {value: string, text: string}[]
  /* 当前页码 */
  current: number
  /* 总页码 */
  pages: number
  /* 单页大小 */
  size: number
  /* 总数据 */
  total: number
  /* 搜索关键字 */
  keyword: string | undefined
  /* 加载动画 */
  fetching: boolean
  /* 下拉选择值 */
  value?: string
}

class SelectSearchFetch extends PureComponent<
  SelectSearchFetchProps,
  SelectSearchFetchState
> {
  /* 是否加载全部 */
  public fetchAll = !!this.props.allApi
  /* 是否正在输入 */
  public focus = false
  constructor (props: SelectSearchFetchProps) {
    super(props)
    this.handleSearch = debounce(this.handleSearch, 800)
    this.state = {
      records: [],
      current: 1,
      pages: 0,
      size: 10,
      total: 0,
      keyword: '',
      fetching: false,
      value: undefined
    }
  }

  private static getDerivedStateFromProps (
    nextProps: SelectSearchFetchProps,
    preState: SelectSearchFetchState
  ) {
    if (nextProps.value === undefined) return null
    return {
      value: nextProps.value
    }
  }

  /* 获取数据 */
  fetchData = ({ page = 1, keyword = undefined } = {}) => {
    const { api } = this.props
    const { keyword: preKeyword, size, records } = this.state
    this.setState({ fetching: true })
    const currKeyword = keyword === undefined ? preKeyword : keyword
    if (api) {
      api({
        page,
        pageSize: size,
        keyword: currKeyword
      })
        .then((res) => {
          this.setState({
            records: page === 1 ? res.records : [...records, ...res.records],
            current: res.current,
            size: res.size,
            total: res.total,
            pages: res.pages,
            fetching: false,
            keyword: currKeyword
          })
        })
    }
  }

  /* 获取全部数据 */
  fetchAllData = () => {
    const { allApi } = this.props
    if (!allApi) {
      this.fetchData()
      return
    }
    this.setState({ records: [], fetching: true })
    allApi()
      .then((records) => {
        this.setState({
          records,
          fetching: false
        })
      })
  }

  /* 搜索数据 */
  handleSearch = (value: string) => {
    if (!this.focus) {
      return
    }
    const params: any = {
      page: 1,
      keyword: value?.trim()
    }
    this.fetchData(params)
  }

  /* 选择数据 */
  handleChange = (value: any) => {
    const { onChange } = this.props
    onChange && onChange(value)
  }

  /* 获取焦点 */
  handleFocus = () => {
    const { records } = this.state
    this.focus = true
    if (records.length) {
      return
    }
    if (this.fetchAll) {
      this.fetchAllData()
    } else {
      this.fetchData()
    }
  }

  handleBlur = () => {
    this.focus = false
  }

  /* 下拉滚动 */
  handlePopupScroll = (e: any) => {
    e.persist()
    const { target } = e
    const { current, pages, fetching } = this.state
    if (current === pages) {
      // 当前页码等于总页码 表示已经加载至最后一页 再下拉也无需请求数据
      return
    }
    if (fetching) {
      // 当正在请求数据的时候 重新触发该方法的时候不需要再发送请求
      return
    }
    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      this.fetchData({
        page: current + 1
      })
    }
  }

  render () {
    const { placeholder, api, ...rest } = this.props
    const { fetching, records, value = undefined } = this.state

    console.log(value, records)

    return (
      <Select
        showSearch
        value={value}
        placeholder={placeholder || '请选择'}
        defaultActiveFirstOption={false}
        notFoundContent={fetching ? <Spin size='small' /> : null}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {
          ...(
            this.fetchAll
              ? null
              : {
                onPopupScroll: this.handlePopupScroll
              }
          )
        }
        {...rest}
      >
        {records.map(d => (
          <Option value={d.value} key={d.value}>{d.text}</Option>
        ))}
      </Select>
    )
  }
}

export default SelectSearchFetch
