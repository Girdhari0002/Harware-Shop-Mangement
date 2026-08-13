export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff"
};

/**
 * Returns true when the current user's role is allowed to see the item.
 * If allowedRoles is falsy/undefined, the item is visible to everyone.
 */
export const hasRole = (userRole, allowedRoles) => {
  if (!allowedRoles) return true; // no restriction
  if (!userRole) return false; // anonymous or missing role
  return allowedRoles.includes(userRole);
};

/**
 * Returns a copy of nav sections filtered so each link is only included
 * when hasRole(userRole, link.roles) is true. Sections with no links
 * after filtering are removed.
 */
export const filterNavSections = (sections = [], userRole) => {
  return sections
    .map((section) => ({
      ...section,
      links: (section.links || []).filter((link) => hasRole(userRole, link.roles))
    }))
    .filter((section) => (section.links || []).length > 0);
};
