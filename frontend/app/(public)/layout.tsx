export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">ERP System</h1>
          <nav>
            <a href="/" className="px-3 py-2 text-gray-700 hover:text-blue-600">خانه</a>
            <a href="/login" className="px-3 py-2 text-gray-700 hover:text-blue-600">ورود</a>
            <a href="/signup" className="px-3 py-2 text-gray-700 hover:text-blue-600">ثبت نام</a>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 ERP System. All rights reserved.</p>
      </footer>
    </div>
  );
}
