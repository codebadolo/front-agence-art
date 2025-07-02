import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      if (!response.ok) throw new Error("Identifiants invalides");
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      message.success("Connexion réussie !");
      onLogin();
      navigate("/dashboard");
    } catch (err) {
      message.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f2f5"
    }}>
      <Form
        name="login"
        onFinish={handleFinish}
        style={{ width: 350, background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px #0001" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Connexion Admin</h2>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Veuillez saisir votre email" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Veuillez saisir votre mot de passe" }]}
        >
          <Input.Password placeholder="Mot de passe" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
