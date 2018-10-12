import Link from 'next/link';

const LinkStyle = {
    marginRight: 15,
    color: 'red'
}

const Header = () => (
    <nav>
        <Link href="/">
            <a style={LinkStyle}>Home</a>
        </Link>
        <Link href="/article">
            <a style={LinkStyle}>article</a>
        </Link>
    </nav>
)

export default Header;