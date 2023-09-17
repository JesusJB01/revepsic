import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';


export  async function GET() {
    const supabase = createClientComponentClient();
    try {
        const { data, error } = await supabase
            .from('blog')
            .select('id, title, created_at, description, content, slug');
        
        if (error) {
            console.error('Error al obtener datos de Supabase:', error);
            return NextResponse.json({ error: 'Error al obtener datos' }); // Devuelve una respuesta de error con estado 500
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error inesperado:', error);
        return NextResponse.json({ error: 'Error inesperado' }); // Devuelve una respuesta de error con estado 500
    }

    
}