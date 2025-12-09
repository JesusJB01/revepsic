import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Verificar secret
  const secret = request.headers.get('x-revalidate-secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    console.log('[Revalidate] Invalid secret provided');
    return NextResponse.json(
      { success: false, error: 'Invalid secret' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, slug, action } = body;

    console.log(`[Revalidate] Received: type=${type}, slug=${slug}, action=${action}`);

    switch (type) {
      case 'post':
        // Revalidar tag general de posts
        revalidateTag('posts');
        
        // Si hay slug específico, revalidar ese post
        if (slug) {
          revalidateTag(`post-${slug}`);
          revalidatePath(`/blog/${slug}`);
        }
        
        // Revalidar páginas que muestran posts
        revalidatePath('/blog');
        revalidatePath('/'); // Homepage puede mostrar posts recientes
        
        console.log('[Revalidate] Posts revalidated');
        break;

      case 'tag':
        revalidateTag('tags');
        revalidatePath('/blog');
        
        if (slug) {
          revalidateTag(`tag-${slug}`);
          revalidatePath(`/blog/categoria/${slug}`);
        }
        
        console.log('[Revalidate] Tags revalidated');
        break;

      case 'author':
        revalidateTag('authors');
        
        if (slug) {
          revalidateTag(`author-${slug}`);
          revalidateTag(`author-${slug}-posts`);
          revalidatePath(`/blog/autor/${slug}`);
        }
        
        console.log('[Revalidate] Authors revalidated');
        break;

      case 'all':
        // Revalidar todo
        revalidateTag('posts');
        revalidateTag('tags');
        revalidateTag('authors');
        revalidatePath('/blog');
        revalidatePath('/');
        
        console.log('[Revalidate] All content revalidated');
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      now: Date.now(),
      type,
      slug: slug || null,
    });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

// También permitir GET para testing (solo en desarrollo)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'GET not allowed in production' },
      { status: 405 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'all';
  const slug = searchParams.get('slug');

  // Simular el POST
  const mockRequest = {
    headers: { get: () => process.env.REVALIDATE_SECRET },
    json: async () => ({ type, slug }),
  } as unknown as NextRequest;

  // Esta es solo para testing - en producción usar POST
  console.log('[Revalidate] GET request (dev only):', { type, slug });
  
  try {
    switch (type) {
      case 'post':
        revalidateTag('posts');
        if (slug) revalidatePath(`/blog/${slug}`);
        revalidatePath('/blog');
        break;
      case 'all':
        revalidateTag('posts');
        revalidateTag('tags');
        revalidateTag('authors');
        revalidatePath('/blog');
        break;
    }

    return NextResponse.json({
      success: true,
      message: 'Revalidated (dev mode)',
      type,
      slug,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
