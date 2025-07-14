import { auth, provider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/tareas");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Gestor de Tareas</h2>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
    </div>
  );
}

export default Login;