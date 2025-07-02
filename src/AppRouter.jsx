import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ActualiteAdd from "./pages/Dashboard/ActualiteAdd";
import ActualitesList from "./pages/Dashboard/ActualitesList";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import EvenementAdd from "./pages/Dashboard/EvenementAdd";
import EvenementsList from "./pages/Dashboard/EvenementsList";
import Parametres from "./pages/Dashboard/Parametres";
import ProjetAdd from "./pages/Dashboard/ProjetAdd";
import ProjetsList from "./pages/Dashboard/ProjetsList";
import RolesList from "./pages/Dashboard/RolesList";
import StatistiquesPage from "./pages/Dashboard/StatistiquesPage";
import TalentAdd from "./pages/Dashboard/TalentAdd";
import TalentDetailPage from "./pages/Dashboard/TalentDetailPage";
import TalentListPage from "./pages/Dashboard/TalentsList";
import UsersList from "./pages/Dashboard/UsersList";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}

export default function AppRouter() {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    const onStorage = () => setAuth(isAuthenticated());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuth(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard/*"
          element={
            auth
              ? <DashboardPage onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        >
          <Route path="statistiques" element={<StatistiquesPage />} />
          <Route path="talents" element={<TalentListPage />} />
          <Route path="talents-ajouter" element={<TalentAdd />} />
<Route path="talents/:slug" element={<TalentDetailPage />} />



          <Route path="users-list" element={<UsersList />} />
          <Route path="roles-list" element={<RolesList />} />
          <Route path="projets-list" element={<ProjetsList />} />
          <Route path="projets-ajouter" element={<ProjetAdd />} />
          <Route path="actualites-list" element={<ActualitesList />} />
          <Route path="actualites-ajouter" element={<ActualiteAdd />} />
          <Route path="evenements-list" element={<EvenementsList />} />
          <Route path="evenements-ajouter" element={<EvenementAdd />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route
          path="/profile"
          element={
            auth
              ? <ProfilePage />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            auth
              ? <Navigate to="/dashboard/statistiques" replace />
              : <LoginPage onLogin={() => setAuth(true)} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
