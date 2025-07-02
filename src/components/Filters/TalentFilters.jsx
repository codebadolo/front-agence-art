import { Col, Input, Row, Select } from 'antd';

export default function TalentFilters({ genres, onFilterChange }) {
  return (
    <Row gutter={16}>
      <Col><Select placeholder="Genre" options={genres} onChange={val => onFilterChange('genre', val)} /></Col>
      <Col><Input placeholder="Âge" onChange={e => onFilterChange('age', e.target.value)} /></Col>
      <Col><Input placeholder="Taille" onChange={e => onFilterChange('taille', e.target.value)} /></Col>
    </Row>
  );
}
