export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar navigation will be added later */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
