import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";

const { Option } = Select;

export default function TalentStepSkills({
  form,
  localisations = [],
  langues = [],
  competences = [],
  onAddLocalisation,
  onAddLangue,
  onAddCompetence,
}) {
  return (
    <>
      {/* Localisations */}
      <Form.Item
        name="localisations"
        label="Localisations"
        rules={[{ required: true, message: "Veuillez sélectionner au moins une localisation" }]}
      >
        <Select mode="multiple" placeholder="Sélectionner les localisations" allowClear>
          {Array.isArray(localisations) &&
            localisations.map((loc) => (
              <Option key={loc.id} value={loc.id}>
                {loc.nom}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Button type="dashed" icon={<PlusOutlined />} onClick={onAddLocalisation} style={{ marginBottom: 24 }}>
        Ajouter une localisation
      </Button>

      {/* Langues */}
      <Form.Item
        name="langues"
        label="Langues"
        rules={[{ required: true, message: "Veuillez sélectionner au moins une langue" }]}
      >
        <Select mode="multiple" placeholder="Sélectionner les langues" allowClear>
          {Array.isArray(langues) &&
            langues.map((lang) => (
              <Option key={lang.id} value={lang.id}>
                {lang.nom}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Button type="dashed" icon={<PlusOutlined />} onClick={onAddLangue} style={{ marginBottom: 24 }}>
        Ajouter une langue
      </Button>

      {/* Compétences */}
      <Form.Item
        name="competences"
        label="Compétences"
        rules={[{ required: true, message: "Veuillez sélectionner au moins une compétence" }]}
      >
        <Select mode="multiple" placeholder="Sélectionner les compétences" allowClear>
          {Array.isArray(competences) &&
            competences.map((comp) => (
              <Option key={comp.id} value={comp.id}>
                {comp.nom}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Button type="dashed" icon={<PlusOutlined />} onClick={onAddCompetence}>
        Ajouter une compétence
      </Button>
    </>
  );
}
