import React from 'react';
import PropTypes from 'prop-types'
import styles from './index.less'

const Page = ({children,title}) => {
  return (
    <div className={styles.page}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.container}>{children}</div>
    </div>
  )
}

Page.PropTypes = {
  children: PropTypes.element.isRequired,
}

export default Page
