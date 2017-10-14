import React from 'react';
import PropTypes from 'prop-types'
import styles from './index.less'

const FilterWrapper = ({children}) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}

FilterWrapper.PropTypes = {
  children: PropTypes.element.isRequired,
}

export default FilterWrapper
