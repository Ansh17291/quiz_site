import Link from "next/link";
function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="font-bold text-6xl mb-6">Page not found</h1>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
        <Link href="/admin-login">Return to login</Link>
      </button>
    </div>
  );
}

export default NotFound;
