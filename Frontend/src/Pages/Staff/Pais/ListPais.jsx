import React, { useEffect, useState } from "react";
import SuccessModal from "../../../components/SuccessModal.jsx";

const ListPacks = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [paqueteEditar, setPaqueteEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("access");

  const cargarPaquetes = () => {
    fetch("http://127.0.0.1:8000/conseguir_paquetes_lista/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener paquetes");
        return res.json();
      })
      .then((data) => setPaquetes(data))
      .catch((err) => {
        console.error(err);
        setPaquetes([]);
      });
  };

  useEffect(() => {
    cargarPaquetes();
  }, []);

  const handleEditar = (paquete) => {
    setPaqueteEditar(paquete);
  };

  const handleUpdate = () => {
    fetch(`http://127.0.0.1:8000/actualizar_paquete/${paqueteEditar.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paqueteEditar),
    })
      .then((res) => {
        if (res.ok) {
          setShowModal(true);
          setPaqueteEditar(null);
          cargarPaquetes();
        } else {
          alert("Error al actualizar el paquete");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-package" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista De Paquetes
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {paquetes.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Personas</th>
                <th>Vuelo Ida</th>
                <th>Vuelo Vuelta</th>
                <th>Auto</th>
                <th>Hotel</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paquetes.map((pack) => (
                <tr key={pack.id}>
                  <td>{pack.id}</td>
                  <td>{pack.descripcion}</td>
                  <td>{pack.personas}</td>
                  <td>{pack.vuelo_ida || "—"}</td>
                  <td>{pack.vuelo_vuelta || "—"}</td>
                  <td>{pack.auto || "—"}</td>
                  <td>{pack.hotel || "—"}</td>
                  <td>{pack.total}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleEditar(pack)}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                        title="Modificar"
                      >
                        <i className="bx bx-edit" style={{ fontSize: "1.2rem", color: "#0d6efd" }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No se encontraron paquetes para mostrar.
          </p>
        )}
      </div>

      {paqueteEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Paquete ID {paqueteEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                className="form-control"
                value={paqueteEditar.descripcion}
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, descripcion: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Personas</label>
              <input
                type="number"
                className="form-control"
                value={paqueteEditar.personas}
                onChange={(e) => setPaqueteEditar({ ...paqueteEditar, personas: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setPaqueteEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message="¡Paquete actualizado correctamente!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListPacks;
