import React from 'react';
import moment from 'moment';
import { FilterWrapper, SiteSelector } from 'components';
import { constant } from 'utils';
import { Row, Col, DatePicker, Select, Alert } from 'antd';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const Filter = ({ start_time, end_time, site_id, type, handleSearch }) => {

  const colSpan = 6;

  const handleChange = (val, key) => {
    handleSearch({ [key]: val })
  };

  const handleTimeChange = (val) => {
    if (val.length === 0) {
      handleSearch({
        start_time: '',
        end_time: ''
      });
      return;
      k
    }
    let [start_time, end_time] = [moment(val[0]).format('YYYY-MM-DD'), moment(val[1]).format('YYYY-MM-DD'),];
    handleSearch({ start_time, end_time });
  };

  return (
    <FilterWrapper>
      <Row gutter={20}>
        {
          /*
          <Col span={colSpan}>
            <SiteSelector
              placeholder="请选择项目"
              value={site_id}
              onChange={(val) => handleChange(val, 'site_id')}
            />
          </Col>
          <Col span={colSpan}>
            <Select value={type} style={{ width: 200 }} onChange={(val)=>handleChange(val,'type')}>
              {
                constant.PERF_TYPES.map((item) => {
                  return (
                    <Option {...item}>{item.label}</Option>
                  )
                })
              }
            </Select>
          </Col>  
          */
        }
        <Col span={colSpan}>
          <RangePicker
            ranges={{ '今天': [moment(), moment()], '本月': [moment(), moment().endOf('month')] }}
            value={start_time && end_time ? [moment(start_time), moment(end_time)] : null}
            onChange={handleTimeChange}
            size="large"
          />
        </Col>
        <Col span={colSpan}>
          <Alert message="默认显示今日数据" type="info" showIcon />        
        </Col>
      </Row>
    </FilterWrapper>
  )
};

export default Filter
