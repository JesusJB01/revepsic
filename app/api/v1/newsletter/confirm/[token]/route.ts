import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  
  // Redirigir a la página pública de confirmación
  redirect(`/newsletter/confirm/${token}`);
}
