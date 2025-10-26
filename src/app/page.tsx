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
          router.push("/login");
        }}
      >
        Go to login
      </button>
    </>
  );
}
