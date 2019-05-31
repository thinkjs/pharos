import * as React from 'react'

export default (props) => {
  const { className = '', type, ...rest } = props;
  return <i className={`iconfont icon-${type} ${className}`} {...rest} />
}


export function SvgIcon(props) {
  const { className = "", name } = props;
  return (
    <svg className={`icon ${className}`} aria-hidden="true">
      <use xlinkHref={"#icon" + name} />
    </svg>
  )
}

