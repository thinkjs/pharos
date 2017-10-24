import React from 'react';
import PropTypes from 'prop-types';
import {Icon,Select} from 'antd';
import { config } from 'utils'
import styles from '../index.less'
const Option = Select.Option;

const ProjectSelector = ({site}) => {
  const {sites,onChange,currentSite} = site;
  return (
    <div className={styles.project}>
      <Select 
        defaultValue={currentSite.id ? currentSite.id.toString():''}
        style={{ width: 120 }}
        size="small"
        onChange={onChange}
       >
      {
        sites.map((item,index)=>{
          return(
            <Option value={item.id.toString()} key={item.id} label={item.name}>{item.name}</Option>      
          )
        })
      }
    </Select>
    </div>
  )
};

export default ProjectSelector
