"use client";
import { useEffect, useState, use } from "react";
import {
  Clock,
  FileText,
  Settings,
  User,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function UserDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [activeTab, setActiveTab] = useState("tests");

  // Available tests (start empty so page renders immediately)
  const [availableTests, setAvailableTests] = useState<
    {
      id: string;
      testName: string;
      totalQuestions: number;
      totalTime: number;
    }[]
  >([]);

  const [loadingTests, setLoadingTests] = useState(true);

  // params is available synchronously in client components; use it directly so
  // the page renders immediately and fetching happens in the background.
  const { slug } = use(params);

  useEffect(() => {
    let mounted = true;
    const fecthdata = async () => {
      try {
        setLoadingTests(true);
        const rawData = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get-tests", userID: slug }),
        });
        const data = await rawData.json();

        if (!mounted) return;

        setUserSettings({ email: data.email ?? "", name: data.username ?? "" });
        setAvailableTests(
          (data.tests || []).map((individualT: any) => ({
            id: String(individualT._id),
            testName: individualT.testName,
            totalQuestions: individualT.totalQuestions,
            totalTime: individualT.totalTime,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch tests:", err);
      } finally {
        if (mounted) setLoadingTests(false);
      }
    };
    fecthdata();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const [userSettings, setUserSettings] = useState({
    name: "",
    email: "",
  });

  const handleStartTest = (testId: any) => {
    console.log("Starting test:", testId);
    alert("Test started! Redirecting to quiz page...");
  };

  const handleSaveSettings = () => {
    console.log("Settings saved:", userSettings);
    alert("Settings saved successfully!");
  };

  const handeLogout = async () => {
    console.log("User logged out");
    await fetch("/api/user", {
      method: "POST", // or DELETE
      body: JSON.stringify({ action: "logout" }),
      credentials: "include", // ensures cookies are sent
    });

    // Optionally redirect or update UI
    window.location.href = "/student-login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Platform</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {userSettings.name}
              </span>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <LogOut
                  onClick={handeLogout}
                  className="w-5 h-5 text-gray-600"
                />
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
                  onClick={() => setActiveTab("tests")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === "tests"
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    activeTab === "tests" ? { backgroundColor: "#1e00ff" } : {}
                  }
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Available Tests</span>
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
            {activeTab === "tests" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available Tests
                  </h2>
                  <p className="text-gray-600">
                    Select a test to begin your assessment
                  </p>
                </div>

                <div className="grid gap-4">
                  {loadingTests ? (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <p className="text-gray-600">Loading tests…</p>
                    </div>
                  ) : availableTests.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <p className="text-gray-600">No tests available.</p>
                    </div>
                  ) : (
                    availableTests.map((test: any) => (
                      <div
                        key={test.id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {test.testName}
                            </h3>

                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">
                                  <span className="font-medium">
                                    {test.totalQuestions}
                                  </span>{" "}
                                  Questions
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">
                                  <span className="font-medium">
                                    {test.totalTime}
                                  </span>{" "}
                                  Minutes
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartTest(test.id)}
                            className="px-6 py-3 rounded-lg text-white font-medium transition-all flex items-center gap-2 justify-center md:justify-start whitespace-nowrap"
                            style={{ backgroundColor: "#1e00ff" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#1700cc")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#1e00ff")
                            }
                          >
                            Start Test
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Settings
                  </h2>
                  <p className="text-gray-600">
                    Manage your account preferences
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  {/* Profile Section */}
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
                          value={userSettings.name}
                          onChange={(e) =>
                            setUserSettings({
                              ...userSettings,
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
                          value={userSettings.email}
                          onChange={(e) =>
                            setUserSettings({
                              ...userSettings,
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
                      onClick={handleSaveSettings}
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
    </div>
  );
}
