# SYSTEM ARCHITECTURE
## Free Fire India Tournament Management Platform

**Document:** architecture.md  
**Status:** Draft — Awaiting Approval

---

# 1. Architecture Overview

The application will follow a modern full-stack architecture using Next.js.

The frontend and backend will exist within a single Next.js application rather than being developed as two independently deployed applications.

The application will follow modular architecture principles, keeping UI components, business logic, database operations, authentication and external integrations logically separated.

The architecture must be scalable, secure, maintainable and suitable for production deployment.

## 1.1 Architecture Principles

- Full-stack Next.js application.
- Modular and reusable components.
- Separation of business logic and presentation logic.
- Centralised database access.
- Secure server-side operations.
- Role-based authorisation.
- Reusable validation schemas.
- Transaction-safe financial and registration operations.
- Background processing through Trigger.dev.
- Environment-based configuration.
- Testable and maintainable code.

# 2. Technology Stack

The project will use the following technologies.

| Technology | Responsibility |
|---|---|
| Next.js App Router | Full-stack application framework |
| React 19 | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Clerk | Authentication |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and schema management |
| Trigger.dev | Background jobs and scheduled tasks |
| Zod | Input validation |
| React Hook Form | Form management |
| Git and GitHub | Version control |

Additional services:

- YouTube for livestream integration.
- FamPay QR code for manual payment collection.
- An approved file storage provider for uploaded images and payment screenshots.

Technology versions and package compatibility must be verified during project setup.

# 3. Application Architecture

The application will use Next.js App Router.

The application will have three primary interface areas:

## 3.1 Public Website

Responsible for displaying publicly available information.

Pages include:

- Homepage.
- Tournament listing.
- Tournament details.
- Upcoming tournaments.
- Live tournaments.
- Completed tournaments.
- Results.
- Leaderboards and tournament brackets.
- Livestream pages.
- Login and registration.

Public pages must not expose private player information, payment records or room credentials.

## 3.2 Player Dashboard

Responsible for player-specific operations.

Features include:

- Player profile.
- Team registration.
- My tournaments.
- Payment status.
- Registration history.
- Match schedules.
- Room information.
- Tournament results.

Players must only access information they are authorised to view.

## 3.3 Admin Dashboard

Responsible for complete tournament administration.

Features include:

- Dashboard overview.
- Tournament creation.
- Tournament configuration.
- Team management.
- Registration management.
- Payment verification.
- Match scheduling.
- Bracket management.
- Room information management.
- Result verification.
- Winner management.
- Prize distribution records.
- Financial reports.
- Platform configuration.

Administrative pages must be protected through server-side role verification.

# 4. Frontend Architecture

The frontend will use React 19 with Next.js App Router and TypeScript.

## 4.1 Component Structure

Components should be organised into reusable categories:

- Common components.
- Layout components.
- Navigation components.
- Form components.
- Tournament components.
- Team components.
- Match components.
- Payment components.
- Admin components.
- Dashboard components.

## 4.2 Rendering Strategy

Use appropriate Next.js rendering capabilities.

- Server Components for data-driven pages where interactivity is not required.
- Client Components for interactive elements and browser-side state.
- Server-side data fetching for protected and sensitive information.
- Dynamic rendering where user-specific or frequently changing information requires it.

Do not unnecessarily convert entire pages into Client Components.

## 4.3 Styling

Tailwind CSS will be used for styling.

The application must use reusable design tokens and consistent styling conventions.

The UI must be responsive across mobile, tablet and desktop devices.

# 5. Backend Architecture

The backend will be implemented within the Next.js application.

A separate Express.js server is not required for the initial architecture.

## 5.1 Backend Responsibilities

The backend will handle:

- Authentication verification.
- Role-based authorisation.
- Tournament management.
- Team registration.
- Payment verification.
- Tournament capacity validation.
- Bracket generation.
- Match management.
- Result verification.
- Prize distribution records.
- Financial calculations.
- External service integration.

## 5.2 API Architecture

Next.js Route Handlers will be used for backend API endpoints.

APIs should follow consistent conventions.

Example API structure:

### Authentication and Users

- GET /api/users/me
- PATCH /api/users/me

### Tournaments

- GET /api/tournaments
- GET /api/tournaments/[id]
- POST /api/tournaments
- PATCH /api/tournaments/[id]
- DELETE /api/tournaments/[id]

### Team Registrations

- POST /api/tournaments/[id]/registrations
- GET /api/tournaments/[id]/registrations
- GET /api/registrations/[id]

### Payments

- POST /api/payments/submit
- GET /api/payments/[id]
- PATCH /api/payments/[id]/verify

### Matches

- GET /api/tournaments/[id]/matches
- POST /api/matches
- PATCH /api/matches/[id]

### Results

- POST /api/matches/[id]/results
- PATCH /api/matches/[id]/results/verify

### Admin

- GET /api/admin/dashboard
- GET /api/admin/financial-summary

These are proposed API contracts. Exact request schemas, response formats and permissions must be defined during implementation.

## 5.3 Business Logic Separation

Business logic must not be placed directly inside UI components or unnecessarily duplicated across API handlers.

Create separate modules for:

- Tournament services.
- Registration services.
- Payment services.
- Match services.
- Bracket services.
- Result services.
- Financial services.
- Notification services.

Route Handlers should validate requests, authenticate users, invoke the appropriate services and return consistent responses.

# 6. Database Architecture

PostgreSQL will be used as the primary relational database.

Prisma ORM will manage database models, queries, relationships and migrations.

## 6.1 Proposed Database Entities

### User

Stores application-specific user information.

Important fields:

- id
- clerkUserId
- name
- email
- phone
- role
- createdAt
- updatedAt

Clerk will manage authentication credentials. Passwords must not be stored in PostgreSQL.

### Tournament

Stores tournament configuration.

Important fields:

- id
- name
- description
- game
- gameMode
- tournamentFormat
- teamCapacity
- entryFee
- currency
- registrationOpenAt
- registrationCloseAt
- tournamentDate
- startTime
- status
- rules
- livestreamUrl
- createdAt
- updatedAt

Tournament configuration must be independently stored for every tournament.

### GameMode

Stores supported game mode definitions.

Important fields:

- id
- name
- game
- playersPerTeam
- configuration
- isActive

Game modes must be extendable without rewriting the tournament registration system.

### Team

Stores registered team information.

Important fields:

- id
- name
- captainId
- createdAt
- updatedAt

### TeamMember

Stores player information belonging to a team.

Important fields:

- id
- teamId
- playerName
- freeFireUid
- position

The required team size must be determined by the selected game mode.

### Registration

Connects teams with tournaments.

Important fields:

- id
- tournamentId
- teamId
- registrationStatus
- paymentStatus
- registeredAt

A team must not have duplicate registrations in the same tournament.

### Payment

Stores payment submission and verification information.

Important fields:

- id
- registrationId
- amount
- transactionReference
- screenshotUrl
- status
- verifiedBy
- verifiedAt
- createdAt

Transaction references must be protected against duplicate submissions.

### PrizeDistribution

Stores tournament prize allocation.

Important fields:

- id
- tournamentId
- position
- prizeAmount
- recipientTeamId
- payoutStatus

### Match

Stores tournament match information.

Important fields:

- id
- tournamentId
- round
- matchNumber
- teamAId
- teamBId
- scheduledAt
- roomId
- roomPassword
- status
- winnerTeamId

Room information must not be publicly accessible.

### MatchResult

Stores verified match results.

Important fields:

- id
- matchId
- winnerTeamId
- resultData
- submittedBy
- verifiedBy
- verifiedAt

The result structure must support different game modes.

### Notification

Stores user notifications.

Important fields:

- id
- userId
- title
- message
- type
- readAt
- createdAt

## 6.2 Database Relationship Principles

The database must maintain proper relationships between:

- Users and teams.
- Teams and team members.
- Teams and tournament registrations.
- Tournaments and registrations.
- Tournaments and payments through registrations.
- Tournaments and matches.
- Matches and participating teams.
- Matches and results.
- Tournaments and prize distributions.
- Users and notifications.

Use appropriate foreign keys, unique constraints, indexes and database-level validation.

The final Prisma schema must be reviewed before implementation is considered complete.

# 7. Authentication Architecture — Clerk

Clerk will manage authentication.

## 7.1 Clerk Responsibilities

- User registration.
- Login.
- Logout.
- Session management.
- Authentication tokens.
- Identity verification.

## 7.2 Application Responsibilities

The application backend will manage:

- Player and administrator roles.
- Application user profiles.
- Tournament permissions.
- Administrative permissions.
- Team ownership and access.
- Resource-level authorisation.

## 7.3 Authentication Flow

1. User authenticates through Clerk.
2. Clerk creates an authenticated session.
3. Frontend sends authenticated requests.
4. Backend verifies the Clerk identity using trusted server-side integration.
5. Backend retrieves the corresponding application user.
6. Backend checks the user's role and resource permissions.
7. The requested operation is executed only when authorised.

Administrator permissions must never depend solely on frontend visibility or user-supplied role values.

# 8. Payment Architecture — FamPay QR

The initial application will use manual UPI payment verification through a FamPay QR code.

No payment gateway integration is required for the initial MVP.

## 8.1 QR Code Management

- Administrator can upload the payment QR code.
- Administrator can replace the QR code.
- QR code must be displayed on the relevant tournament payment page.
- The entry amount must come from the tournament configuration.
- The payment instructions must be clearly displayed.

## 8.2 Payment Workflow

1. Player registers a team.
2. Backend creates a pending registration.
3. Website displays the tournament entry fee.
4. Website displays the administrator's payment QR code.
5. Player makes the payment.
6. Player submits the transaction reference.
7. Player uploads payment proof.
8. Administrator checks the actual FamPay transaction.
9. Administrator approves or rejects the submission.
10. Registration is confirmed only after successful verification.

## 8.3 Payment Security

- Payment screenshots must be stored securely.
- Payment records must be accessible only to authorised users.
- Duplicate transaction references must be detected.
- Payment verification must be recorded in an audit trail.
- Players must not be able to approve their own payments.
- QR codes must never expose account login credentials or private banking information.

The application must not claim automatic payment verification because the initial workflow is manual.

# 9. Tournament Registration Architecture

The registration system must support independently configurable tournament settings.

## 9.1 Registration Validation

Before accepting a registration, the backend must verify:

- Tournament exists.
- Tournament is published and open.
- Registration deadline has not passed.
- Tournament has available capacity.
- Team size matches the selected game mode.
- Required player information is valid.
- Duplicate registrations are prevented.

## 9.2 Capacity Management

Tournament capacity must support configurable even team counts, with a minimum of two teams.

The system must prevent overbooking under simultaneous registration requests.

Capacity validation and registration creation must use database transactions or equivalent concurrency-safe mechanisms.

## 9.3 Registration States

- Pending payment.
- Payment verification pending.
- Confirmed.
- Rejected.
- Cancelled.
- Refunded.

Only confirmed teams should be included in the final tournament bracket.

# 10. Tournament Management Architecture

The tournament management module must support:

- Tournament creation.
- Tournament configuration.
- Game mode selection.
- Team capacity selection.
- Entry fee configuration.
- Prize distribution.
- Registration scheduling.
- Tournament scheduling.
- Tournament rules.
- Tournament publication.
- Tournament cancellation.

Tournament settings must remain independent.

The application must not hardcode the initial four-team tournament configuration.

## 10.1 Schedule Locking

Tournament date and starting time must become locked when registration opens.

The backend must enforce this restriction.

A cancelled tournament must preserve its historical records.

# 11. Bracket and Match Architecture

The initial tournament format will be knockout.

The bracket engine must be independent of the user interface.

Responsibilities:

- Accept confirmed participating teams.
- Generate valid tournament rounds.
- Support preliminary rounds and byes where necessary.
- Create match records.
- Track participating teams.
- Advance verified winners.
- Identify eliminated teams.
- Determine the final winner.

The bracket must be generated and reviewed by an authorised administrator before it is finalised.

Match results must be verified before tournament progression occurs.

Future tournament formats must be supported through separate format-specific logic rather than being mixed into the knockout implementation.

# 12. Trigger.dev Architecture

Trigger.dev will handle background tasks and scheduled workflows.

It will not replace the primary backend or database business logic.

## 12.1 Responsibilities

- Registration deadline processing.
- Tournament reminders.
- Match reminders.
- Scheduled notifications.
- Tournament cancellation notifications.
- Winner announcement notifications.
- Other scheduled administrative workflows.

## 12.2 Integration Principles

- Trigger.dev tasks must be invoked through trusted server-side operations.
- Tasks must use persistent database records as their source of truth.
- Tasks must be designed to handle retries safely.
- Duplicate task execution must not produce duplicate financial or tournament operations.
- Scheduled tasks must handle cancellation and rescheduling appropriately.

The database remains the authoritative source of tournament status.

# 13. File Storage Architecture

The platform will require file storage for:

- Tournament banners.
- Payment screenshots.
- Payment QR codes.
- Other permitted tournament assets.

Files must be stored through an approved object storage provider.

Do not store large binary files directly inside PostgreSQL.

## Storage Security

- Public tournament images may use public URLs.
- Payment screenshots must use private storage.
- Access to private files must require authorisation.
- Uploaded files must be validated for file type and size.
- File URLs must not expose private payment evidence publicly.

The exact storage provider will be finalised before implementation.

# 14. Livestream Architecture

YouTube will be used for tournament livestreaming.

The initial implementation will allow administrators to provide a YouTube livestream URL.

The public tournament page will display the livestream when available.

The application should support:

- Upcoming stream information.
- Live stream display.
- Completed tournament stream links.

YouTube API automation is not required for the initial MVP.

# 15. Financial Architecture

Financial calculations must be performed on the backend.

The system must calculate:

Total Collection = Sum of Verified Payments.

Total Prize Distribution = Sum of Configured Prize Amounts.

Estimated Gross Margin = Total Collection − Configured Prize Distribution.

Actual Net Profit = Total Collection − Actual Prize Payments − Applicable Expenses.

Financial records must be retained and protected.

The application must distinguish between expected prize amounts and prizes actually paid.

# 16. Security Architecture

Security must be implemented at every application layer.

Required measures:

- Clerk authentication verification.
- Server-side role-based authorisation.
- Input validation using Zod.
- Secure database access through Prisma.
- Environment-based secret management.
- Protected administrative APIs.
- Protected payment evidence.
- Rate limiting for sensitive endpoints.
- Secure error handling.
- Database backups.
- Audit logs for critical administrative operations.
- Protection against duplicate registrations and payment confirmations.
- Appropriate logging without exposing sensitive information.

No secret keys or database credentials may be committed to GitHub.

# 17. Error Handling and Logging

The application must use consistent error-handling conventions.

Requirements:

- Meaningful validation errors.
- Consistent API error responses.
- Server-side error logging.
- Appropriate user-facing messages.
- No exposure of internal stack traces in production.
- Logging of important tournament and payment operations.

Critical operations must have sufficient audit information for investigation.

# 18. Deployment Architecture

The application must be deployable as a production-ready web application.

Deployment must support:

- Secure environment variables.
- Production PostgreSQL database.
- Database migrations.
- Clerk production configuration.
- Trigger.dev production environment.
- Approved file storage.
- HTTPS.
- Logging and error monitoring.
- Backup and recovery procedures.

The production hosting provider must permit commercial application usage.

Hosting selection must consider cost, reliability, regional latency, deployment compatibility and usage limits.

Development, testing and production environments must be separated.

# 19. Testing Architecture

The application must include:

## Unit Testing

Test individual business logic modules.

Examples:

- Tournament configuration validation.
- Team capacity validation.
- Financial calculations.
- Bracket generation.
- Registration eligibility.

## Integration Testing

Test interactions between:

- APIs and database.
- Clerk and backend authorisation.
- Registrations and payments.
- Matches and tournament progression.
- Trigger.dev and scheduled workflows.

## End-to-End Testing

Test complete user workflows:

- Player registration.
- Team registration.
- Payment submission.
- Admin payment verification.
- Tournament bracket creation.
- Match completion.
- Winner announcement.

Security and concurrent registration tests must be included before production launch.

# 20. Architectural Restrictions

The AI coding agent must follow these architectural boundaries:

1. Do not introduce a separate Express backend without explicit approval.
2. Do not replace PostgreSQL with MongoDB.
3. Do not implement custom password authentication when Clerk is being used.
4. Do not introduce a payment gateway into the initial FamPay QR workflow.
5. Do not put business logic directly inside UI components.
6. Do not expose sensitive payment or room information through public APIs.
7. Do not bypass server-side authorisation.
8. Do not duplicate database business logic across multiple modules.
9. Do not hardcode tournament capacity, entry fees or prize distributions.
10. Do not introduce additional infrastructure or major dependencies without architectural approval.

---

**End of Architecture Document**

**Document Status:** Draft — Awaiting Approval