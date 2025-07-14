import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import Tareas from "./tareas";
import { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(u => setUser(u));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/tareas" : "/login"} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/tareas"
          element={user ? <Tareas user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;