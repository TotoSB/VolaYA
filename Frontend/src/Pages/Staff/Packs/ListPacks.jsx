import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListPacks = () => {
  const [paquetes, setPaquetes] = useState([]);

  const handleDelete = (paqueteId) => {
    const token = localStorage.getItem("access");

    if (!window.confirm("¿Estás seguro de que querés eliminar este paquete?")) return;

    fetch(`http://127.0.0.1:8000/eliminar_paquete/${paqueteId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar el paquete");
        return res.json();
      })
      .then((data) => {
        alert(data.message || "Paquete eliminado");
        // Filtrar el paquete eliminado de la lista
        setPaquetes((prev) => prev.filter((p) => p.id !== paqueteId));
      })
      .catch((err) => {
        console.error(err);
        alert("Error al eliminar el paquete");
      });
  };


  useEffect(() => {
    const token = localStorage.getItem("access");

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
  }, []);

  return (
    <div className="container mt-4">
      <div
        className="d-flex align-items-center mb-3 fw-bold gap-2"
        style={{ color: "#0d6efd", fontSize: "25px" }}
      >
        <i
          className="bx bx-package"
          style={{ fontSize: "2rem", color: "#0d6efd" }}
        ></i>
        Lista De Paquetes
      </div>
      <div
        className="table-responsive"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
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
                      <Link
                        to={`/staff/paquetes/editar/${pack.id}`}
                        className="btn btn-primary btn-sm"
                        style={{
                          backgroundColor: "transparent",
                          borderColor: "#0d6efd",
                        }}
                        title="Modificar"
                      >
                        <i
                          className="bx bx-edit"
                          style={{ fontSize: "1.2rem", color: "#0d6efd" }}
                        ></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        style={{
                          background: "transparent",
                          borderColor: "#dc3545",
                        }}
                        title="Eliminar"
                          onClick={() => handleDelete(pack.id)}
                      >
                        <i
                          className="bx bx-trash"
                          style={{ fontSize: "1.2rem", color: "#dc3545" }}
                        ></i>
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
    </div>
  );
};

export default ListPacks;
