import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";

const { Option } = Select;

export default function TalentStepInfos({
  form,
  agents = [],
  categories = [],
  photoList,
  setPhotoList,
  onAddAgent,
  onAddCategory,
}) {
  return (
    <>
      <Form.Item
        name="nom"
        label="Nom"
        rules={[{ required: true, message: "Veuillez saisir le nom" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="prenom"
        label="Prénom"
        rules={[{ required: true, message: "Veuillez saisir le prénom" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="sexe"
        label="Sexe"
        rules={[{ required: true, message: "Veuillez sélectionner le sexe" }]}
      >
        <Select placeholder="Sélectionnez le sexe">
          <Option value="homme">Homme</Option>
          <Option value="femme">Femme</Option>
          <Option value="autre">Autre</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="date_naissance"
        label="Date de naissance"
        rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea rows={4} placeholder="Description (optionnel)" />
      </Form.Item>

      <Form.Item name="taille" label="Taille">
        <Input placeholder="Taille (ex: 1m75)" />
      </Form.Item>

      <Form.Item name="poids" label="Poids">
        <Input placeholder="Poids (ex: 70kg)" />
      </Form.Item>

      <Form.Item name="permis" label="Permis">
        <Input placeholder="Permis (ex: B)" />
      </Form.Item>

      <Form.Item
        name="agent_id"
        label="Agent"
        rules={[{ required: false }]}
      >
        <Select
          placeholder="Sélectionnez un agent"
          dropdownRender={menu => (
            <>
              {menu}
              <Button type="link" onClick={onAddAgent} style={{ display: "block", textAlign: "center" }}>
                + Ajouter un agent
              </Button>
            </>
          )}
          allowClear
        >
          {agents.map(agent => (
            <Option key={agent.id} value={agent.id}>
              {agent.prenom} {agent.nom}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="categories_ids"
        label="Catégories"
        rules={[{ required: true, message: "Veuillez sélectionner au moins une catégorie" }]}
      >
        <Select
          mode="multiple"
          placeholder="Sélectionnez les catégories"
          dropdownRender={menu => (
            <>
              {menu}
              <Button type="link" onClick={onAddCategory} style={{ display: "block", textAlign: "center" }}>
                + Ajouter une catégorie
              </Button>
            </>
          )}
          allowClear
        >
          {categories.map(cat => (
            <Option key={cat.id} value={cat.id}>
              {cat.nom}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Photo principale">
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
          fileList={photoList}
          onChange={({ fileList }) => setPhotoList(fileList)}
        >
          <Button icon={<UploadOutlined />}>Ajouter une photo</Button>
        </Upload>
      </Form.Item>
    </>
  );
}
