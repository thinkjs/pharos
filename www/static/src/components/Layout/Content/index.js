import React from 'react';
import styles from '../index.less'
import PropTypes from 'prop-types';

const MainContent = ({children}) => {
  // console.log(children)
  return (
    <div className={styles.content}>
    	{children}
    </div>
  )
}

MainContent.PropTypes = {
  children: PropTypes.element.isRequired,
}

export default MainContent
