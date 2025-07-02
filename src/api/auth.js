export async function logout(token) {
  const response = await fetch("http://localhost:8000/api/auth/logout/", {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Erreur lors de la déconnexion");
  return await response.json();
}
