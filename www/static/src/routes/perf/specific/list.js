import React from 'react'
import {Table,Spin} from 'antd';


const List = ({data, columns = [], onPageChange, pagination, loading,...props})=> {
  console.log(props)
  return (
    // <Spin spinning={loading}>
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={data}
        onChange={onPageChange}
        pagination={pagination}
        size="middle"
        {...props}
      />
    // </Spin>
  )
};

export default List
