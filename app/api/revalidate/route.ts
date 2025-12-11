import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Verificar secret
  const secret = request.headers.get('x-revalidate-secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Invalid secret' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, slug } = body;

    switch (type) {
      case 'post':
        await revalidateTag('posts', 'max');
        if (slug) {
          await revalidateTag(`post-${slug}`, 'max');
          await revalidatePath(`/blog/${slug}`, 'page');
        }
        await revalidatePath('/blog', 'page');
        await revalidatePath('/', 'page');
        break;

      case 'tag':
        await revalidateTag('tags', 'max');
        await revalidatePath('/blog', 'page');
        if (slug) {
          await revalidateTag(`tag-${slug}`, 'max');
          await revalidatePath(`/blog/categoria/${slug}`, 'page');
        }
        break;

      case 'author':
        await revalidateTag('authors', 'max');
        if (slug) {
          await revalidateTag(`author-${slug}`, 'max');
          await revalidateTag(`author-${slug}-posts`, 'max');
          await revalidatePath(`/blog/autor/${slug}`, 'page');
        }
        break;

      case 'member':
        await revalidateTag('members', 'max');
        await revalidateTag('members-all', 'max');
        if (slug) {
          await revalidateTag(`member-${slug}`, 'max');
          await revalidatePath(`/m/${slug}`, 'page');
          await revalidatePath(`/directorio/${slug}`, 'page');
        }
        await revalidatePath('/equipo', 'page');
        await revalidatePath('/directorio', 'page');
        break;

      case 'all':
        await revalidateTag('posts', 'max');
        await revalidateTag('tags', 'max');
        await revalidateTag('authors', 'max');
        await revalidateTag('members', 'max');
        await revalidatePath('/blog', 'page');
        await revalidatePath('/equipo', 'page');
        await revalidatePath('/directorio', 'page');
        await revalidatePath('/', 'page');
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

// GET for development testing only
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'GET not allowed in production' }, { status: 405 });
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'all';
  const slug = searchParams.get('slug');
  
  try {
    switch (type) {
      case 'post':
        await revalidateTag('posts', 'max');
        if (slug) await revalidatePath(`/blog/${slug}`, 'page');
        await revalidatePath('/blog', 'page');
        break;
      case 'all':
        await revalidateTag('posts', 'max');
        await revalidateTag('tags', 'max');
        await revalidateTag('authors', 'max');
        await revalidatePath('/blog', 'page');
        break;
    }

    return NextResponse.json({ success: true, message: 'Revalidated (dev mode)', type, slug });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
