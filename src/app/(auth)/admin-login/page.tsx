"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, action: "admin-login" }),
      });

      const data = await res.json();
      console.log("login response", data);

      if (res.ok) {
        // Server sets httpOnly cookie; front-end can't read it. Redirect to student area.
        router.push("/user");
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (err) {
      setErrorMsg("Network error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    const res = await fetch("/api", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, action: "admin-login" }),
    });

    const data = await res.json();
    console.log(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Admin Login Page
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#1e00ff",
              boxShadow: isLoading
                ? "none"
                : "0 4px 14px rgba(30, 0, 255, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "#1700cc";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "#1e00ff";
            }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Sign In"
            )}
          </button>
          <br />
          <br />
          <Link
            href="/teacher-login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Teacher Login Page
          </Link>
          <br />
          <br />
          <Link
            href="/student-login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Student Login Page
          </Link>
        </div>
      </div>
    </div>
  );
}
