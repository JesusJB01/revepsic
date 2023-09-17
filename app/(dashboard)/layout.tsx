import NavbarDash from "@/components/NavbarDash";







export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


/* const user = await data() */



  return (
    <div className="flex flex-col md:flex-row gap-2 w-full dark:text-white">
     
     {/*  {!user && <ReditectPage/> }
         */}

        <NavbarDash/> 

      <main className=" py-3 flex-1 ">
        {children}
      </main>
    </div>
  );
}
