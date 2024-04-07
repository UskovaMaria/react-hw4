import { useState, useEffect } from "react";
import { AddForm } from "./components/AddForm";
import { EmployerList } from "./components/EmployerList";
import { EditForm } from "./components/EditForm";

const App = () => {
  const [empList, setEmpList] = useState([]);
  console.log(empList);

  const [editingEmployer, setEditingEmployer] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/employers")
      .then((response) => response.json())
      .then((data) => setEmpList(data));
  }, []);

  const addEmployer = (employer) => {
    fetch("http://localhost:3000/employers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employer),
    })
      .then((response) => response.json())
      .then((data) => {
        setEmpList([...empList, data]);
      });
  };

  const deleteEmployer = (id) => {
    fetch(`http://localhost:3000/employers/${id}`, {
      method: "DELETE",
    }).then(() => {
      setEmpList(empList.filter((emp) => emp.id !== id));
    });
  };

  const editEmployer = (id) => {
    const employerToEdit = empList.find((emp) => emp.id === id);
    setEditingEmployer(employerToEdit);
    setIsEditPopupOpen(true);
  };

  const updateEmployer = (updatedEmployer) => {
    fetch(`http://localhost:3000/employers/${updatedEmployer.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEmployer),
    }).then(() => {
      setEmpList(empList.map((emp) => (emp.id === updatedEmployer.id ? updatedEmployer : emp)));
      setEditingEmployer(null);
    });
  };

  return (
    <div className="container">
      <h1>Список працівників</h1>
      <div className="employer-list-app">
        <AddForm addEmployer={addEmployer} />
        <div className="employer-list-block">
          <p className="employer-list-count">
            Кількість працівників: <span>{empList.length}</span>
          </p>
          <EmployerList
            data={empList}
            removeEmployer={deleteEmployer}
            editEmployer={editEmployer}
          />
        </div>
      </div>
      {isEditPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <EditForm
              editingEmployer={editingEmployer}
              updateEmployer={updateEmployer}
              cancelEdit={() => {
                setEditingEmployer(null);
                setIsEditPopupOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;