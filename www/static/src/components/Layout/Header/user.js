import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import { config } from 'utils'
import styles from '../index.less'

const User = ({user}) => {
  return (
    <div className={styles.user}>
      <span><Icon type="user" /> {USER.display_name}</span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span className={styles.logout} onClick={user.logout}>注 销</span>
    </div>
  )
};

User.PropTypes = {
  user: PropTypes.element.isRequired
};

export default User
