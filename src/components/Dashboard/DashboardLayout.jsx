import {
    BarChartOutlined,
    CalendarOutlined,
    DownOutlined,
    IdcardOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined,
    NotificationOutlined,
    ProjectOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "statistiques",
    icon: <BarChartOutlined />,
    label: "Statistiques",
  },
  {
    key: "talents-list",
    icon: <UserOutlined />,
    label: "Talents",
  },
  {
    key: "projets-list",
    icon: <ProjectOutlined />,
    label: "Projets",
  },
  {
    key: "actualites-list",
    icon: <NotificationOutlined />,
    label: "Actualités",
  },
  {
    key: "evenements-list",
    icon: <CalendarOutlined />,
    label: "Événements",
  },
  {
    key: "users-list",
    icon: <TeamOutlined />,
    label: "Utilisateurs",
  },
  {
    key: "profile",
    icon: <IdcardOutlined />,
    label: "Profil",
  },
  {
    key: "parametres",
    icon: <SettingOutlined />,
    label: "Paramètres",
  },
];

export default function DashboardLayout({ children, onMenuSelect }) {
  const [collapsed, setCollapsed] = useState(false);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profil</Menu.Item>
      <Menu.Item key="logout">Déconnexion</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{
          background: "#181c22",
          boxShadow: "2px 0 8px #00000010",
        }}
      >
        {/* Logo + Toggle en haut */}
        <div style={{
          display: "flex",
          alignItems: "center",
          height: 64,
          margin: 16,
          marginBottom: 0,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 8,
          fontWeight: "bold",
          color: "#fff",
          fontSize: 22,
          paddingLeft: collapsed ? 0 : 16,
          transition: "all 0.2s"
        }}>
          <span style={{ flex: 1, display: collapsed ? "none" : "block" }}>Sentinelle Admin</span>
          <span style={{ flex: 1, display: collapsed ? "block" : "none" }}>S</span>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: "#fff", fontSize: 20, marginLeft: 8 }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["statistiques"]}
          items={menuItems}
          onClick={({ key }) => onMenuSelect && onMenuSelect(key)}
          style={{ fontSize: 16, marginTop: 12 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px #00000010",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18 }}>Dashboard Agence Artistique Sentinelle</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar style={{ backgroundColor: "#181c22" }} icon={<UserOutlined />} />
            </Dropdown>
            <span>Admin <DownOutlined /></span>
          </div>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: "#fff", borderRadius: 12, minHeight: 360 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
