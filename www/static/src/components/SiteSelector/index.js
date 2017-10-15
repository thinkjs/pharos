import React from 'react';
import {Select} from 'antd';
import {site} from 'services';

const Option = Select.Option;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites:[]
    };
  }

  async componentWillMount(){
    let sites = await site.query();
    this.setState({sites});
  }

  render(){
    return (
      <Select
        style={{width:200}}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...this.props}
      >
        {
          this.state.sites.map((s,i)=>
            <Option key={i} value={s.id.toString()} label={s.name}>{s.name}</Option>
          )
        }
      </Select>
    )
  }

}
