import { Button, Typography } from 'antd';
import AccueilCarousel from '../../components/Carousel/AccueilCarousel';

export default function HomePage() {
  return (
    <div>
      <AccueilCarousel />
      <Typography.Title level={2} style={{ marginTop: 32 }}>
        Derrière chaque grand rôle, il y a une rencontre.
      </Typography.Title>
      <Typography.Paragraph>
        Bienvenue chez Agence Artistique Sentinelle, l’agence qui révèle et accompagne les acteurs d’aujourd’hui et de demain.
      </Typography.Paragraph>
      <Button type="primary" size="large" href="/contact">Rejoindre l’agence</Button>
    </div>
  );
}
