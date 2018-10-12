import Layout from '../components/MyLayout'

const PostLink = (prop) => (
    <li>
        <Link href={`/post?title=${prop.title}`}>
            <a>{prop.title}</a>
        </Link>
    </li>
);





export default () => (
    <Layout>
        <h1>My Blog</h1>
        <ul>
            <PostLink title="Holle Next.js" />
            <PostLink title="Learn Next.js is Awesome" />
            <PostLink title="destory Next.js is Awesome" />
        </ul>
    </Layout>
);
