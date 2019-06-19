import * as React from 'react'
import './fieldset.less';
import Row from './row';



class Fieldset extends React.Component<any, any>{

  static defaultProps = {
    small: false,
    className: ''
  }
  static Row: typeof Row;
  render() {
    let className = 'fieldset--pc';
    if (this.props.small) {
      className += ' no-padding';
    }
    className += ' ' + this.props.className;
    return (
      <fieldset className={className}>{this.props.children}</fieldset>
    );
  }
}
Fieldset.Row = Row;
export { Fieldset };
export default Fieldset;
