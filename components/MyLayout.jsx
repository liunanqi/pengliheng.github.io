import Header from './Header'

const layoutStyle = {
    margin: 20,
    padding: 15,
    border: "1px solid #ddd"
}


const Layout = (prop) => (
    <div style={layoutStyle}>
        <Header />
        {prop.children}
    </div>
);

export default Layout;
