import {
  CalendarOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  List,
  message,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Paragraph } = Typography;

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
        const res = await axios.get(
          `http://localhost:8000/api/talents/${slug}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setTalent(res.data);
      } catch (error) {
        message.error("Erreur lors du chargement du talent.");
        navigate("/dashboard/talents");
      } finally {
        setLoading(false);
      }
    };
    fetchTalent();
  }, [slug, token, navigate]);

  if (loading)
    return <Spin tip="Chargement..." style={{ marginTop: 100, display: "block" }} />;

  if (!talent) return null;

  const photoUrl = talent.photo_principale
    ? talent.photo_principale.startsWith("http")
      ? talent.photo_principale
      : `http://localhost:8000${talent.photo_principale}`
    : null;

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${talent.prenom || ""} ${talent.nom}`, 14, 22);

    doc.setFontSize(12);
    doc.text(`Sexe: ${talent.sexe || "N/A"}`, 14, 32);
    doc.text(`Date de naissance: ${talent.date_naissance || "N/A"}`, 14, 40);

    doc.text("Description:", 14, 50);
    doc.text(talent.description || "Aucune description", 14, 58, { maxWidth: 180 });

    if (talent.localisations?.length) {
      const locs = talent.localisations.map((l) => l.nom).join(", ");
      doc.text(`Localisations: ${locs}`, 14, 70);
    }

    if (talent.langues?.length) {
      const langs = talent.langues
        .map((l) => (l.niveau ? `${l.nom} (${l.niveau})` : l.nom))
        .join(", ");
      doc.text(`Langues: ${langs}`, 14, 78);
    }

    if (talent.competences?.length) {
      const comps = talent.competences.map((c) => c.nom).join(", ");
      doc.text(`Compétences: ${comps}`, 14, 86);
    }

    if (talent.categories?.length) {
      const cats = talent.categories.map((c) => c.nom).join(", ");
      doc.text(`Catégories: ${cats}`, 14, 94);
    }

    if (talent.agent) {
      doc.text(`Agent: ${talent.agent.prenom || ""} ${talent.agent.nom || ""}`, 14, 102);
      doc.text(`Email agent: ${talent.agent.email || "N/A"}`, 14, 110);
      doc.text(`Téléphone agent: ${talent.agent.telephone || "N/A"}`, 14, 118);
    }

    if (talent.experiences?.length) {
      const expData = talent.experiences.map((exp) => [
        exp.annee || "",
        exp.titre || "",
        exp.role || "",
        exp.type_experience?.nom || "",
      ]);
      doc.autoTable({
        head: [["Année", "Titre", "Rôle", "Type"]],
        body: expData,
        startY: 130,
      });
    }

    if (talent.attributs?.length) {
      let startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 150;
      doc.text("Attributs:", 14, startY);
      talent.attributs.forEach((attr, i) => {
        doc.text(`${attr.cle}: ${attr.valeur}`, 14, startY + 10 + i * 8);
      });
    }

    doc.save(`${talent.nom}_${talent.prenom || ""}.pdf`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "auto" }}>
      <Button style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
        Retour à la liste
      </Button>

      <Button
        type="primary"
        style={{ marginBottom: 16, marginLeft: 16 }}
        onClick={exportPDF}
      >
        Exporter en PDF
      </Button>

      <Button
        type="default"
        icon={<EditOutlined />}
        style={{ marginBottom: 16, marginLeft: 16 }}
        onClick={() => navigate(`/dashboard/talents/edit/${slug}`)}
      >
        Modifier le talent
      </Button>

      <Row gutter={24}>
        {/* Médias à gauche */}
        <Col xs={24} md={10}>
          <Card
            cover={
              photoUrl ? (
                <img
                  alt={`${talent.prenom} ${talent.nom}`}
                  src={photoUrl}
                  style={{
                    objectFit: "cover",
                    maxHeight: 400,
                    width: "100%",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div
                  style={{
                    height: 400,
                    background: "#f0f2f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bfbfbf",
                    fontSize: 100,
                    borderRadius: 8,
                  }}
                >
                  <UserOutlined />
                </div>
              )
            }
          >
            {talent.galerie_photos?.length > 0 && (
              <>
                <Divider orientation="left">Galerie photos</Divider>
                <List
                  grid={{ gutter: 8, column: 2 }}
                  dataSource={talent.galerie_photos}
                  renderItem={(photo) => (
                    <List.Item key={photo.id}>
                      <img
                        src={
                          photo.image.startsWith("http")
                            ? photo.image
                            : `http://localhost:8000${photo.image}`
                        }
                        alt={photo.description || "Photo"}
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                      <p>{photo.description}</p>
                    </List.Item>
                  )}
                />
              </>
            )}

            {talent.medias?.length > 0 && (
              <>
                <Divider orientation="left">Médias</Divider>
                <List
                  grid={{ gutter: 8, column: 1 }}
                  dataSource={talent.medias}
                  renderItem={(media) => (
                    <List.Item key={media.id}>
                      {media.media_type === "photo" ? (
                        <img
                          src={
                            media.fichier.startsWith("http")
                              ? media.fichier
                              : `http://localhost:8000${media.fichier}`
                          }
                          alt={media.description || "Photo"}
                          style={{ width: "100%", borderRadius: 8 }}
                        />
                      ) : (
                        <video controls style={{ width: "100%", borderRadius: 8 }}>
                          <source
                            src={
                              media.fichier.startsWith("http")
                                ? media.fichier
                                : `http://localhost:8000${media.fichier}`
                            }
                          />
                          Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                      )}
                      <p>{media.description}</p>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Card>
        </Col>

        {/* Infos à droite */}
        <Col xs={24} md={14}>
          <Card
            title={`${talent.prenom ? talent.prenom + " " : ""}${talent.nom}`}
            style={{ borderRadius: 8 }}
          >
            {talent.sexe && <p><b>Sexe :</b> {talent.sexe}</p>}
            {talent.date_naissance && (
              <p>
                <CalendarOutlined /> Né(e) le {talent.date_naissance}
              </p>
            )}
            <Paragraph>
              <b>Description :</b> {talent.description || "Aucune description disponible."}
            </Paragraph>
            <p><b>Taille :</b> {talent.taille || "N/A"}</p>
            <p><b>Poids :</b> {talent.poids || "N/A"}</p>
            <p><b>Permis :</b> {talent.permis || "N/A"}</p>

            {talent.localisations?.length > 0 && (
              <>
                <Divider orientation="left">Localisations</Divider>
                {talent.localisations.map((loc) => (
                  <Tag key={loc.id} color="cyan">{loc.nom}</Tag>
                ))}
              </>
            )}

            {talent.langues?.length > 0 && (
              <>
                <Divider orientation="left">Langues</Divider>
                {talent.langues.map((lang) => (
                  <Tag key={lang.id} color="purple">{lang.nom} {lang.niveau && `(${lang.niveau})`}</Tag>
                ))}
              </>
            )}

            {talent.competences?.length > 0 && (
              <>
                <Divider orientation="left">Compétences</Divider>
                {talent.competences.map((comp) => (
                  <Tag key={comp.id} color="blue">{comp.nom}</Tag>
                ))}
              </>
            )}

            {talent.categories?.length > 0 && (
              <>
                <Divider orientation="left">Catégories</Divider>
                {talent.categories.map((cat) => (
                  <Tag key={cat.id} color="magenta">{cat.nom}</Tag>
                ))}
              </>
            )}

            {talent.agent && (
              <>
                <Divider orientation="left">Agent</Divider>
                <p><b>{talent.agent.prenom} {talent.agent.nom}</b></p>
                <p>Email : <a href={`mailto:${talent.agent.email}`}>{talent.agent.email}</a></p>
                <p>
                  Téléphone : {talent.agent.telephone ? (
                    <a href={`tel:${talent.agent.telephone}`}>{talent.agent.telephone}</a>
                  ) : "N/A"}
                </p>

                {talent.agent.contacts?.length > 0 && (
                  <>
                    <Divider orientation="left">Contacts de l'agent</Divider>
                    {talent.agent.contacts.map((contact) => {
                      if (contact.type_contact === "telephone")
                        return (
                          <Tag key={contact.id} icon={<PhoneOutlined />} color="green">
                            <a href={`tel:${contact.valeur}`}>{contact.valeur}</a>
                          </Tag>
                        );
                      if (contact.type_contact === "email")
                        return (
                          <Tag key={contact.id} icon={<MailOutlined />} color="volcano">
                            <a href={`mailto:${contact.valeur}`}>{contact.valeur}</a>
                          </Tag>
                        );
                      return null;
                    })}
                  </>
                )}
              </>
            )}

            {talent.experiences?.length > 0 && (
              <>
                <Divider orientation="left">Expériences</Divider>
                <List
                  dataSource={talent.experiences}
                  renderItem={(exp) => (
                    <List.Item key={exp.id}>
                      <List.Item.Meta
                        title={`${exp.titre} (${exp.annee || "Date inconnue"})`}
                        description={
                          <>
                            <p><b>Rôle :</b> {exp.role || "N/A"}</p>
                            <p><b>Type :</b> {exp.type_experience?.nom || "N/A"}</p>
                            <p>{exp.description}</p>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </>
            )}

            {talent.attributs?.length > 0 && (
              <>
                <Divider orientation="left">Attributs</Divider>
                {talent.attributs.map((attr) => (
                  <p key={attr.id}><b>{attr.cle} :</b> {attr.valeur}</p>
                ))}
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
