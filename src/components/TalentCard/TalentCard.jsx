import { Card, Tag } from 'antd';

export default function TalentCard({ talent }) {
  return (
    <Card
      hoverable
      cover={<img alt={talent.nom} src={talent.photo_principale} style={{ height: 320, objectFit: 'cover' }} />}
      title={talent.nom}
    >
      <p>Âge : {talent.age}</p>
      <p>Taille : {talent.taille}</p>
      <div>
        {talent.competences.map(c => <Tag key={c}>{c}</Tag>)}
      </div>
    </Card>
  );
}
