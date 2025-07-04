// TalentStepExperiences.jsx
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';

const { Option } = Select;

export default function TalentStepExperiences({ form, typesExperience, onAddTypeExperience }) {
  return (
    <>
      <Form.List name="experiences">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} align="start" style={{ display: 'flex', marginBottom: 16, flexWrap: 'wrap' }} size="middle">
                <Form.Item {...restField} name={[name, 'annee']} rules={[{ required: true }]}>
                  <Input placeholder="Année ou période" style={{ width: 120 }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'type_experience']} rules={[{ required: true }]} style={{ width: 160 }}>
                  <Select placeholder="Type d'expérience" allowClear>
                    {typesExperience.map(t => (
                      <Option key={t.id} value={t.nom}>{t.nom}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item {...restField} name={[name, 'titre']} rules={[{ required: true }]} style={{ flex: 1, minWidth: 200 }}>
                  <Input.TextArea placeholder="Titre" autoSize={{ minRows: 1, maxRows: 3 }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'role']} style={{ flex: 1, minWidth: 200 }}>
                  <Input.TextArea placeholder="Rôle" autoSize={{ minRows: 1, maxRows: 3 }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'description']} style={{ flex: 1, minWidth: 300 }}>
                  <Input.TextArea placeholder="Description" autoSize={{ minRows: 2, maxRows: 5 }} />
                </Form.Item>
                <Button danger type="text" onClick={() => remove(name)}>Supprimer</Button>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Ajouter une expérience
              </Button>
              <Button type="link" onClick={onAddTypeExperience}>
                Ajouter un type d'expérience
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}
