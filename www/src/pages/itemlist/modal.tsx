import * as React from "react";
import {
  Input,
  Modal,
  Form
}
  from "antd";
import { FormComponentProps } from 'antd/lib/form';
interface Props extends FormComponentProps {
  keyValue?: string,
  name?: string,
  address?: string,
  onCreate?: () => void,
  visible?: boolean
}
// class ModalForm extends React.Component<any, any>{
//   constructor(props) {
//     super(props)
//   }
//   render() {
//     const { onCreate, form, name, address, keyValue, visible } = this.props;
//     const { getFieldDecorator } = form;
//     return (
//       <Modal
//         title="提示"
//         visible={true}
//         onOk={onCreate}
//       >
//         <Form onSubmit={() => { }} className="login-form">
//           <Form.Item label="名称">
//             {getFieldDecorator('name', {
//               initialValue: name,
//               rules: [{ required: true, message: 'Please input your name!' }],
//             })(
//               <Input />,
//             )}
//           </Form.Item>
//           <Form.Item label="地址">
//             {getFieldDecorator('address', {
//               initialValue: address,
//               rules: [{ required: true, message: 'Please input your address!' }],
//             })(
//               <Input />,
//             )}
//           </Form.Item>
//         </Form>
//       </Modal>
//     )
//   }
// }
// export const ExtendModal = Form.create<Props>(ModalForm);
