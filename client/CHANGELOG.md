## [1.2.0] 2026-06-11

### Added
- Slug-first public property URLs via `utils/propertyHref.js`
- Inline admin editing on public property pages and homepage blocks
- Homepage editor in admin settings
- Client-side similar properties on detail page
- `hasFetched` pattern for contact, invoices, opportunity Redux slices

### Fixed
- Payments API access for `user` role; Stripe configuration guard (503)
- Infinite `api/opportunity/` fetch loops and 429 rate-limit storms
- RBAC roles loading on all admin pages (not only dashboard)
- Redux selectors on Lead/Contact/Property view pages (`.data.data` → `.data`)
- Context menu positioning on 17+ admin list pages
- Empty CRM lists no longer show false "Failed to fetch data" toasts
- Quote view invoices section permissions
- Catalog filter count, map empty state, PropertyDetailPage i18n/area display
- Guest session 401 noise; CSP for OpenStreetMap; role-access API path

## [1.3.0] 2023-05-06

🐛 Bugs solved:

- Sidebar content design bug solved


## [1.2.1] 2022-11-01

🚀 Feature:
-Added TimelineRow

## [1.2.0] 2022-08-23

🚀 HyperTheme Editor

- With the help of the guys from Hyperting, we added HyperTheme Editor. You can check the docs [here](https://www.hyperthe.me/documentation/getting-started/community)!
## [1.1.0] 2022-06-08

🐛 Bugs solved:

- Calendar card - Card border bug on dark mode
- Development Table - Missing content bug
- Solved the warnings regarding stylis-plugin-rtl
- Fixed console warnings

## [1.0.1] 2022-04-25

### Multiple design bugs on mobile solved

- Default - "Daily traffic" card - text align problem on mobile - solved.
- Navbar - Icons - align problem with all icons on mobile - solved.
- Profile - "Your storage" card - "More" icon align problem on mobile - solved.
- Profile - "Complete your profile" card - text align problem on mobile - solved.

## [1.0.0] 2022-04-18

### Original Release

- Added Chakra UI as base framework
