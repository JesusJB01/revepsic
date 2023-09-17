import React from "react";

import Text from "@/components/Text";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Index() {

  const supabase = createServerComponentClient({ cookies });

  // Obtenemos la información del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {/* Contenido principal */}
      <div className=" ">
        {user ? (
          <div className="w-full flex flex-col items-center pt-24 text-black">
            <Text />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center text-black">
            Inicia sesión para ver el contenido
          </div>
        )}
      </div>
    </>
  );
}
