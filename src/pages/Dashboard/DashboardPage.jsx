import {
  CalendarOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, message } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/dashboard/talents", icon: <UserOutlined />, label: "Talents" },
  { key: "/dashboard/projets-list", icon: <ProjectOutlined />, label: "Projets" },
  { key: "/dashboard/actualites-list", icon: <NotificationOutlined />, label: "Actualités" },
  { key: "/dashboard/evenements-list", icon: <CalendarOutlined />, label: "Événements" },
  { key: "/dashboard/users-list", icon: <TeamOutlined />, label: "Utilisateurs" },
  { key: "/dashboard/statistiques", icon: <ProjectOutlined />, label: "Statistiques" },
  { key: "/dashboard/parametres", icon: <UserOutlined />, label: "Paramètres" },
];

export default function DashboardPage({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user info for display (optional)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch("http://localhost:8000/api/auth/user/", {
        headers: { Authorization: `Token ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erreur user");
          return res.json();
        })
        .then((data) => setUserEmail(data.email))
        .catch(() => setUserEmail(""));
    }
  }, []);

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
      message.success("Déconnecté avec succès");
      navigate("/login");
    }
  };

  // Determine selected menu item based on current path
  const selectedKey = menuItems.find((item) =>
    location.pathname.startsWith(item.key)
  )?.key || "/dashboard/talents";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        style={{
          background: "#1f1f1f",
          boxShadow: "2px 0 8px #00000010",
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "left",
            fontWeight: "bold",
            color: "#fff",
            fontSize: 20,
            paddingLeft: collapsed ? 0 : 16,
            transition: "all 0.2s",
            userSelect: "none",
          }}
        >
          <span style={{ display: collapsed ? "none" : "block" }}>Sentinelle</span>
          <span style={{ display: collapsed ? "block" : "none" }}>S</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ fontSize: 16 }}
        />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: "#fff", fontSize: 20 }}
          />
        </div>
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
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18 }}>
            Dashboard Agence Artistique Sentinelle
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              icon={<UserOutlined />}
              onClick={() => navigate("/dashboard/profile")}
              style={{
                color: "#555",
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: "bold",
              }}
            >
              Profil
            </Button>
            <span style={{ color: "#555", fontWeight: "bold" }}>{userEmail}</span>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              danger
              style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
              onClick={handleLogoutClick}
            >
              Déconnexion
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 12,
            minHeight: 360,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
