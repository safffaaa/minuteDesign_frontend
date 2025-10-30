import React, { useEffect, useState } from "react";
import { Search, Edit3, Trash2 } from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AddEmployee from "./AddEmployee.jsx";

export default function EmployeeList() {
  const { token, user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /** -----------------------------
   * FETCH EMPLOYEES
   * ---------------------------- */
  const fetchEmployees = async () => {
    try {
      const res = await API.get("employee/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  /** -----------------------------
   * HANDLE EMPLOYEE EDIT & DELETE
   * ---------------------------- */
  const openEdit = (emp) => {
    setEditingEmployee(emp);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await API.delete(`employee/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const filteredEmployees = employees
    .filter((e) => e.role !== "admin")
    .filter((e) =>
      [e.name, e.email].some((f) =>
        f?.toLowerCase().includes(search.toLowerCase())
      )
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 md:p-6 md:m-15 m-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          👥 Employee List
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Hourly Rate</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((e) => (
                <tr
                  key={e._id}
                  className="border-t hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-800 font-medium">{e.name}</td>
                  <td className="px-4 py-3 text-gray-700">{e.email}</td>
                  <td className="px-4 py-3 capitalize text-gray-700">{e.role}</td>
                  <td className="px-4 py-3 text-gray-700">
                    ${e.hourlyRate || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(e)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(e._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <AddEmployee
            employee={editingEmployee}
            onClose={() => {
              closeModal();
              fetchEmployees();
            }}
            onEmployeeAdded={fetchEmployees}
          />
        </div>
      )}
    </div>
  );
}
