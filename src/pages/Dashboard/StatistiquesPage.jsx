import { Bar, Column, Pie } from "@ant-design/charts";
import { CalendarOutlined, NotificationOutlined, ProjectOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

// Données simulées (remplace par des fetch API)
const stats = {
  talents: 128,
  projets: 17,
  actualites: 42,
  evenements: 12,
  utilisateurs: 8,
};

const talentsParCompetence = [
  { type: "Chant", value: 40 },
  { type: "Danse", value: 32 },
  { type: "Théâtre", value: 28 },
  { type: "Cinéma", value: 18 },
  { type: "Autre", value: 10 },
];

const projetsParStatut = [
  { statut: "En cours", nombre: 7 },
  { statut: "Terminé", nombre: 6 },
  { statut: "Pré-prod", nombre: 3 },
  { statut: "Annulé", nombre: 1 },
];

const actualitesParType = [
  { type: "Actualité", value: 24 },
  { type: "Interview", value: 10 },
  { type: "Article", value: 5 },
  { type: "Communiqué", value: 3 },
];

export default function StatistiquesPage() {
  return (
    <div>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Talents" value={stats.talents} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Projets" value={stats.projets} prefix={<ProjectOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Actualités" value={stats.actualites} prefix={<NotificationOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Événements" value={stats.evenements} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Répartition des talents par compétence">
            <Pie
              data={talentsParCompetence}
              angleField="value"
              colorField="type"
              radius={0.9}
              label={{ type: "outer", content: "{name} {percentage}" }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Projets par statut">
            <Bar
              data={projetsParStatut}
              xField="nombre"
              yField="statut"
              seriesField="statut"
              legend={false}
              color={["#1890ff", "#52c41a", "#faad14", "#f5222d"]}
              barWidthRatio={0.6}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card title="Types d'actualités publiées">
            <Pie
              data={actualitesParType}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{ type: "spider", content: "{name} {percentage}" }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Évolution du nombre de talents (exemple)">
            <Column
              data={[
                { mois: "Jan", value: 100 },
                { mois: "Fév", value: 110 },
                { mois: "Mar", value: 120 },
                { mois: "Avr", value: 128 },
              ]}
              xField="mois"
              yField="value"
              color="#722ed1"
              label={{ position: "middle" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
