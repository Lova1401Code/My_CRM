// Note entity: free-text annotation attached to a customer or lead.
export function createNote({
  id,
  content,
  relatedType,
  relatedId,
  authorId = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    content,
    relatedType,
    relatedId,
    authorId,
    createdAt,
    updatedAt,
  });
}
