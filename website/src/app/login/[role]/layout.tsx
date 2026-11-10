export function generateStaticParams() {
  return [{ role: "faculty" }, { role: "student" }, { role: "admin" }];
}

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
