import React, { Fragment } from 'react'
import { ImgWrapProps } from '../config/interface'
import classNames from 'classnames'
import styles from '../style.module.styl'

/** 选择图组件 */
const ImgWrap = ({
  index,
  overflow,
  isClip,
  item,
  active,
  onItemClick,
  onRefreshClick
}: ImgWrapProps) => {
  const cls = classNames(
    styles[`clip-preview-wrap`],
    styles[`clip-preview-wrap-content`],
    { [styles[`clip-preview-wrap-active`]]: active }
  )

  let hint: any
  if (!isClip) {
    hint = '待裁剪'
  } else if (overflow) {
    hint = '超出大小'
  } else if (item.width && item.height) {
    hint = (
      <Fragment>
        {item.width}px
        <br />
        x
        <br />
        {item.height}px
      </Fragment>
    )
  }

  return (
    <div className={cls}>
      <div
        title='点击切换裁剪图片'
        onClick={onItemClick.bind(null, index)}
        className={styles[`clip-preview-img-wrap`]}
      >
        <img
          className={styles[`clip-preview-img`]}
          alt='img'
          src={item.url}
        />
        {hint && (
          <div className={styles[`clip-preview-error`]}>
            <span
              className={styles[`clip-preview-error-inner`]}
            >
              {hint}
            </span>
          </div>
        )}
      </div>
      <div
        onClick={onRefreshClick.bind(null, index)}
        className={styles[`clip-preview-text`]}
      >
        恢复原图
      </div>
    </div>
  )
}

export default ImgWrap
