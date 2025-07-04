import { Button, Form, Input, message, Modal, Space, Steps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import TalentStepContacts from "./components/TalentStepContacts";
import TalentStepExperiences from "./components/TalentStepExperiences";
import TalentStepInfos from "./components/TalentStepInfos";
import TalentStepMediasAttributs from "./components/TalentStepMediasAttributs";
import TalentStepReview from "./components/TalentStepReview";
import TalentStepSkills from "./components/TalentStepSkills";

const { Step } = Steps;

export default function TalentAddWizard() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Options chargées via API
  const [agents, setAgents] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  const [langues, setLangues] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typesExperience, setTypesExperience] = useState([]);

  // Uploads
  const [photoList, setPhotoList] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Modals
  const [addModal, setAddModal] = useState({ open: false, type: "", value: "" });
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [newAgentLoading, setNewAgentLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [
        agentsRes,
        locRes,
        langRes,
        compRes,
        catRes,
        typeExpRes,
      ] = await Promise.all([
        axios.get("/api/agents/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("/api/localisations/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("/api/langues/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("/api/competences/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("/api/categories-talents/", { headers: { Authorization: `Token ${token}` } }),
        axios.get("/api/types-experience/", { headers: { Authorization: `Token ${token}` } }),
      ]);
      setAgents(agentsRes.data);
      setLocalisations(locRes.data);
      setLangues(langRes.data);
      setCompetences(compRes.data);
      setCategories(catRes.data);
      setTypesExperience(typeExpRes.data);
    } catch {
      message.error("Erreur lors du chargement des options.");
    }
  };

  const steps = [
    { title: "Infos principales" },
    { title: "Contacts" },
    { title: "Compétences & Langues" },
    { title: "Expériences" },
    { title: "Médias & Attributs" },
    { title: "Revue & Validation" },
  ];

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData(prev => ({ ...prev, ...values }));
      setCurrentStep(currentStep + 1);
      form.resetFields();
      form.setFieldsValue({ ...formData, ...values });
    } catch {
      message.error("Merci de corriger les erreurs avant de continuer.");
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
    form.resetFields();
    form.setFieldsValue(formData);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      data.append("nom", formData.nom);
      data.append("prenom", formData.prenom);
      data.append("sexe", formData.sexe);
      data.append("date_naissance", formData.date_naissance.format("YYYY-MM-DD"));
      data.append("description", formData.description || "");
      data.append("taille", formData.taille || "");
      data.append("poids", formData.poids || "");
      data.append("permis", formData.permis || "");
      if (formData.agent) data.append("agent", formData.agent);

      if (photoList.length > 0) data.append("photo_principale", photoList[0].originFileObj);

      mediaFiles.forEach(file => data.append("medias", file.originFileObj));

      (formData.localisations || []).forEach(id => data.append("localisations", id));
      (formData.langues || []).forEach(id => data.append("langues", id));
      (formData.competences || []).forEach(id => data.append("competences", id));
      (formData.categories || []).forEach(id => data.append("categories", id));

      if (formData.contacts && formData.contacts.length) data.append("contacts", JSON.stringify(formData.contacts));
      if (formData.experiences && formData.experiences.length) data.append("experiences", JSON.stringify(formData.experiences));
      if (formData.attributs && formData.attributs.length) data.append("attributs", JSON.stringify(formData.attributs));

      await axios.post("/api/talents/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Talent ajouté avec succès !");
      form.resetFields();
      setPhotoList([]);
      setMediaFiles([]);
      setFormData({});
      setCurrentStep(0);
    } catch {
      message.error("Erreur lors de l'ajout du talent.");
    }
    setLoading(false);
  };

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TalentStepInfos
            form={form}
            agents={agents}
            categories={categories}
            onAddAgent={() => setAgentModalOpen(true)}
            onAddCategory={() => setAddModal({ open: true, type: "categorie", value: "" })}
            photoList={photoList}
            setPhotoList={setPhotoList}
          />
        );
      case 1:
        return <TalentStepContacts form={form} />;
      case 2:
        return (
          <TalentStepSkills
            form={form}
            localisations={localisations}
            langues={langues}
            competences={competences}
            onAddLocalisation={() => setAddModal({ open: true, type: "localisation", value: "" })}
            onAddLangue={() => setAddModal({ open: true, type: "langue", value: "" })}
            onAddCompetence={() => setAddModal({ open: true, type: "competence", value: "" })}
          />
        );
      case 3:
        return (
          <TalentStepExperiences
            form={form}
            typesExperience={typesExperience}
            onAddTypeExperience={() => setAddModal({ open: true, type: "type_experience", value: "" })}
          />
        );
      case 4:
        return (
          <TalentStepMediasAttributs
            form={form}
            mediaFiles={mediaFiles}
            setMediaFiles={setMediaFiles}
          />
        );
      case 5:
        return <TalentStepReview data={formData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form form={form} layout="vertical" initialValues={formData}>
        {stepContent()}

        <Form.Item>
          <Space>
            {currentStep > 0 && <Button onClick={prev}>Précédent</Button>}
            {currentStep < steps.length - 1 && <Button type="primary" onClick={next}>Suivant</Button>}
            {currentStep === steps.length - 1 && <Button type="primary" onClick={submit} loading={loading}>Valider</Button>}
          </Space>
        </Form.Item>
      </Form>

      {/* Modal ajout option dynamique */}
      <Modal
        open={addModal.open}
        title={`Ajouter une ${addModal.type.replace('_', ' ')}`}
        onCancel={() => setAddModal({ open: false, type: "", value: "" })}
        onOk={async () => {
          if (!addModal.value.trim()) return;
          setLoading(true);
          try {
            let url, setter;
            switch (addModal.type) {
              case "localisation":
                url = "/api/localisations/";
                setter = setLocalisations;
                break;
              case "langue":
                url = "/api/langues/";
                setter = setLangues;
                break;
              case "competence":
                url = "/api/competences/";
                setter = setCompetences;
                break;
              case "categorie":
                url = "/api/categories-talents/";
                setter = setCategories;
                break;
              case "type_experience":
                url = "/api/types-experience/";
                setter = setTypesExperience;
                break;
              default:
                setLoading(false);
                return;
            }
            const res = await axios.post(url, { nom: addModal.value }, { headers: { Authorization: `Token ${token}` } });
            setter(prev => [...prev, res.data]);
            message.success("Ajouté !");
            setAddModal({ open: false, type: "", value: "" });
          } catch {
            message.error("Erreur lors de l'ajout.");
          }
          setLoading(false);
        }}
        okText="Ajouter"
        cancelText="Annuler"
        confirmLoading={loading}
      >
        <Input
          placeholder={`Nom de la ${addModal.type.replace('_', ' ')}`}
          value={addModal.value}
          onChange={e => setAddModal({ ...addModal, value: e.target.value })}
          onPressEnter={() => {/* same as onOk */}}
          autoFocus
        />
      </Modal>

      {/* Modal création agent */}
      <Modal
        open={agentModalOpen}
        title="Ajouter un agent"
        onCancel={() => setAgentModalOpen(false)}
        footer={null}
      >
        <AgentForm
          onCancel={() => setAgentModalOpen(false)}
          onSuccess={async (agentValues) => {
            setNewAgentLoading(true);
            try {
              const res = await axios.post("/api/agents/", agentValues, { headers: { Authorization: `Token ${token}` } });
              setAgents(prev => [...prev, res.data]);
              form.setFieldsValue({ agent: res.data.id });
              message.success("Agent créé avec succès !");
              setAgentModalOpen(false);
            } catch {
              message.error("Erreur lors de la création de l'agent.");
            }
            setNewAgentLoading(false);
          }}
          loading={newAgentLoading}
        />
      </Modal>
    </>
  );
}
