import React from 'react'
import { ImgWrapProps } from '../config/interface'
import classNames from 'classnames'
import styles from '../style.module.styl'

/** 选择图组件 */
const ImgWrap = ({ index, overflow, item, active, onItemClick, onRefreshClick }: ImgWrapProps) => {
  const cls = classNames(
    styles[`clip-preview-wrap`],
    styles[`clip-preview-wrap-content`],
    { [styles[`clip-preview-wrap-active`]]: active }
  )

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
        {
          overflow &&
          (
            <div className={styles[`clip-preview-error`]}>
              <span className={styles[`clip-preview-error-inner`]}>超出大小</span>
            </div>
          )
        }
      </div>
      <div onClick={onRefreshClick.bind(null, index)} className={styles[`clip-preview-text`]}>
        恢复原图
      </div>
    </div>
  )
}

export default ImgWrap
