import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListCars = () => {
  const [autos, setAutos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/conseguir_autos/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener autos");
        }
        return res.json();
      })
      .then((data) => {
        setAutos(data);
      })
      .catch((err) => {
        console.error(err);
        setAutos([]);
      });
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize:"25px" }}>
        <i className="bx bx-car" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
          Lista De Autos
      </div>   
      <div
        className="table-responsive"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {autos.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Color</th>
                <th>Precio x Día</th>
                {/* <th>Acciones</th> */}
              </tr>
            </thead>
            <tbody>
              {autos.map((auto) => (
                <tr key={auto.id}>
                  <td>{auto.id}</td>
                  <td>{auto.marca}</td>
                  <td>{auto.modelo}</td>
                  <td>{auto.color}</td>
                  <td>${auto.precio_dia}</td>
                  {/* <td>
                    <div className="d-flex justify-content-center gap-3">
                      <Link
                        to={`/staff/autos/editar/${auto.id}`}
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
                        style={{ background: "transparent", borderColor: "#dc3545" }}
                        title="Eliminar"
                      >
                        <i
                          className="bx bx-trash"
                          style={{ fontSize: "1.2rem", color: "#dc3545" }}
                        ></i>
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No se encontraron autos para mostrar.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListCars;
