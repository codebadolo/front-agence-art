import { CalendarOutlined, GlobalOutlined, MailOutlined, PhoneOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Spin, Tag, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TalentDetailPage() {
  const { slug } = useParams();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTalent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/talents/${slug}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setTalent(res.data);
      } catch (error) {
        message.error("Erreur lors du chargement du talent.");
        navigate("/dashboard/talents"); // Redirect back to list if error
      } finally {
        setLoading(false);
      }
    };
    fetchTalent();
  }, [slug, token, navigate]);

  if (loading) return <Spin tip="Chargement..." style={{ marginTop: 100 }} />;

  if (!talent) return null;

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<h2>{talent.nom}</h2>}
        cover={
          talent.photo_principale ? (
            <img alt={talent.nom} src={talent.photo_principale} style={{ objectFit: "cover", maxHeight: 400, width: "100%" }} />
          ) : (
            <div style={{ height: 400, background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#bfbfbf", fontSize: 100 }}>
              <UserOutlined />
            </div>
          )
        }
        style={{ maxWidth: 800, margin: "auto", borderRadius: 8 }}
      >
        {talent.date_naissance && (
          <p><CalendarOutlined /> Né(e) le {talent.date_naissance}</p>
        )}
        <p>{talent.description}</p>

        {talent.localisations?.length > 0 && (
          <p>
            <GlobalOutlined />{" "}
            {talent.localisations.map(loc => (
              <Tag key={loc.id} color="cyan">{loc.nom}</Tag>
            ))}
          </p>
        )}

        {talent.competences?.length > 0 && (
          <p>
            <StarOutlined />{" "}
            {talent.competences.map(comp => (
              <Tag key={comp.id} color="blue">{comp.nom}</Tag>
            ))}
          </p>
        )}

        {talent.contacts?.length > 0 && (
          <div>
            {talent.contacts.map(contact => {
              if (contact.type_contact === "telephone")
                return <Tag key={contact.id} icon={<PhoneOutlined />} color="green">{contact.valeur}</Tag>;
              if (contact.type_contact === "email")
                return <Tag key={contact.id} icon={<MailOutlined />} color="volcano">{contact.valeur}</Tag>;
              return null;
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
