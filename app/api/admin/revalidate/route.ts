import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Internal revalidation endpoint for admin panel.
 * Validates user is authenticated via Authorization header.
 */
export async function POST(request: NextRequest) {
  try {
    // Check Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, slug } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Type is required' },
        { status: 400 }
      );
    }

    // Next.js 16 requires 'max' cache profile for revalidateTag
    switch (type) {
      case 'member':
        await revalidateTag('members', 'max');
        await revalidateTag('members-all', 'max');
        await revalidatePath('/equipo', 'page');
        await revalidatePath('/directorio', 'page');
        
        if (slug) {
          await revalidateTag(`member-${slug}`, 'max');
          await revalidatePath(`/m/${slug}`, 'page');
          await revalidatePath(`/directorio/${slug}`, 'page');
        }
        break;

      case 'post':
        await revalidateTag('posts', 'max');
        await revalidatePath('/blog', 'page');
        
        if (slug) {
          await revalidateTag(`post-${slug}`, 'max');
          await revalidatePath(`/blog/${slug}`, 'page');
        }
        break;

      case 'author':
        await revalidateTag('authors', 'max');
        
        if (slug) {
          await revalidateTag(`author-${slug}`, 'max');
          await revalidatePath(`/blog/autor/${slug}`, 'page');
        }
        break;

      case 'tag':
        await revalidateTag('tags', 'max');
        await revalidatePath('/blog', 'page');
        
        if (slug) {
          await revalidatePath(`/blog/categoria/${slug}`, 'page');
        }
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
    console.error('[Admin Revalidate] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
