"use client";
import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const FileUploader = () => {
  const [fileData, setFileData] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Leer el archivo CSV
    const parsedData = await readCSV(file);

    // Procesar datos, cambiar el formato, etc.
    const formattedData = processData(parsedData);

    // Generar el archivo XLSX
    generateXLSX(formattedData);
  };

  const readCSV = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        });
        resolve(parsedData.data);
      };
      reader.readAsText(file);
    });
  };

  const cleanPhoneNumber = async (phoneNumber) => {
    const cleanedInitialChars = await phoneNumber.replace(/['\s]/g, "");
    const cleanedPrefix = await cleanedInitialChars.replace(/^(\+54|54)?/, "");
    const cleanedNumber = await cleanedPrefix
      .replace(/\s/g, "")
      .replace(/-/g, "");
    return cleanedNumber;
  };

  const cleanPostalCode = async (postalCode) => {
    // Eliminar letras y comillas simples del código postal
    const cleanedPostalCode = await postalCode.replace(/[a-zA-Z'']/g, "");
    return cleanedPostalCode;
  };

  const removeAccentsAndSpecialChars = (str) => {
    return str
      .normalize("NFD") // Normalizar para separar caracteres diacríticos
      .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos
      .replace(/[áäâ]/gi, "a") // Reemplazar letras con acentos
      .replace(/[éëê]/gi, "e") // Reemplazar letras con acentos
      .replace(/[íïî]/gi, "i") // Reemplazar letras con acentos
      .replace(/[óöô]/gi, "o") // Reemplazar letras con acentos
      .replace(/[úüû]/gi, "u") // Reemplazar letras con acentos
      .replace(/ñ/gi, "n") // Reemplazar ñ por n
      .replace(/ü/gi, "u"); // Reemplazar ü por u
  };

  const processData = (data) => {
    // Aquí puedes realizar el procesamiento de datos necesario
    // Por ejemplo, cambiar el formato de columnas, agregar o quitar datos, etc.

    // Mapeo de columnas
    const newData = data.map(async (item) => {
      const cleanedPhoneNumber = await cleanPhoneNumber(item["Shipping Phone"]);

      const cleanedCodpostal = await cleanPostalCode(item["Shipping Zip"]);

      const shippingCity = await removeAccentsAndSpecialChars(
        item["Shipping City"]
      );
      const shippingAddress = await removeAccentsAndSpecialChars(
        item["Shipping Address1"]
      );
      const shippingName = await removeAccentsAndSpecialChars(
        item["Shipping Name"]
      );

      return {
        "tipo_producto(obligatorio)": "CP",
        "largo(obligatorio en CM)": "",
        "ancho(obligatorio en CM)": "",
        "altura(obligatorio en CM)": "",
        "peso(obligatorio en KG)": "",
        "valor_del_contenido(obligatorio en pesos argentinos)": "",
        "provincia_destino(obligatorio)": item["Shipping Province"],
        "sucursal_destino(obligatorio solo en caso de no ingresar localidad de destino)":
          "",
        "localidad_destino(obligatorio solo en caso de no ingresar sucursal de destino)":
          shippingCity,
        "calle_destino(obligatorio solo en caso de no ingresar sucursal de destino)":
          shippingAddress,
        "altura_destino(obligatorio solo en caso de no ingresar sucursal de destino)":
          "",
        "piso(opcional solo en caso de no ingresar sucursal de destino)": "",
        "dpto(opcional solo en caso de no ingresar sucursal de destino)": "",
        "codpostal_destino(obligatorio solo en caso de no ingresar sucursal de destino)":
          cleanedCodpostal,
        "destino_nombre(obligatorio)": shippingName,
        "destino_email(obligatorio, debe ser un email valido)": item["Email"],
        "cod_area_tel(opcional)": "",
        "tel(opcional)": "",
        "cod_area_cel(obligatorio)": "54",
        "cel(obligatorio)": cleanedPhoneNumber,
      };
    });

    // Crear un nuevo libro de trabajo (workbook)
    const workbook = XLSX.utils.book_new();

    // Crear una hoja de trabajo (worksheet)
    const worksheet = XLSX.utils.json_to_sheet(newData);

    // Agregar la hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nueva Hoja");

    // Guardar el libro de trabajo como un archivo Excel
    XLSX.writeFile(workbook, "estearchivotecambialavida.xlsx");

    // O bien, puedes devolver el libro de trabajo si lo necesitas para otro propósito
    // return workbook;

    return workbook;
  };

  const generateXLSX = (data) => {
    if (!Array.isArray(data)) {
      data = [data]; // Convierte a un array si no lo es
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "formatted_data.xlsx");
  };

  return (
    <div className="mx-10 md:mx-2 flex items-center justify-center h-screen">
      <div class="max-w-2xl mx-auto">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          for="file_input"
        >
          Subir archivo{" "}
        </label>
        <input
          onChange={handleFileChange}
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
        />

        <p class="mt-5">
          Con esto te ahorro 30 min de estar cargando manualmente el excel de
          Correo Argentino y Shopify, cargá el archivo order_exports y disfrutá
          pa,{" "}
          <a class="text-blue-600 hover:underline" href="#" target="_blank">
            Mateo
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default FileUploader;