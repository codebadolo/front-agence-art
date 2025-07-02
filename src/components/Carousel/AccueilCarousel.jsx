import { Carousel } from 'antd';

export default function AccueilCarousel() {
  return (
    <Carousel autoplay>
      <div><img src="/assets/images/slide1.jpg" alt="Talent 1" style={{ width: '100%', height: 400, objectFit: 'cover' }} /></div>
      <div><img src="/assets/images/slide2.jpg" alt="Talent 2" style={{ width: '100%', height: 400, objectFit: 'cover' }} /></div>
    </Carousel>
  );
}
