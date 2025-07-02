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
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/dashboard/talents", icon: <UserOutlined />, label: "Talents" },
  { key: "/dashboard/projets-list", icon: <ProjectOutlined />, label: "Projets" },
  { key: "/dashboard/actualites-list", icon: <NotificationOutlined />, label: "Actualités" },
  { key: "/dashboard/evenements-list", icon: <CalendarOutlined />, label: "Événements" },
  { key: "/dashboard/users-list", icon: <TeamOutlined />, label: "Utilisateurs" },
];

export default function DashboardLayout({ children, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      if (token) {
        await logout(token);
      }
      localStorage.removeItem("authToken");
      message.success("Déconnexion réussie !");
      navigate("/login");
    } catch (e) {
      message.error("Erreur lors de la déconnexion");
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  const handleProfile = () => {
    navigate("/dashboard/profile");
  };

  // Width of sider when expanded/collapsed
  const siderWidth = 220;
  const collapsedSiderWidth = 80; // default collapsed width for antd sider

  return (
    <>
      {/* Fixed Sider */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={siderWidth}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          background: "#1f1f1f",
          boxShadow: "2px 0 8px #00000010",
          overflow: "auto",
          zIndex: 1000,
          transition: "width 0.2s",
          width: collapsed ? collapsedSiderWidth : siderWidth,
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
          }}
        >
          <span style={{ display: collapsed ? "none" : "block" }}>Sentinelle</span>
          <span style={{ display: collapsed ? "block" : "none" }}>S</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[
            menuItems.find((item) => location.pathname.startsWith(item.key))?.key ||
              "/dashboard/talents",
          ]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
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

      {/* Main layout with fixed Header */}
      <Layout
        style={{
          marginLeft: collapsed ? collapsedSiderWidth : siderWidth,
          minHeight: "100vh",
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: collapsed ? collapsedSiderWidth : siderWidth,
            right: 0,
            height: 64,
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px #00000010",
            zIndex: 1001,
            transition: "left 0.2s",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18 }}>
            Dashboard Agence Artistique Sentinelle
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              icon={<UserOutlined />}
              onClick={handleProfile}
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
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </Header>

        {/* Scrollable Content */}
        <Content
          style={{
            marginTop: 64, // height of the fixed header
            marginBottom: 24,
            marginRight: 24,
            marginLeft: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 12,
            minHeight: `calc(100vh - 64px - 48px)`, // full viewport minus header and vertical margins
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </>
  );
}
