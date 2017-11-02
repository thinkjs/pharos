import React from 'react'
import {FilterWrapper} from 'components';
import {constant,auth} from 'utils';

import {Input, Row, Col, Button} from 'antd';

const Search = Input.Search;

const Filter = ({handleSearch, condition, onAdd})=> {
  return (
    <FilterWrapper>
      <Row gutter={20}>
        <Col span={5}>
          <Search
            placeholder="请输入用户名/姓名/手机"
            style={{ width: 200 }}
            onSearch={handleSearch}
            defaultValue={condition}
          />
        </Col>
        <Col offset={22}>
          <Button type="primary" onClick={onAdd}>新增</Button>
        </Col>
      </Row>
    </FilterWrapper>
  )
};

export default Filter
