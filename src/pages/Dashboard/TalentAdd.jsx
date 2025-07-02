import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Modal, Select, Space, Spin, Tabs, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Option } = Select;

export default function TalentAdd() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [localisations, setLocalisations] = useState([]);
  const [langues, setLangues] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [addModal, setAddModal] = useState({ open: false, type: "", value: "" });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line
  }, []);

  const fetchOptions = async () => {
    try {
      const [locRes, langRes, compRes] = await Promise.all([
        axios.get("http://localhost:8000/api/localisations/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/api/langues/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("http://localhost:8000/api/competences/", { headers: { Authorization: `Token ${token}` } }),
      ]);
      setLocalisations(locRes.data);
      setLangues(langRes.data);
      setCompetences(compRes.data);
    } catch (e) {
      message.error("Erreur lors du chargement des options.");
    }
  };

  const handleAddOption = async () => {
    if (!addModal.value.trim()) return;
    setLoading(true);
    try {
      let url, data, setter;
      if (addModal.type === "localisation") {
        url = "http://localhost:8000/api/localisations/";
        data = { nom: addModal.value };
        setter = setLocalisations;
      } else if (addModal.type === "langue") {
        url = "http://localhost:8000/api/langues/";
        data = { nom: addModal.value };
        setter = setLangues;
      } else if (addModal.type === "competence") {
        url = "http://localhost:8000/api/competences/";
        data = { nom: addModal.value };
        setter = setCompetences;
      }
      const res = await axios.post(url, data, { headers: { Authorization: `Token ${token}` } });
      message.success("Ajouté !");
      setter(prev => [...prev, res.data]);
      setAddModal({ open: false, type: "", value: "" });
    } catch (e) {
      message.error("Erreur lors de l'ajout.");
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nom", values.nom);
      formData.append("date_naissance", values.date_naissance.format("YYYY-MM-DD"));
      formData.append("description", values.description || "");
      formData.append("taille", values.taille || "");
      formData.append("poids", values.poids || "");
      formData.append("permis", values.permis || "");
      if (fileList.length > 0) {
        formData.append("photo_principale", fileList[0].originFileObj);
      }
      (values.localisations || []).forEach(id => formData.append("localisations", id));
      (values.langues || []).forEach(id => formData.append("langues", id));
      (values.competences || []).forEach(id => formData.append("competences", id));
      // Ajoute ici les autres champs dynamiques (contacts, expériences, etc.) selon ton API

      await axios.post("http://localhost:8000/api/talents/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Talent ajouté avec succès !");
      form.resetFields();
      setFileList([]);
    } catch (e) {
      message.error("Erreur lors de l'ajout du talent.");
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <h2>Ajouter un talent</h2>
        <Tabs defaultActiveKey="infos">
          <Tabs.TabPane tab="Informations principales" key="infos">
            <Form.Item name="nom" label="Nom" rules={[{ required: true, message: "Le nom est obligatoire" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="date_naissance" label="Date de naissance" rules={[{ required: true, message: "Champ obligatoire" }]}>
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="taille" label="Taille">
              <Input />
            </Form.Item>
            <Form.Item name="poids" label="Poids">
              <Input />
            </Form.Item>
            <Form.Item name="permis" label="Permis">
              <Input />
            </Form.Item>
            <Form.Item name="photo_principale" label="Photo principale">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Choisir une photo</Button>
              </Upload>
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Contacts" key="contacts">
            <Form.List name="contacts">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item
                        {...restField}
                        name={[name, "type_contact"]}
                        rules={[{ required: true, message: "Type" }]}
                      >
                        <Select style={{ width: 120 }} placeholder="Type">
                          <Option value="email">Email</Option>
                          <Option value="telephone">Téléphone</Option>
                          <Option value="linkedin">LinkedIn</Option>
                          <Option value="twitter">Twitter</Option>
                          <Option value="facebook">Facebook</Option>
                          <Option value="instagram">Instagram</Option>
                          <Option value="autre">Autre</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "valeur"]}
                        rules={[{ required: true, message: "Valeur" }]}
                      >
                        <Input placeholder="Valeur" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                      >
                        <Input placeholder="Description" />
                      </Form.Item>
                      <Button danger type="text" onClick={() => remove(name)}>Supprimer</Button>
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
          </Tabs.TabPane>
          <Tabs.TabPane tab="Compétences & Langues" key="skills">
            <Form.Item label={
              <Space>
                Localisations
                <Button size="small" type="dashed" onClick={() => setAddModal({ open: true, type: "localisation", value: "" })}>
                  <PlusOutlined /> Ajouter
                </Button>
              </Space>
            } name="localisations">
              <Select mode="multiple" placeholder="Sélectionner les localisations">
                {localisations.map(loc => (
                  <Option key={loc.id} value={loc.id}>{loc.nom}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={
              <Space>
                Langues
                <Button size="small" type="dashed" onClick={() => setAddModal({ open: true, type: "langue", value: "" })}>
                  <PlusOutlined /> Ajouter
                </Button>
              </Space>
            } name="langues">
              <Select mode="multiple" placeholder="Sélectionner les langues">
                {langues.map(lang => (
                  <Option key={lang.id} value={lang.id}>{lang.nom}{lang.niveau ? ` (${lang.niveau})` : ""}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={
              <Space>
                Compétences
                <Button size="small" type="dashed" onClick={() => setAddModal({ open: true, type: "competence", value: "" })}>
                  <PlusOutlined /> Ajouter
                </Button>
              </Space>
            } name="competences">
              <Select mode="multiple" placeholder="Sélectionner les compétences">
                {competences.map(comp => (
                  <Option key={comp.id} value={comp.id}>{comp.nom}</Option>
                ))}
              </Select>
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Expériences" key="experiences">
            <Form.List name="experiences">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item
                        {...restField}
                        name={[name, "annee"]}
                        rules={[{ required: true, message: "Année" }]}
                      >
                        <Input placeholder="Année ou période" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "titre"]}
                        rules={[{ required: true, message: "Titre" }]}
                      >
                        <Input placeholder="Titre" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "role"]}
                      >
                        <Input placeholder="Rôle" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "type_experience"]}
                      >
                        <Input placeholder="Type (film, pub...)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                      >
                        <Input placeholder="Description" />
                      </Form.Item>
                      <Button danger type="text" onClick={() => remove(name)}>Supprimer</Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Ajouter une expérience
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Tabs.TabPane>
          {/* Tu peux ajouter ici d'autres sections pour Médias, Attributs, etc. */}
        </Tabs>
        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Ajouter le talent
          </Button>
        </Form.Item>
      </Form>
      {/* Modal d'ajout dynamique */}
      <Modal
        open={addModal.open}
        title={`Ajouter une ${addModal.type}`}
        onCancel={() => setAddModal({ open: false, type: "", value: "" })}
        onOk={handleAddOption}
        okText="Ajouter"
        cancelText="Annuler"
      >
        <Input
          placeholder={`Nom de la ${addModal.type}`}
          value={addModal.value}
          onChange={e => setAddModal({ ...addModal, value: e.target.value })}
          onPressEnter={handleAddOption}
        />
      </Modal>
    </Spin>
  );
}
