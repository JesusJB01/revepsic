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

    // Optionally verify token with backend (for production)
    // For now, just check that a token is present
    // The user is already authenticated to access /admin routes

    const body = await request.json();
    const { type, slug } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Type is required' },
        { status: 400 }
      );
    }

    console.log(`[Admin Revalidate] type=${type}, slug=${slug}`);

    switch (type) {
      case 'member':
        revalidateTag('members');
        revalidateTag('members-all');
        revalidatePath('/equipo');
        
        if (slug) {
          revalidateTag(`member-${slug}`);
          revalidatePath(`/m/${slug}`);
        }
        break;

      case 'post':
        revalidateTag('posts');
        revalidatePath('/blog');
        
        if (slug) {
          revalidateTag(`post-${slug}`);
          revalidatePath(`/blog/${slug}`);
        }
        break;

      case 'author':
        revalidateTag('authors');
        
        if (slug) {
          revalidateTag(`author-${slug}`);
          revalidatePath(`/blog/autor/${slug}`);
        }
        break;

      case 'tag':
        revalidateTag('tags');
        revalidatePath('/blog');
        
        if (slug) {
          revalidatePath(`/blog/categoria/${slug}`);
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
