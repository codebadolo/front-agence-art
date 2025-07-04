import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";

export default function TalentStepMediasAttributs({ form, mediaFiles, setMediaFiles }) {
  return (
    <>
      <Form.Item label="Galerie médias">
        <Upload
          multiple
          beforeUpload={() => false}
          fileList={mediaFiles}
          onChange={({ fileList }) => setMediaFiles(fileList)}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Ajouter des médias</Button>
        </Upload>
      </Form.Item>

      <Form.List name="attributs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Form.Item key={key} style={{ display: "flex", marginBottom: 8 }}>
                <Form.Item
                  {...restField}
                  name={[name, "cle"]}
                  rules={[{ required: true }]}
                  style={{ flex: 1, marginRight: 8 }}
                >
                  <Input placeholder="Clé" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "valeur"]}
                  rules={[{ required: true }]}
                  style={{ flex: 2, marginRight: 8 }}
                >
                  <Input placeholder="Valeur" />
                </Form.Item>
                <Button danger type="text" onClick={() => remove(name)}>
                  Supprimer
                </Button>
              </Form.Item>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Ajouter un attribut
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}
