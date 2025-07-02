import {
  CalendarOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  message,
  Row,
  Select,
  Spin,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

export default function TalentListPage() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localisations, setLocalisations] = useState([]);
  const [langues, setLangues] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    localisations: [],
    langues: [],
    competences: [],
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Charger options filtres
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [loc, lang, comp] = await Promise.all([
          axios.get("http://localhost:8000/api/localisations/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://localhost:8000/api/langues/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://localhost:8000/api/competences/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setLocalisations(loc.data);
        setLangues(lang.data);
        setCompetences(comp.data);
      } catch (error) {
        message.error("Erreur lors du chargement des options de filtrage.");
      }
    };
    fetchOptions();
  }, [token]);

  // Charger talents selon filtres
  useEffect(() => {
    const fetchTalents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.localisations.length)
          params.localisations = filters.localisations.join(",");
        if (filters.langues.length) params.langues = filters.langues.join(",");
        if (filters.competences.length)
          params.competences = filters.competences.join(",");

        const res = await axios.get("http://localhost:8000/api/talents/", {
          headers: { Authorization: `Token ${token}` },
          params,
        });
        setTalents(res.data);
      } catch (e) {
        message.error("Erreur lors du chargement des talents.");
        setTalents([]);
      }
      setLoading(false);
    };
    fetchTalents();
  }, [filters, token]);

  const handleSearch = (value) => setFilters((f) => ({ ...f, search: value }));
  const handleFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const handleAddTalent = () => {
    navigate("/dashboard/talents-ajouter");
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Titre et bouton Ajouter */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2>Liste des talents</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTalent}
          >
            Ajouter un talent
          </Button>
        </Col>
      </Row>

      {/* Filtres */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Rechercher par nom ou description"
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Filtrer par localisation"
            onChange={(v) => handleFilter("localisations", v)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {localisations.map((loc) => (
              <Option key={loc.id} value={loc.id}>
                {loc.nom}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Filtrer par langue"
            onChange={(v) => handleFilter("langues", v)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {langues.map((lang) => (
              <Option key={lang.id} value={lang.id}>
                {lang.nom}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Filtrer par compétence"
            onChange={(v) => handleFilter("competences", v)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {competences.map((comp) => (
              <Option key={comp.id} value={comp.id}>
                {comp.nom}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* Liste des talents */}
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {talents.length === 0 && !loading && (
            <Col span={24}>
              <Empty description="Aucun talent trouvé" />
            </Col>
          )}
          {talents.map((talent) => (
            <Col xs={24} sm={12} md={8} lg={6} key={talent.id}>
              <Card
                hoverable
                cover={
                  talent.photo_principale ? (
                    <img
                      alt={talent.nom}
                      src={talent.photo_principale}
                      style={{
                        objectFit: "cover",
                        height: 220,
                        width: "100%",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 220,
                        background: "#f0f2f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#bfbfbf",
                        fontSize: 50,
                      }}
                    >
                      <UserOutlined />
                    </div>
                  )
                }
                onClick={() => navigate(`/dashboard/talents/${talent.slug}`)}
                style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden" }}
                bodyStyle={{ padding: "16px" }}
              >
                <Card.Meta
                  title={
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {talent.nom}
                    </div>
                  }
                  description={
                    <>
                      {talent.date_naissance && (
                        <div style={{ fontSize: "13px", color: "#888" }}>
                          <CalendarOutlined /> Né(e) le {talent.date_naissance}
                        </div>
                      )}
                      <div
                        style={{ fontSize: "14px", margin: "8px 0", minHeight: "40px" }}
                      >
                        {talent.description?.slice(0, 70)}
                        {talent.description?.length > 70 ? "..." : ""}
                      </div>
                      {talent.localisations && talent.localisations.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <GlobalOutlined />{" "}
                          {talent.localisations.map((loc) => (
                            <Tag key={loc.id} color="cyan">
                              {loc.nom}
                            </Tag>
                          ))}
                        </div>
                      )}
                      {talent.competences && talent.competences.length > 0 && (
                        <div style={{ marginTop: 4 }}>
                          <StarOutlined />{" "}
                          {talent.competences.map((comp) => (
                            <Tag key={comp.id} color="blue">
                              {comp.nom}
                            </Tag>
                          ))}
                        </div>
                      )}
                      {talent.contacts && talent.contacts.length > 0 && (
                        <div style={{ marginTop: 4 }}>
                          {talent.contacts.map((contact) => {
                            if (contact.type_contact === "telephone")
                              return (
                                <Tag
                                  key={contact.id}
                                  icon={<PhoneOutlined />}
                                  color="green"
                                >
                                  {contact.valeur}
                                </Tag>
                              );
                            if (contact.type_contact === "email")
                              return (
                                <Tag
                                  key={contact.id}
                                  icon={<MailOutlined />}
                                  color="volcano"
                                >
                                  {contact.valeur}
                                </Tag>
                              );
                            return null;
                          })}
                        </div>
                      )}
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
}
