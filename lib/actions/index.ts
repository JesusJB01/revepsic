/**
 * Server Actions Index
 * 
 * Centralized exports for all server actions.
 */

// Newsletter
export { 
  subscribeToNewsletter,
  type NewsletterActionState 
} from "./newsletter";

// Posts
export { 
  createPost, 
  updatePost, 
  deletePost,
  type PostActionState 
} from "./posts";

// Authors
export { 
  createAuthor, 
  updateAuthor, 
  deleteAuthor,
  type AuthorActionState 
} from "./authors";

// Members
export { 
  createMember, 
  updateMember, 
  deleteMember,
  type MemberActionState 
} from "./members";
