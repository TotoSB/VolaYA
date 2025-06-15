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
      {autos.length > 0 ? (
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Precio x Día</th>
              <th>Acciones</th>
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
                <td>
                  <Link
                    to={`/staff/autos/editar/${auto.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </Link>
                  <button className="btn btn-danger btn-sm">Eliminar</button>
                </td>
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
  );
};

export default ListCars;
