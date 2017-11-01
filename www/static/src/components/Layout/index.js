import PropTypes from 'prop-types';
import Header from './Header'
import Slider from './Slider'
import Content from './Content'
// import Bread from './Bread'
// import Footer from './Footer'
import styles from './index.less'
import { Layout } from 'antd';

const MainLayout = ({children,data})=>{
  return (
    <Layout className={styles.layout}>
      <Header data={data}/>
      <div className={styles.container}>
        <Slider data={data.slider}/>
        <Content children={children} />
      </div>
    </Layout>
  )
}


MainLayout.PropTypes = {
  children: PropTypes.element.isRequired,
}

export default MainLayout
