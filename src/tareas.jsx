import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc} from "firebase/firestore";
import { db } from "./firebaseConfig";

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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Mis Tareas</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          className="flex-1 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={agregarTarea}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Agregar
        </button>
      </div>

      <ul className="space-y-3">
        {tareas
          .filter(t => t.usuario === user.uid)
          .map(t => (
            <li
              key={t.id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded shadow"
            >
              {modoEdicion === t.id ? (
                <div className="flex w-full gap-2">
                  <input
                    value={nuevoTexto}
                    onChange={(e) => setNuevoTexto(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  />
                  <button
                    onClick={() => guardarEdicion(t.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setModoEdicion(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1">{t.texto}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setModoEdicion(t.id);
                        setNuevoTexto(t.texto);
                      }}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarTarea(t.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Tareas;