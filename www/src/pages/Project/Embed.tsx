import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd'
import history from '@utils/history'
import './embed.less'


class Embed extends React.Component<any, any> {
  render() {
    if (!localStorage.getItem('projectId')) {
      history.push('/project/create')
      return null
    }

    const text = `<script
  src="//lib.baomitu.com/lightkeeper/latest/pharos.min.js"
  data-siteid=${localStorage.getItem('sid')}
  data-host="//pharos.baomitu.com"  
  >
</script>
<script type="text/javascript">
  window.addEventListener('load', function() {
    pharos.monitor();
  });
</script>`

    return (
      <div className="embed-wrap">
        <div className="embed-wrap-content">
          <div className="copy-btn" onClick={() => message.info('已复制到剪贴板')}>
            <CopyToClipboard text={text}>
              <span className="btn-flat">复制</span>
            </CopyToClipboard>
          </div>
          <pre>{text}</pre>
        </div>
        <Button type="primary"><Link to="/alarm">进入项目</Link></Button>
      </div>
    )
  }
}

export default Embed