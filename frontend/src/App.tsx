import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

interface User {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
    }
  };

  const addUser = async () => {
    try {
      await axios.post("http://localhost:3000/users", { name });
      setName("");
      fetchUsers();
    } catch (error) {
      console.error("❌ Erro ao adicionar usuário:", error);
    }
  };

  const editUser = async (id: number, currentName: string) => {
    const newName = prompt("Edite o nome do usuário:", currentName);
    if (newName && newName !== currentName) {
      try {
        await axios.put(`http://localhost:3000/users/${id}`, { name: newName });
        fetchUsers();
      } catch (error) {
        console.error("❌ Erro ao editar usuário:", error);
      }
    }
  };

  const deleteUser = async (id: number) => {
    const confirmDelete = window.confirm(
      "Tem certeza de que deseja excluir este usuário?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("❌ Erro ao excluir usuário:", error);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Usuários</h1>
      <div className="input-container">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome do usuário"
          className="input"
        />
        <button onClick={addUser} className="add-button">
          Adicionar Usuário
        </button>
      </div>
      <div className="user-list-container">
        {users.length === 0 ? (
          <div className="user-list">
            <p className="no-users-message">
              Nenhum usuário encontrado. Adicione alguns usuários!
            </p>
          </div>
        ) : (
          <ul className="user-list">
            {users.map((user, index) => (
              <li
                key={user.id}
                className="user-item"
                style={{ marginTop: index > 0 ? "1vh" : 0 }}
              >
                {user.name}
                <div className="button-container">
                  <button
                    onClick={() => editUser(user.id, user.name)}
                    className="edit-button"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
