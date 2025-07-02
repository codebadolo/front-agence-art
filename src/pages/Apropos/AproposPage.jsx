import { Card, Typography } from 'antd';

export default function AproposPage() {
  return (
    <div>
      <Typography.Title>À propos</Typography.Title>
      <Typography.Paragraph>
        Notre vision : révéler les talents d’aujourd’hui et de demain, avec exigence et bienveillance.
      </Typography.Paragraph>
      <Card title="Notre équipe">
        <p>Marie Dupuis – Fondatrice</p>
        <p>Paul Laurent – Directeur artistique</p>
      </Card>
      <Card title="Engagements" style={{ marginTop: 16 }}>
        <p>Égalité, diversité, accompagnement personnalisé.</p>
      </Card>
    </div>
  );
}
