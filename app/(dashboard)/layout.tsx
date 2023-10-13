import NavbarDash from "@/components/NavbarDash";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-2 w-full dark:text-white">
      <NavbarDash />

      <main className=" py-3 flex-1 ">{children}</main>
    </div>
  );
}
