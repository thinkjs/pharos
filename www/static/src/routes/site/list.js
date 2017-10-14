import React from 'react'
import {Table,Spin} from 'antd';


const List = ({data, onEdit, onDelete,onPageChange, pagination, loading})=> {
  const columns = [
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, item)=> {
        return (
          <span>
            <a onClick={()=>onEdit(item)}>编辑</a>
            <span className="ant-divider"/>
            <a onClick={()=>onDelete(item.id)}>删除</a>
          </span>
        )
      }
    },
    {
      title: '网站名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '网站地址',
      dataIndex: 'url',
      key: 'url',
      render(val){
        return (
          <a href={val} target="_blank">{val}</a>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={data}
        onChange={onPageChange}
        pagination={pagination}
      />
    </Spin>
  )
};

export default List
