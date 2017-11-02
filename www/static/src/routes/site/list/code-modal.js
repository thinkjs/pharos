import React from 'react';
import { Form, Modal,Alert } from 'antd';
import styles from './style.less';

const modal = ({
  current = {},
  code,
  ...modalProps,
}) => {

  const modalOpts = {
    ...modalProps,
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <Alert message="此代码同时适用于PC端、移动端的页面，请将此代码复制并粘贴到您要跟踪的每个网页中。" type="info" showIcon />
        <pre className={styles.code}>
          {code}
        </pre>
      </Form>
    </Modal>
  )
}

export default Form.create()(modal)
