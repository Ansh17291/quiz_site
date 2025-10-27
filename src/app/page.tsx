"use client";
import { useRouter } from "next/navigation";
export default function MainPage() {
  const router = useRouter();
  return (
    <>
      <h1 className="text-center">Welcome to XIE</h1>
      <button
        className="bg-red-200 p-3 rounded-lg"
        onClick={() => {
          router.push("/admin-login");
        }}
      >
        Go to Admin login
      </button>
      <button
        className="bg-red-200 p-3 rounded-lg"
        onClick={() => {
          router.push("/teacher-login");
        }}
      >
        Go to Teacher login
      </button>
      <button
        className="bg-red-200 p-3 rounded-lg"
        onClick={() => {
          router.push("/student-login");
        }}
      >
        Go to Student login
      </button>
    </>
  );
}
