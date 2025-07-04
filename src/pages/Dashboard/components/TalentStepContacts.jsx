import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space } from "antd";

const { Option } = Select;

const contactTypes = [
  "email",
  "telephone",
  "fax",
  "site_web",
  "linkedin",
  "facebook",
  "instagram",
  "autre",
];

export default function TalentStepContacts({ form }) {
  return (
    <Form.List name="contacts">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              align="baseline"
              style={{ display: "flex", marginBottom: 8, gap: 8 }}
            >
              {/* Type de contact */}
              <Form.Item
                {...restField}
                name={[name, "type_contact"]}
                rules={[{ required: true, message: "Veuillez sélectionner un type" }]}
              >
                <Select placeholder="Type de contact" style={{ width: 150 }}>
                  {contactTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Valeur */}
              <Form.Item
                {...restField}
                name={[name, "valeur"]}
                rules={[{ required: true, message: "Veuillez saisir la valeur" }]}
              >
                <Input placeholder="Valeur" style={{ width: 200 }} />
              </Form.Item>

              {/* Description */}
              <Form.Item {...restField} name={[name, "description"]}>
                <Input placeholder="Description (optionnel)" style={{ width: 250 }} />
              </Form.Item>

              {/* Bouton supprimer */}
              <Button danger type="text" onClick={() => remove(name)}>
                Supprimer
              </Button>
            </Space>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Ajouter un contact
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}
