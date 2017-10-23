import React from 'react'
import {Table,Spin} from 'antd';


const List = ({data, columns = [], onPageChange, pagination, loading})=> {

  return (
    <Spin spinning={loading}>
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={data}
        onChange={onPageChange}
        pagination={pagination}
        size="middle"
        scroll={{ x: 2000 }}
      />
    </Spin>
  )
};

export default List
