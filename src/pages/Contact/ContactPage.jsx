import { Button, Form, Input, Typography } from 'antd';

export default function ContactPage() {
  return (
    <div>
      <Typography.Title>Contact</Typography.Title>
      <Form layout="vertical">
        <Form.Item label="Nom" name="nom" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="E-mail" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Message" name="message" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Envoyer</Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 32 }}>
        <Typography.Text strong>Adresse : 123 rue du Talent, Paris</Typography.Text><br />
        <Typography.Text strong>Email : contact@sentinelle.com</Typography.Text><br />
        <Typography.Text strong>WhatsApp : +33 6 12 34 56 78</Typography.Text>
      </div>
    </div>
  );
}
