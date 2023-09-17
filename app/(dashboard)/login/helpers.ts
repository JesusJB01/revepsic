import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


export const data = async () =>{
    const supabase = createServerComponentClient({ cookies }); 

    // Obtenemos la información del usuario
     const {
      data: { user },
    } = await supabase.auth.getUser();
    


    return user;

}

