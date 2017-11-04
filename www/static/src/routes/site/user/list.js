import React from 'react'
import {Table,Spin,Select} from 'antd';
import {constant} from 'utils';
const Option = Select.Option;
const List = ({data, onEdit, onDelete, loading,pagination})=> {
  const columns = [
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, item)=> {
        return (
          <span>        
            <a onClick={()=>onDelete(item.id)}>删除</a>
          </span>
        )
      }
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '昵称',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'status',
      key: 'status',
      render(val,item){
        return (
          <Select
            style={{width:100}}
            defaultValue={val.toString()}
            onChange={(val)=>onEdit(val,item)}
          >
            {
              constant.SITE_USER_STATUS.map(item=>{
                return (
                  <Option {...item}>{item.label}</Option>
                )
              })
            }
          </Select>
        )
      }
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={data}
        size="middle"
        pagination={pagination}
      />
    </Spin>
  )
};

export default List
