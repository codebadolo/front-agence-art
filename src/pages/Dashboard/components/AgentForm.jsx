import { Button, Form, Input, Space } from "antd";

export default function AgentForm({ onCancel, onSuccess, loading }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSuccess(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="telephone" label="Téléphone">
        <Input />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Annuler</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Créer l'agent
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
