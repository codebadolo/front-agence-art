import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

export default function TalentAdd() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // États pour données de référence
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [langues, setLangues] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  const [typesExperience, setTypesExperience] = useState([]);

  useEffect(() => {
    const config = { headers: { Authorization: `Token ${token}` } };

    const fetch = async (url, setter) => {
      try {
        const res = await axios.get(url, config);
        const data = res.data;
        if (Array.isArray(data)) setter(data);
        else if (Array.isArray(data.results)) setter(data.results);
        else setter([]);
      } catch {
        setter([]);
        message.error(`Erreur chargement ${url}`);
      }
    };

    fetch("http://127.0.0.1:8000/api/agents/", setAgents);
    fetch("http://127.0.0.1:8000/api/categories-talents/", setCategories);
    fetch("http://127.0.0.1:8000/api/competences/", setCompetences);
    fetch("http://127.0.0.1:8000/api/langues/", setLangues);
    fetch("http://127.0.0.1:8000/api/localisations/", setLocalisations);
    fetch("http://127.0.0.1:8000/api/types-experience/", setTypesExperience);
  }, [token]);

  const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // Champs simples
      formData.append("nom", values.nom);
      formData.append("prenom", values.prenom || "");
      formData.append("sexe", values.sexe || "");
      formData.append(
        "date_naissance",
        values.date_naissance ? values.date_naissance.format("YYYY-MM-DD") : ""
      );
      formData.append("description", values.description || "");
      formData.append("taille", values.taille || "");
      formData.append("poids", values.poids || "");
      formData.append("permis", values.permis || "");

      // Agent
      if (values.agent_id) formData.append("agent_id", values.agent_id);

      // Photo principale
      if (values.photo_principale && values.photo_principale.length > 0) {
        formData.append("photo_principale", values.photo_principale[0].originFileObj);
      }

      // Relations ManyToMany
      (values.localisations_ids || []).forEach((id) =>
        formData.append("localisations_ids", id)
      );
      (values.langues_ids || []).forEach((id) => formData.append("langues_ids", id));
      (values.categories_ids || []).forEach((id) =>
        formData.append("categories_ids", id)
      );

      // Compétences imbriquées
      (values.competences_dynamiques || []).forEach((comp, i) => {
        formData.append(`competences_dynamiques[${i}][competence]`, comp.competence_id);
        formData.append(`competences_dynamiques[${i}][niveau]`, comp.niveau || "");
        formData.append(`competences_dynamiques[${i}][details]`, comp.details || "");
      });

      // Expériences imbriquées
      (values.experiences_dynamiques || []).forEach((exp, i) => {
        formData.append(`experiences_dynamiques[${i}][annee]`, exp.annee || "");
        formData.append(`experiences_dynamiques[${i}][titre]`, exp.titre || "");
        formData.append(`experiences_dynamiques[${i}][role]`, exp.role || "");
        formData.append(
          `experiences_dynamiques[${i}][type_experience]`,
          exp.type_experience_id || ""
        );
        formData.append(`experiences_dynamiques[${i}][description]`, exp.description || "");
      });

      // Attributs imbriqués
      (values.attributs_dynamiques || []).forEach((attr, i) => {
        formData.append(`attributs_dynamiques[${i}][cle]`, attr.cle || "");
        formData.append(`attributs_dynamiques[${i}][valeur]`, attr.valeur || "");
      });

      // Médias (fichiers)
      (values.medias || []).forEach((file) => {
        formData.append("medias_dynamiques", file.originFileObj);
      });

      await axios.post("http://127.0.0.1:8000/api/talents/", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Token ${token}` },
      });

      message.success("Talent ajouté avec succès !");
      navigate("/dashboard/talents");
    } catch (error) {
      message.error("Erreur lors de l'ajout du talent");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
      <Divider>Informations générales</Divider>
      <Form.Item
        name="nom"
        label="Nom"
        rules={[{ required: true, message: "Veuillez saisir le nom" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="prenom" label="Prénom">
        <Input />
      </Form.Item>
      <Form.Item name="sexe" label="Sexe">
        <Select allowClear>
          {["homme", "femme", "autre"].map((s) => (
            <Option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="date_naissance" label="Date de naissance">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item name="agent_id" label="Agent">
        <Select placeholder="Sélectionnez un agent" allowClear>
          {agents.map((agent) => (
            <Option key={agent.id} value={agent.id}>
              {agent.nom} {agent.prenom}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="photo_principale"
        label="Photo principale"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Format JPG/PNG, max 2MB"
      >
        <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Sélectionner une photo</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="categories_ids" label="Catégories">
        <Select mode="multiple" placeholder="Sélectionnez les catégories">
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.nom}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="localisations_ids" label="Localisations">
        <Select mode="multiple" placeholder="Sélectionnez les localisations">
          {localisations.map((loc) => (
            <Option key={loc.id} value={loc.id}>
              {loc.nom}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="langues_ids" label="Langues">
        <Select mode="multiple" placeholder="Sélectionnez les langues">
          {langues.map((lang) => (
            <Option key={lang.id} value={lang.id}>
              {lang.nom}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Divider>Compétences</Divider>
      <Form.List name="competences_dynamiques">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                align="baseline"
                style={{ display: "flex", marginBottom: 8 }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "competence_id"]}
                  rules={[{ required: true, message: "Compétence requise" }]}
                >
                  <Select placeholder="Compétence" style={{ width: 200 }}>
                    {competences.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.nom}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item {...restField} name={[name, "niveau"]}>
                  <Input placeholder="Niveau" style={{ width: 150 }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, "details"]}>
                  <Input placeholder="Détails" style={{ width: 250 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Ajouter une compétence
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider>Expériences</Divider>
      <Form.List name="experiences_dynamiques">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                align="baseline"
                style={{ display: "flex", marginBottom: 8 }}
              >
                <Form.Item {...restField} name={[name, "annee"]}>
                  <Input placeholder="Année" style={{ width: 100 }} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "titre"]}
                  rules={[{ required: true, message: "Titre requis" }]}
                >
                  <Input placeholder="Titre" style={{ width: 250 }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, "role"]}>
                  <Input placeholder="Rôle" style={{ width: 200 }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, "type_experience_id"]}>
                  <Select placeholder="Type d'expérience" style={{ width: 200 }}>
                    {typesExperience.map((t) => (
                      <Option key={t.id} value={t.id}>
                        {t.nom}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Ajouter une expérience
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider>Attributs personnalisés</Divider>
      <Form.List name="attributs_dynamiques">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                align="baseline"
                style={{ display: "flex", marginBottom: 8 }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "cle"]}
                  rules={[{ required: true, message: "Clé requise" }]}
                >
                  <Input placeholder="Clé" style={{ width: 200 }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, "valeur"]}>
                  <Input placeholder="Valeur" style={{ width: 300 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Ajouter un attribut
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider>Médias (photos/vidéos)</Divider>
      <Form.Item
        name="medias"
        label="Médias"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload listType="picture" multiple beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Ajouter des médias</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
          Ajouter le talent
        </Button>
      </Form.Item>
    </Form>
  );
}
