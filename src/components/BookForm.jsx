"use client";

import { useState, useEffect } from "react";
import { getManualBooks, saveManualBooks } from "@/utils/bookStorage";
import { X, ChevronDown } from "lucide-react";

const BookForm = ({ bookToEdit, onClose, onSave }) => {
  const [book, setBook] = useState({
    id: "",
    title: "",
    originalPrice: "",
    salePrice: "",
    image: "",
    description: "",
    publisher: "",
    language: "English",
    pages: "",
    stock: "",
    category: "Self-Help",
  });

  const categories = [
    "Self-Help",
    "Psychology",
    "Finance",
    "Novel",
    "History",
    "Spirituality",
    "Islamic",
    "Academic",
  ];

  useEffect(() => {
    if (bookToEdit) setBook(bookToEdit);
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const manualBooks = getManualBooks();

    if (book.id) {
      saveManualBooks(manualBooks.map((b) => (b.id === book.id ? book : b)));
    } else {
      saveManualBooks([
        ...manualBooks,
        { ...book, id: "manual-" + Date.now() },
      ]);
    }

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {book.id ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Floating Label Inputs */}
          {[
            { name: "title", label: "Title*", type: "text", required: true },
            {
              name: "originalPrice",
              label: "Original Price*",
              type: "number",
              required: true,
            },
            {
              name: "salePrice",
              label: "Sale Price*",
              type: "number",
              required: true,
            },
            { name: "stock", label: "Stock*", type: "number", required: true },
            { name: "image", label: "Image URL", type: "url" },
            { name: "publisher", label: "Publisher", type: "text" },
            { name: "language", label: "Language", type: "text" },
            { name: "pages", label: "Pages", type: "number" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                type={field.type}
                name={field.name}
                value={book[field.name]}
                onChange={
                  field.type === "number"
                    ? (e) => {
                        setBook((prev) => ({
                          ...prev,
                          [field.name]:
                            e.target.value === "" ? "" : Number(e.target.value),
                        }));
                      }
                    : handleChange
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg peer focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder=" "
                required={field.required}
                min={field.type === "number" ? 0 : undefined}
              />
              <label className="absolute left-3 top-1/2 -translate-y-1/2 px-1 bg-white text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
                {field.label}
              </label>
            </div>
          ))}

          {/* Category Select */}
          <div className="relative">
            <select
              name="category"
              value={book.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Description Textarea */}
          <div className="md:col-span-2 relative">
            <textarea
              name="description"
              value={book.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg peer focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder=" "
            />
            <label className="absolute left-3 top-2 px-1 bg-white text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
              Description
            </label>
          </div>

          {/* Form Actions */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
            >
              {book.id ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
