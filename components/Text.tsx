"use client";

import generateSlug from "@/helpers/GenarateSlug";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];

const modules = {
  toolbar: toolbarOptions,
};

const supabase = createClientComponentClient();

export default function Text() {

  const [formData, setFormData] = useState({
    title: "",
    createDate: "",
    summary: "",
    content: "",
    slug: "",
  });

  

  const handleGenerateSlug = () => {
    if (formData.title) {
      const generatedSlug = generateSlug(formData.title);
      setFormData({ ...formData, slug: generatedSlug });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("blog")
      .insert([
        {
          title: formData.title,
          description: formData.summary,
          content: formData.content,
          slug: formData.slug,
        },
      ]);

    if (error) {
      console.error("Error al guardar en Supabase:", error);
    } else {
      console.log("Datos guardados en Supabase:", data);
            // Limpia los campos del formulario
      setFormData({
        title: "",
        createDate: "",
        summary: "",
        content: "",
        slug: "",
      });

      // Puedes realizar alguna acción adicional después de guardar los datos, como redirigir.
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-gray-300">
      <form onSubmit={handleSubmit}>
        <div className="max-w-screen-lg mx-auto p-4 bg-gray-100 border border-gray-300 shadow-lg">
          <header className="mb-4 text-center font-bold">
            <h1 className="text-2xl font-bold">Crear Artículo</h1>
          </header>
          <main className="dark:text-white">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Título:
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="createDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Fecha de Creación:
              </label>
              <input
                type="date"
                id="createDate"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.createDate}
                onChange={(e) => handleChange("createDate", e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="slug"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Slug:
              </label>
              <input
                type="text"
                id="slug"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                required
              />
              <button
                className="p-3 bg-violet-500 rounded-md mt-1"
                type="button"
                onClick={handleGenerateSlug}
              >
                Generar Slug
              </button>
            </div>
            <div className="mb-4">
              <label
                htmlFor="summary"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Resumen:
              </label>
              <textarea
                id="summary"
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                value={formData.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Contenido:
              </label>
              <ReactQuill
                theme="snow"
                modules={modules}
                value={formData.content}
                onChange={(value) => handleChange("content", value)}
                className="border border-gray-300 dark:text-black"
              />
            </div>
          </main>
          <footer className="flex justify-center">
          
              <button
                type="submit"
                className="px-4 py-2   bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Guardar Artículo
              </button>
          </footer>
        </div>
      </form>
    </div>
  );
}
