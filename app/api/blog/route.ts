import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';



export async function GET() {
 const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase URL o Supabase Anon Key no están configurados.');
        return NextResponse.json({ error: 'Error al obtener datos' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase
            .from('blog')
            .select('id, title, created_at, description, content, slug');

        if (error) {
            console.error('Error al obtener datos de Supabase:', error);
            return NextResponse.json({ error: 'Error al obtener datos' });
        }
            
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error inesperado:', error);
        return NextResponse.json({ error: 'Error inesperado' });
    } 

   

}
