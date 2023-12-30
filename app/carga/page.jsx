"use client";
import React, { useState } from "react";
import products from "../json/products";

function page() {
  const [producto, setProducto] = useState({
    name: "",
    alto: 0,
    ancho: 0,
    largo: 0,
    peso: 0,
    valor: 0,
  });

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className=" flex items-center justify-center">
        <label className="mx-2" htmlFor="">
          Nombre
        </label>
        <input
          className="border-2"
          type="text"
          onChange={(e) => {
            setProducto({ ...producto, name: e.target.value });
          }}
        />{" "}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <label className="mx-2" htmlFor="">
          Alto
        </label>
        <input
          className="border-2"
          type="number"
          onChange={(e) => {
            setProducto({ ...producto, alto: e.target.value });
          }}
        />{" "}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <label className="mx-2" htmlFor="">
          Ancho
        </label>
        <input
          className="border-2"
          type="number"
          onChange={(e) => {
            setProducto({ ...producto, ancho: e.target.value });
          }}
        />{" "}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <label className="mx-2" htmlFor="">
          Largo
        </label>
        <input
          className="border-2"
          type="number"
          onChange={(e) => {
            setProducto({ ...producto, largo: e.target.value });
          }}
        />{" "}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <label className="mx-2" htmlFor="">
          Peso
        </label>
        <input
          className="border-2"
          type="number"
          onChange={(e) => {
            setProducto({ ...producto, peso: e.target.value });
          }}
        />{" "}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <label className="mx-2" htmlFor="">
          Valor
        </label>
        <input
          className="border-2"
          type="number"
          onChange={(e) => {
            setProducto({ ...producto, valor: e.target.value });
          }}
        />{" "}
      </div>
      <div className="mt-2">
        <button
          onClick={products.push(producto)}
          className="border-2 p-2 rounded-md"
        >
          CARGAR
        </button>
      </div>
    </div>
  );
}

export default page;
