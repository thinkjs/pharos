import * as React from 'react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import { Button } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd'
import history from '@utils/history'
import './embed.less'


@inject('projectStore') @observer
class Embed extends React.Component<any, any> {

  componentDidMount() {
    const { projectStore } = this.props
    projectStore.getList()
  }

  render() {
    if (!localStorage.getItem('projectId')) {
      history.push('/project/create')
      return null
    }
    const { projectStore } = this.props
    const { jsString } = projectStore
    return (
      <div className="embed-wrap">
        <div className="embed-wrap-content">
          <div className="copy-btn" onClick={() => message.info('已复制到剪贴板')}>
            <CopyToClipboard text={jsString}>
              <span className="btn-flat">复制</span>
            </CopyToClipboard>
          </div>
          <pre>{jsString}</pre>
        </div>
        <Button type="primary"><Link to="/alarm">进入项目</Link></Button>
      </div>
    )
  }
}

export default Embed