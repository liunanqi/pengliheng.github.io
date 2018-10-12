import Layout from '../components/MyLayout'
import Link from 'next/link';
import Axios from 'axios';

const PostLink = (props) => (
    <li>
        <Link as={`p/${props.id}`} href={`/post?id=${props.id}`}>
            <a>{props.title}</a>
        </Link>
    </li>
);





const Index = props => (
    <Layout>
        <h1>My Blog</h1>
        <ul>
            {
                props.shows.map(({show})=>(
                    <PostLink id={show.id} key={show.id} title={show.name} />
                ))
            }
        </ul>
    </Layout>
);



Index.getInitialProps = async function () {
    return await Axios.get('https://api.tvmaze.com/search/shows?q=batman')
        .then(res=>{
            console.log(res.data);
            
            return {shows: res.data};
        })
}

export default Index;