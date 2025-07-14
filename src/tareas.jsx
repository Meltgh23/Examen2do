import { db } from "./firebaseConfig";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

function Tareas({ user }) {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");
  const [modoEdicion, setModoEdicion] = useState(null);
  const [nuevoTexto, setNuevoTexto] = useState("");

  useEffect(() => {
    const q = query(collection(db, "tareas"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTareas(datos);
    });

    return () => unsubscribe();
  }, []);

  const agregarTarea = async () => {
    if (texto.trim() === "") return;

    await addDoc(collection(db, "tareas"), {
      texto,
      usuario: user.uid,
      fecha: new Date()
    });

    setTexto("");
  };

  const eliminarTarea = async (id) => {
    await deleteDoc(doc(db, "tareas", id));
  };

  const guardarEdicion = async (id) => {
    if (nuevoTexto.trim() === "") return;

    const tareaRef = doc(db, "tareas", id);
    await updateDoc(tareaRef, { texto: nuevoTexto });

    setModoEdicion(null);
    setNuevoTexto("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Mis Tareas</h2>

      <input
        type="text"
        placeholder="Nueva tarea"
        value={texto}
        onChange={e => setTexto(e.target.value)}
      />
      <button onClick={agregarTarea}>Agregar</button>

      <ul>
        {tareas
          .filter(t => t.usuario === user.uid)
          .map(t => (
            <li key={t.id} style={{ marginTop: "10px" }}>
              {modoEdicion === t.id ? (
                <>
                  <input
                    value={nuevoTexto}
                    onChange={(e) => setNuevoTexto(e.target.value)}
                  />
                  <button onClick={() => guardarEdicion(t.id)}> Guardar</button>
                  <button onClick={() => setModoEdicion(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  {t.texto}
                  <button onClick={() => {
                    setModoEdicion(t.id);
                    setNuevoTexto(t.texto);
                  }}>
                  
                  </button>
                  <button onClick={() => eliminarTarea(t.id)}>Eliminar</button>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Tareas;