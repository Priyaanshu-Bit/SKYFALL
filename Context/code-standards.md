# Code Standards — Free Fire Tournament Platform

**Status:** Approved  
**Purpose:** Establish consistent coding practices across the entire project.

---

## 1. Core Coding Principles

Every implementation must follow these principles:

1. **Readability:** Write code that another developer can easily understand.
2. **Maintainability:** Keep code modular and easy to modify.
3. **Reusability:** Avoid unnecessary duplication.
4. **Scalability:** Design components and services so new features can be added without rewriting existing functionality.
5. **Type Safety:** Use TypeScript properly and avoid unsafe type assumptions.
6. **Security:** Treat all user input and frontend data as untrusted.
7. **Consistency:** Follow the same patterns throughout the project.
8. **Simplicity:** Prefer straightforward solutions over unnecessary complexity.

Do not sacrifice code quality just to complete a task quickly.

## 2. Technology Standards

Use only the agreed technology stack unless the project owner explicitly approves a change.

| Technology | Responsibility |
|---|---|
| Next.js App Router | Application framework and routing |
| React 19 | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Clerk | Authentication and identity |
| PostgreSQL | Database |
| Prisma ORM | Database access and migrations |
| Trigger.dev | Background jobs and scheduled tasks |
| Zod | Data validation |
| React Hook Form | Form management |
| Git and GitHub | Version control |

Additional integrations:
- FamPay QR: Manual UPI payment collection and verification.
- YouTube: Tournament livestream links.
- File storage: Provider to be selected and approved separately.

Do not introduce Express, MongoDB, Mongoose, another authentication provider, or an unapproved payment gateway.

## 3. TypeScript Standards

- Use TypeScript for all application code.
- Avoid `any`. Use proper types, interfaces, generics or `unknown` where appropriate.
- Do not use TypeScript type assertions to hide errors without a valid reason.
- Define reusable types for shared data structures.
- Use explicit return types for important business functions where they improve clarity.
- Handle `null` and `undefined` safely.
- Use enums or appropriate union types for fixed sets of values.
- Keep types close to the modules that own them, unless they are shared across the application.

Example:

```ts
type TournamentStatus =
  | "DRAFT"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";
```

Never use arbitrary strings when a fixed set of valid values is known.

## 4. Naming Conventions

Follow consistent naming conventions.

| Element | Convention | Example |
|---|---|---|
| React components | PascalCase | `TournamentCard.tsx` |
| Variables | camelCase | `teamName` |
| Functions | camelCase | `createTournament()` |
| Constants | UPPER_SNAKE_CASE for true global constants | `MAX_RETRY_COUNT` |
| Types and interfaces | PascalCase | `TournamentDetails` |
| Database models | PascalCase | `Tournament` |
| Database fields | camelCase | `registrationDeadline` |
| Custom hooks | `use` + camelCase | `useTournament()` |
| Utility files | kebab-case | `format-currency.ts` |
| API route folders | lowercase | `app/api/tournaments/route.ts` |

Names must describe their actual responsibility. Avoid unclear names such as `data`, `temp`, `handle`, or `process` when a more meaningful name is possible.

## 5. Project Structure Standards

Maintain a modular and feature-oriented structure.

Use the following as the initial structural guideline. Adjust it only when the architecture requires a justified change.

```text
src/
├── app/
│   ├── (public)/
│   ├── (player)/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── tournaments/
│   ├── teams/
│   ├── registrations/
│   ├── payments/
│   ├── matches/
│   ├── results/
│   └── notifications/
│
├── services/
│
├── lib/
│
├── schemas/
│
├── hooks/
│
├── types/
│
└── config/

prisma/
├── schema.prisma
└── migrations/

trigger/
```

Responsibilities:

- `app/`: Pages, layouts and Next.js route handlers.
- `components/`: Reusable UI components.
- `features/`: Feature-specific components and supporting logic.
- `services/`: Business logic and application operations.
- `lib/`: Shared utilities and infrastructure integrations.
- `schemas/`: Zod validation schemas.
- `hooks/`: Reusable React hooks.
- `types/`: Shared TypeScript definitions.
- `config/`: Application configuration.
- `prisma/`: Database schema and migrations.
- `trigger/`: Background job definitions.

Do not put the entire application inside a single component or file.

## 6. React and Next.js Standards

### React Components

- Keep components focused on one responsibility.
- Prefer small, reusable components.
- Avoid unnecessarily large components.
- Separate complex business logic from presentation.
- Avoid duplicating UI code.
- Use meaningful props with proper TypeScript types.

### Server and Client Components

- Prefer Server Components by default.
- Use Client Components only when browser-side interactivity or React client-side features are required.
- Add `"use client"` only where necessary.
- Never expose server-only code or secrets to client components.

### Data Fetching

- Prefer server-side data fetching when appropriate.
- Avoid unnecessary API requests from the browser.
- Handle loading, empty and error states.
- Do not fetch the same information repeatedly without a reason.

### Next.js Routing

- Follow the App Router conventions.
- Keep route handlers focused on HTTP request and response handling.
- Put complex business operations in service modules.
- Use appropriate HTTP methods and status codes.

## 7. Backend and Service-Layer Standards

Use Next.js Route Handlers instead of introducing a separate Express server.

Every backend operation should follow a clear responsibility structure:

1. Receive the request.
2. Authenticate the user where required.
3. Validate the incoming data.
4. Check authorization and resource ownership.
5. Execute the relevant service operation.
6. Return a consistent response.
7. Handle errors appropriately.

Rules:

- Do not put complex business logic directly in route handlers.
- Do not trust data sent by the frontend.
- Never rely on hidden buttons or frontend restrictions for security.
- Keep database operations inside appropriate services or data-access modules.
- Use transactions when multiple database operations must succeed or fail together.
- Avoid exposing internal database errors to users.

## 8. Database and Prisma Standards

Use PostgreSQL with Prisma ORM.

Rules:

- Maintain the database structure through `schema.prisma`.
- Use Prisma migrations for schema changes.
- Never manually modify production database structure without an approved migration.
- Define appropriate relationships and constraints.
- Add indexes where queries or uniqueness requirements justify them.
- Use transactions for operations that must remain consistent.
- Avoid unnecessary database queries.
- Retrieve only the fields required by the operation.
- Never expose sensitive database fields in API responses.

### Tournament-Specific Rules

- Team capacity must be configurable for each tournament.
- Team size must be determined by the selected game mode.
- Do not hardcode four players per team throughout the application.
- Registration must not exceed tournament capacity.
- Prevent duplicate team registration in the same tournament.
- Prevent duplicate player UID registration within the same tournament.
- Use database constraints and transactions to prevent race conditions.
- Once registration opens, tournament date and start time must remain locked according to the approved business rules.
- Do not assume tournament capacity must be a power of two.

## 9. Validation Standards

Use Zod for validation and React Hook Form for form management.

Rules:

- Validate all important input on the backend.
- Frontend validation improves user experience but is not a security boundary.
- Reuse validation schemas where appropriate.
- Validate IDs, dates, amounts, UIDs, URLs and required fields.
- Reject invalid or unexpected input.
- Provide understandable validation messages.
- Never accept arbitrary values for fixed status fields.

Examples of data requiring validation:

- Tournament creation and updates.
- Team registration.
- Player information and Free Fire UIDs.
- Payment transaction references.
- Payment proof uploads.
- Match schedules and results.
- Prize distribution settings.

## 10. Authentication and Authorization Standards

Use Clerk for authentication.

Rules:

- Use Clerk to identify authenticated users.
- Associate Clerk identities with application user records.
- Store application-specific roles and permissions in the application database.
- Verify authentication on protected backend operations.
- Check authorization on the server before executing sensitive actions.
- Never trust a role or permission supplied by the frontend.
- Protect admin operations from player access.
- Check resource ownership before allowing users to access or modify their data.

The application must distinguish between at least:

- Player
- Admin

Additional roles must be approved before implementation.

## 11. Error Handling Standards

- Handle expected errors explicitly.
- Use meaningful error messages.
- Never silently ignore failed operations.
- Do not expose database credentials, stack traces or internal implementation details to users.
- Log unexpected server-side errors.
- Return appropriate HTTP status codes.
- Handle loading, empty, success and failure states in the UI.
- Avoid displaying misleading success messages when an operation has failed.

## 12. Security Standards

Security must be considered in every feature.

### Environment Variables

- Store secrets in environment variables.
- Never commit `.env` files.
- Maintain `.env.example` with variable names and safe placeholder values.
- Never expose server-only environment variables to the browser.
- Never hardcode credentials or API secrets.

### Payment Security

- Never request or store a user's UPI PIN.
- Never request FamPay login credentials.
- Keep payment proof images private.
- Restrict payment proof access to authorized users.
- Verify payments through actual FamPay transaction history.
- Do not treat an uploaded screenshot as proof of successful payment by itself.
- Flag duplicate transaction references.
- Maintain an audit trail of payment approval and rejection.

### General Security

- Validate uploaded files and their permitted types and sizes.
- Protect admin APIs.
- Prevent unauthorized data modification.
- Avoid exposing private player information.
- Apply rate limiting to sensitive endpoints where appropriate.
- Never store sensitive credentials in application logs.

## 13. UI and Styling Standards

Use Tailwind CSS for styling.

Rules:

- Build reusable UI components.
- Maintain consistent spacing, typography, colours and layouts.
- Follow responsive design principles.
- Support desktop and mobile screens.
- Provide visible feedback for user actions.
- Include loading, empty, error and success states.
- Maintain accessible labels and keyboard navigation.
- Avoid unnecessary inline styles.
- Do not introduce another styling framework without approval.

The detailed visual direction and design system will be defined in `ui-context.md`.

## 14. Background Job Standards

Use Trigger.dev for approved background jobs and scheduled automation.

Examples:

- Registration deadline reminders.
- Match reminders.
- Payment follow-ups.
- Tournament notifications.
- Cancellation notifications.
- Winner announcements.

Rules:

- Keep background jobs separate from UI components.
- Make jobs idempotent wherever possible.
- Handle retries safely.
- Avoid sending duplicate notifications.
- Validate job inputs.
- Record relevant job failures.
- Keep PostgreSQL as the source of truth for application data.
- Do not use background jobs as a replacement for essential database constraints.

## 15. File and Media Handling Standards

- Use the approved file storage provider once selected.
- Do not store large uploaded files directly in PostgreSQL.
- Store file references and metadata in the database where appropriate.
- Validate file type and size.
- Keep sensitive payment proof files private.
- Tournament banners may be public.
- Never expose private file URLs without appropriate authorization.

## 16. Financial Calculation Standards

All financial calculations must be reliable and consistent.

- Store monetary values in integer minor units (for INR, paise) where practical.
- Avoid floating-point arithmetic for money.
- Keep entry fees and prize distributions configurable per tournament.
- Distinguish total collections, prize commitments, refunds, expenses and organiser margin.
- Do not label gross margin as net profit.
- Recalculate important financial totals on the server.
- Never trust financial totals supplied by the frontend.

## 17. Testing Standards

Test important functionality before considering a task complete.

Priority test cases include:

- Authentication and role permissions.
- Tournament creation and configuration.
- Different game modes and team sizes.
- Tournament capacity validation.
- Registration deadline enforcement.
- Duplicate team and player UID prevention.
- Payment verification and rejection.
- Duplicate transaction reference detection.
- Match scheduling and result updates.
- Prize distribution calculations.
- Tournament cancellation and refunds.
- Background job retries and duplicate prevention.

Test both successful and unsuccessful scenarios.

## 18. Dependency Management

- Use existing project dependencies whenever possible.
- Do not install packages without a clear requirement.
- Avoid multiple packages that perform the same task.
- Check compatibility with the existing technology stack.
- Explain the purpose of any proposed new dependency before adding it.
- Never replace an agreed technology without project owner approval.

## 19. Git and Version Control Standards

- Use meaningful commit messages.
- Keep commits focused on related changes.
- Do not commit secrets, generated files or unnecessary dependencies.
- Do not overwrite existing work without understanding its purpose.
- Review changes before committing.
- Keep the main branch stable.
- Use feature branches when appropriate.

## 20. AI Implementation Restrictions

The AI developer must follow these rules:

1. Read the relevant context files before writing code.
2. Inspect the existing project structure before modifying anything.
3. Follow the approved architecture.
4. Complete one task at a time.
5. Do not implement unrelated features while working on a task.
6. Do not create unnecessary files.
7. Do not rewrite working code without a valid reason.
8. Do not change the technology stack without approval.
9. Do not leave unfinished or placeholder implementations while marking a task complete.
10. Run relevant checks and tests before declaring a task complete.
11. Explain important implementation decisions.
12. Ask the project owner when a requirement is unclear or a significant architectural decision is needed.

## 21. Definition of Done

A task is complete only when:

- The implementation follows the approved architecture.
- Code follows the standards in this document.
- TypeScript errors are resolved.
- Relevant validation is implemented.
- Security and authorization have been considered.
- Relevant tests have passed.
- Existing functionality has not been unintentionally broken.
- No unnecessary dependencies or unrelated changes were introduced.
- The progress tracker has been updated.

**Final Rule:** Code must be written as part of one consistent, maintainable production application—not as disconnected examples or temporary demonstrations.