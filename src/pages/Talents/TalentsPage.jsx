import { Col, Row } from 'antd';
import { useState } from 'react';
import TalentFilters from '../../components/Filters/TalentFilters';
import TalentCard from '../../components/TalentCard/TalentCard';

// Exemple de données simulées
const talentsData = [
  { id: 1, nom: "Alice Martin", age: 28, taille: "1m70", photo_principale: "/assets/images/alice.jpg", competences: ["Chant", "Danse"] },
  { id: 2, nom: "Jean Dupont", age: 35, taille: "1m80", photo_principale: "/assets/images/jean.jpg", competences: ["Théâtre"] }
];

export default function TalentsPage() {
  const [filteredTalents, setFilteredTalents] = useState(talentsData);

  const handleFilterChange = (type, value) => {
    // À implémenter : filtrage dynamique
    setFilteredTalents(talentsData); // Placeholder
  };

  return (
    <div>
      <TalentFilters genres={[{label: "Femme", value: "femme"}, {label: "Homme", value: "homme"}]} onFilterChange={handleFilterChange} />
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {filteredTalents.map(talent => (
          <Col xs={24} sm={12} md={8} lg={6} key={talent.id}>
            <TalentCard talent={talent} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
