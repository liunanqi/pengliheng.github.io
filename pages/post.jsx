import {withRouter} from 'next/router'
import Layout from '../components/MyLayout.jsx'

const Content = withRouter((props) => (
  <div>
    <h1>{props.router.query.title}</h1>
    <p>This is the blog post content.</p>
  </div>
))

const Page = withRouter((props) => (
    <Layout>
       <Content />
       {props.children}
    </Layout>
))

export default Page