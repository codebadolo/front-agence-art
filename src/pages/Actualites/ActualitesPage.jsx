import { List, Typography } from 'antd';

// Exemple de données simulées
const actualites = [
  { id: 1, titre: "Festival de Cannes", contenu: "Notre talent Alice sélectionnée...", date_publication: "2025-04-15" },
  { id: 2, titre: "Interview de Jean", contenu: "Jean parle de son nouveau rôle...", date_publication: "2025-03-10" }
];

export default function ActualitesPage() {
  return (
    <div>
      <Typography.Title>Actualités & Projets</Typography.Title>
      <List
        itemLayout="vertical"
        dataSource={actualites}
        renderItem={item => (
          <List.Item key={item.id}>
            <List.Item.Meta title={item.titre} description={item.date_publication} />
            <div>{item.contenu}</div>
          </List.Item>
        )}
      />
    </div>
  );
}
