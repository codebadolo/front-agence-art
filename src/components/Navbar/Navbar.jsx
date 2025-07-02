import { Menu } from 'antd';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <Menu mode="horizontal" theme="light">
      <Menu.Item key="home"><Link to="/">Accueil</Link></Menu.Item>
      <Menu.Item key="talents"><Link to="/talents">Nos Talents</Link></Menu.Item>
      <Menu.Item key="actualites"><Link to="/actualites">Actualités</Link></Menu.Item>
      <Menu.Item key="projets"><Link to="/projets">Projets</Link></Menu.Item>
      <Menu.Item key="contact"><Link to="/contact">Contact</Link></Menu.Item>
      <Menu.Item key="apropos"><Link to="/apropos">À propos</Link></Menu.Item>
    </Menu>
  );
}
