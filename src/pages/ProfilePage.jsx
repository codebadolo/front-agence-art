import { EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Récupère les infos du user connecté
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:8000/api/auth/user/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  // Ouvre le modal et pré-remplit les champs
  const openEditModal = () => {
    form.setFieldsValue({
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
    setEditModalVisible(true);
  };

  // Enregistre les modifications
  const handleEdit = async (values) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch("http://localhost:8000/api/auth/user/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      message.success("Profil mis à jour !");
      setEditModalVisible(false);
    } else {
      message.error("Erreur lors de la mise à jour");
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    message.success("Déconnexion réussie !");
    navigate("/"); 
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <Card
        title="Mon profil"
        extra={
          <Button icon={<EditOutlined />} onClick={openEditModal}>
            Modifier
          </Button>
        }
        actions={[
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ width: "100%" }}
            key="logout"
          >
            Déconnexion
          </Button>
        ]}
      >
        <p><b>Email :</b> {profile.email}</p>
        <p><b>Prénom :</b> {profile.first_name || <i>Non renseigné</i>}</p>
        <p><b>Nom :</b> {profile.last_name || <i>Non renseigné</i>}</p>
        <Divider />
        {/* Tu peux ajouter ici d’autres infos ou actions liées au compte */}
      </Card>

      {/* Modal de modification */}
      <Modal
        title="Modifier mes informations"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            first_name: profile.first_name,
            last_name: profile.last_name,
          }}
          onFinish={handleEdit}
        >
          <Form.Item label="Prénom" name="first_name">
            <Input />
          </Form.Item>
          <Form.Item label="Nom" name="last_name">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Enregistrer
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
