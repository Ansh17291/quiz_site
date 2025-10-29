"use client";
import { useState, useEffect, use } from "react";
import {
  Users,
  FileText,
  Upload,
  Settings,
  User,
  Lock,
  LogOut,
  Search,
  Edit,
  Trash2,
  Plus,
  X,
  Download,
  CheckSquare,
  Key,
} from "lucide-react";

export default function AdminDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [activeTab, setActiveTab] = useState("users");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<{
    id: number;
    testName: string;
    totalQuestions: number;
    totalTime: number;
  } | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [passwordUser, setPasswordUser] = useState<UserType | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSettings, setAdminSettings] = useState({
    name: "",
    email: "",
  });

  const { slug } = use(params);

  type UserType = {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  useEffect(() => {
    console.log(slug);
    const fetchuser = async () => {
      const rawData = await fetch("/api/admin", {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ action: "fetch-admin", userID: slug }),
      });
      const data = await rawData.json();

      const rawUsers = await fetch("/api/admin", {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ action: "fetch-users" }),
      });

      setAdminSettings({ name: data.admin.username, email: data.admin.email });

      const currUsers = await rawUsers.json();
      // console.log(currUsers.teachers);

      setUsers([
        ...currUsers.students.map((stud: any) => ({
          id: stud.id,
          name: stud.name,
          email: stud.email,
          role: "Student",
        })),
        ...currUsers.teachers.map((teach: any) => ({
          id: teach.id,
          name: teach.name,
          email: teach.email,
          role: "Teacher",
        })),
      ]);

      console.log();
    };

    fetchuser();
  }, []);

  const [users, setUsers] = useState<UserType[]>([
    {
      id: "",
      name: "",
      email: "",
      role: "",
    },
  ]);

  const [tests] = useState([
    {
      id: 1,
      testName: "Mathematics Fundamentals",
      totalQuestions: 50,
      totalTime: 60,
    },
    {
      id: 2,
      testName: "General Science Quiz",
      totalQuestions: 40,
      totalTime: 45,
    },
    {
      id: 3,
      testName: "English Comprehension",
      totalQuestions: 35,
      totalTime: 40,
    },
    { id: 4, testName: "Logical Reasoning", totalQuestions: 60, totalTime: 75 },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [newUser, setNewUser] = useState<Omit<UserType, "id">>({
    name: "",
    email: "",
    role: "Student",
  });

  const handleAddUser = () => {
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...newUser, id: editingUser.id } : u
        )
      );
    } else {
      setUsers([...users, { ...newUser, id: "" }]);
    }
    setShowUserModal(false);
    setEditingUser(null);
    setNewUser({ name: "", email: "", role: "Student" });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setNewUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (id: any) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleChangePassword = (user: any) => {
    setPasswordUser(user);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  const handleConfirmPasswordChange = () => {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    alert(`Password changed successfully for ${passwordUser?.name}`);
    console.log(
      "Password changed for user:",
      passwordUser?.id,
      "New password:",
      newPassword
    );
    setShowPasswordModal(false);
    setPasswordUser(null);
    setNewPassword("");
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log("File uploaded:", file.name);
    }
  };

  const handleProcessExcel = () => {
    alert(
      "Processing Excel file and creating users...\nDownload link will be generated."
    );
    console.log("Processing file:", uploadedFile?.name);
  };

  const handleAssignTest = (test: any) => {
    setSelectedTest(test);
    setSelectedUsers([]);
    setShowAssignModal(true);
  };

  const toggleUserSelection = (userId: any) => {
    setSelectedUsers((prev: any) =>
      prev.includes(userId)
        ? prev.filter((id: any) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleConfirmAssignment = () => {
    alert(
      `Test "${selectedTest?.testName}" assigned to ${selectedUsers.length} student(s)`
    );
    console.log("Assigned test:", selectedTest?.id, "to users:", selectedUsers);
    setShowAssignModal(false);
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminSettings?.name}
              </span>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "users"
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    activeTab === "users" ? { backgroundColor: "#1e00ff" } : {}
                  }
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Manage Users</span>
                </button>

                <button
                  onClick={() => setActiveTab("bulk")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "bulk"
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    activeTab === "bulk" ? { backgroundColor: "#1e00ff" } : {}
                  }
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Bulk Upload</span>
                </button>

                <button
                  onClick={() => setActiveTab("assign")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "assign"
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    activeTab === "assign" ? { backgroundColor: "#1e00ff" } : {}
                  }
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Assign Tests</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "settings"
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    activeTab === "settings"
                      ? { backgroundColor: "#1e00ff" }
                      : {}
                  }
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Manage Users */}
            {activeTab === "users" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Manage Users
                    </h2>
                    <p className="text-gray-600">Add, edit, or remove users</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setNewUser({
                        name: "",
                        email: "",
                        role: "Student",
                      });
                      setShowUserModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition-all"
                    style={{ backgroundColor: "#1e00ff" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1700cc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1e00ff")
                    }
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Role
                          </th>

                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.role}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="p-1.5 rounded hover:bg-blue-50 transition-colors"
                                  style={{ color: "#1e00ff" }}
                                  title="Edit user"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleChangePassword(user)}
                                  className="p-1.5 rounded hover:bg-amber-50 text-amber-600 transition-colors"
                                  title="Change password"
                                >
                                  <Key className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Upload */}
            {activeTab === "bulk" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bulk User Upload
                  </h2>
                  <p className="text-gray-600">
                    Upload an Excel file to create multiple users at once
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="max-w-2xl mx-auto">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Excel File
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload an Excel file (.xlsx, .xls) with user information
                      </p>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-6 py-2.5 rounded-lg text-white font-medium cursor-pointer transition-all"
                        style={{ backgroundColor: "#1e00ff" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#1700cc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#1e00ff")
                        }
                      >
                        Choose File
                      </label>
                      {uploadedFile && (
                        <p className="mt-4 text-sm text-gray-600">
                          Selected:{" "}
                          <span className="font-medium">
                            {uploadedFile.name}
                          </span>
                        </p>
                      )}
                    </div>

                    {uploadedFile && (
                      <div className="mt-6 flex gap-4">
                        <button
                          onClick={handleProcessExcel}
                          className="flex-1 px-6 py-3 rounded-lg text-white font-medium transition-all"
                          style={{ backgroundColor: "#1e00ff" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1700cc")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1e00ff")
                          }
                        >
                          Process & Create Users
                        </button>
                        <button
                          className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-medium text-gray-700 hover:bg-gray-50 transition-all"
                          style={{ borderColor: "#1e00ff" }}
                        >
                          <Download className="w-4 h-4" />
                          Download Template
                        </button>
                      </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Excel Format Requirements:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Column A: Name</li>
                        <li>• Column B: Email</li>
                        <li>• Column C: Role (Student/Teacher)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assign Tests */}
            {activeTab === "assign" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Assign Tests
                  </h2>
                  <p className="text-gray-600">
                    Assign tests to specific students
                  </p>
                </div>

                <div className="grid gap-4">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-white rounded-xl shadow-lg p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {test.testName}
                          </h3>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>{test.totalQuestions} Questions</span>
                            <span>•</span>
                            <span>{test.totalTime} Minutes</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignTest(test)}
                          className="px-6 py-2.5 rounded-lg text-white font-medium transition-all flex items-center gap-2"
                          style={{ backgroundColor: "#1e00ff" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1700cc")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1e00ff")
                          }
                        >
                          <CheckSquare className="w-4 h-4" />
                          Assign to Students
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Settings
                  </h2>
                  <p className="text-gray-600">
                    Manage your admin account preferences
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" style={{ color: "#1e00ff" }} />
                      Profile Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={adminSettings.name}
                          onChange={(e) =>
                            setAdminSettings({
                              ...adminSettings,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={adminSettings.email}
                          onChange={(e) =>
                            setAdminSettings({
                              ...adminSettings,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5" style={{ color: "#1e00ff" }} />
                      Security
                    </h3>
                    <button
                      className="text-sm font-medium hover:underline"
                      style={{ color: "#1e00ff" }}
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => alert("Settings saved!")}
                      className="px-6 py-2.5 rounded-lg text-white font-medium transition-all"
                      style={{ backgroundColor: "#1e00ff" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1700cc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1e00ff")
                      }
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option>Student</option>
                  <option>Teacher</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all"
                style={{ backgroundColor: "#1e00ff" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1700cc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e00ff")
                }
              >
                {editingUser ? "Update" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Test Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Assign: {selectedTest?.testName}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Select students to assign this test
            </p>

            <div className="max-h-96 overflow-y-auto mb-4">
              <div className="space-y-2">
                {users
                  .filter((u) => u.role === "Student")
                  .map((user: any) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50"
                      style={
                        selectedUsers.includes(user?.id)
                          ? {
                              borderColor: "#1e00ff",
                              backgroundColor: "#1e00ff10",
                            }
                          : { borderColor: "#e5e7eb" }
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user?.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#1e00ff" }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                disabled={selectedUsers.length === 0}
                className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#1e00ff" }}
                onMouseEnter={(e) => {
                  if (selectedUsers.length > 0)
                    e.currentTarget.style.backgroundColor = "#1700cc";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e00ff")
                }
              >
                Assign to {selectedUsers.length} Student
                {selectedUsers.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">User:</span> {passwordUser?.name}
              </p>
              <p className="text-sm text-gray-600">{passwordUser?.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPasswordChange}
                className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all"
                style={{ backgroundColor: "#1e00ff" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1700cc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e00ff")
                }
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
