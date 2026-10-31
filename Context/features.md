# SKYFALL — Complete Feature Specification

**File:** `features.md`  
**Project:** SKYFALL  
**Document Type:** Functional Requirements and Feature Specification  
**Status:** Development Reference  
**Purpose:** Define the complete expected functionality and behaviour of the SKYFALL tournament platform.

---

# 1. Purpose of This Document

This document defines every major feature of the SKYFALL platform in detail.

It explains:
- What each feature does.
- Why the feature exists.
- Who can access it.
- How users interact with it.
- What happens after each action.
- What data is required.
- What validations must be performed.
- What happens when something goes wrong.
- What the expected result should be.

The AI development agent must use this document as the functional reference when implementing features.

A feature must not be considered complete merely because its interface exists. Its complete functionality, validation, permissions, error handling, and acceptance criteria must also be implemented and tested.

# 2. Platform Overview

SKYFALL is a Free Fire India tournament management platform.

It provides three major experiences:

1. Public Website — Visitors can discover tournaments, explore tournament information, register, and view results.
2. Player Dashboard — Players can manage their profiles, teams, registrations, payments, matches, and tournament participation.
3. Admin Dashboard — Administrators can manage tournaments, teams, registrations, payments, matches, results, and platform operations.

The platform must support configurable tournament settings rather than relying on fixed values.

Important principles:
- Tournament configurations must be independent.
- Game modes must be configurable.
- Team size must depend on the selected game mode.
- Tournament capacity must support any valid even number of teams, with a minimum of two.
- The initial tournament format is Knockout.
- Future tournament formats must remain possible without redesigning the entire system.
- Payment verification is manual for the initial version.
- The database is the source of truth for application data.

# 3. Public Website Features

## 3.1 Homepage

**Purpose:** Introduce SKYFALL and help visitors discover available tournaments.

### Required elements
- SKYFALL branding.
- Navigation bar.
- Hero section.
- Main heading and description.
- Primary call-to-action for exploring tournaments.
- Featured or upcoming tournaments.
- Tournament statistics, when reliable data is available.
- How it works section.
- Registration process explanation.
- Results or recent tournament highlights.
- YouTube livestream section when a valid livestream is available.
- Footer with relevant navigation and contact information.

### Behaviour
- Clicking the tournament call-to-action opens the tournament listing page.
- Featured tournament cards open their respective detail pages.
- Completed tournament cards can lead to results.
- Livestream playback must be initiated by the visitor.
- The YouTube player must not initialise unnecessarily before playback is requested.
- If there are no featured tournaments, display a meaningful empty state.
- Do not display fabricated statistics or tournament information.

### Acceptance criteria
- All navigation links work.
- Tournament information comes from actual database records.
- The page works on mobile, tablet, and desktop.
- Loading, error, and empty states are handled.

## 3.2 Tournament Listing Page

**Purpose:** Allow visitors to explore available tournaments.

### Tournament categories
- Upcoming.
- Registration Open.
- Registration Closed.
- Ongoing.
- Completed.
- Cancelled.

### Tournament card information
Each card should display the available relevant information:
- Tournament name.
- Tournament banner, if provided.
- Game and game mode.
- Tournament format.
- Entry fee.
- Prize pool.
- Team capacity.
- Registered teams.
- Registration status.
- Tournament date.
- Starting time.

### Search and filtering
Visitors should be able to:
- Search by tournament name.
- Filter by tournament status.
- Filter by game mode.
- Filter by tournament format.
- Sort tournaments by date or other supported criteria.

### Behaviour
- Only tournaments intended for public visibility should appear.
- Cancelled tournaments must be clearly labelled.
- Completed tournaments must not appear as open for registration.
- Search and filters should work together.
- Empty search results should show a helpful message.
- Pagination or an equivalent scalable loading strategy should be used when required.

## 3.3 Tournament Details Page

**Purpose:** Provide complete information about an individual tournament.

### Information displayed
- Tournament name.
- Description.
- Banner.
- Game.
- Game mode.
- Tournament format.
- Team size.
- Total team capacity.
- Available team slots.
- Entry fee.
- Prize pool.
- Prize distribution.
- Registration opening date and time.
- Registration closing date and time.
- Tournament date.
- Tournament starting time.
- Rules and instructions.
- Match schedule, when available.
- Current tournament status.
- Livestream link, when available.

### Registration button behaviour
The registration button must depend on tournament status.

- Before registration opens: display that registration has not started.
- During registration: allow eligible users to register.
- After registration closes: prevent new registrations.
- When capacity is full: prevent additional registrations.
- When tournament is cancelled: disable registration and display cancellation information.
- When completed: show results instead of a registration action.

### Additional behaviour
- Display accurate team capacity and registration counts.
- Do not allow registration using outdated tournament data.
- Recheck eligibility on the server when registration is submitted.
- Display tournament cancellation or schedule information clearly.

## 3.4 Tournament Registration

**Purpose:** Allow eligible players or teams to enter a tournament.

### Registration workflow
1. User opens tournament details.
2. User selects the registration action.
3. System checks whether the user is authenticated and eligible.
4. User selects or creates a team according to the supported team workflow.
5. System checks team eligibility.
6. System checks whether the team has the required number of members.
7. System checks whether the team is already registered.
8. System checks tournament availability and capacity.
9. User confirms registration.
10. System creates the registration record.
11. User is directed to the payment process when an entry fee applies.
12. Registration status is displayed in the player dashboard.

### Validation rules
- Tournament must exist and be available.
- Registration period must be open.
- Tournament must not be cancelled or completed.
- Team must have the required number of eligible members.
- Team must not already be registered for the same tournament.
- Capacity must not be exceeded.
- Only authorised users can register the team.
- Server-side validation is mandatory.

### Important behaviour
Registration and payment are separate states.

A registration must not automatically become payment-approved simply because a player submits a screenshot.

The system must distinguish between:
- Registration initiated.
- Awaiting payment.
- Payment submitted.
- Payment under review.
- Payment approved.
- Payment rejected.
- Registration confirmed.
- Registration cancelled.

The final registration state must follow the actual payment and registration rules.

## 3.5 Registration Status Page

**Purpose:** Let players understand the current state of their tournament registration.

### Information
- Tournament name.
- Team name.
- Registration date.
- Registration reference.
- Payment status.
- Registration status.
- Rejection reason, if applicable.
- Relevant next action.

### Behaviour
- Display the latest status from the database.
- If payment is awaiting verification, explain that admin review is pending.
- If rejected, display the reason and any permitted next action.
- If approved, display confirmation.
- Do not allow users to manually change their registration status.

# 4. Player Dashboard Features

## 4.1 Player Dashboard Overview

**Purpose:** Give players a central place to manage their tournament activity.

### Dashboard information
- Welcome section.
- Player profile summary.
- Total tournaments joined.
- Upcoming matches.
- Active registrations.
- Pending payments.
- Recent results.
- Notifications.
- Important announcements.

### Behaviour
- Display information belonging only to the authenticated player.
- Use actual database information.
- Dashboard statistics must be calculated from reliable records.
- Provide navigation to the relevant detailed sections.
- Show useful empty states for new users.

## 4.2 Player Profile Management

Players should be able to view and manage their permitted profile information.

### Profile information
- Display name.
- Profile image, if supported.
- Email or verified identity information supplied by the authentication system.
- Player-specific game information, if required by the project.

### Actions
- View profile.
- Edit permitted profile fields.
- Upload or update profile image, if enabled.
- Save profile changes.

### Validations
- Validate required fields.
- Validate supported image formats and file sizes.
- Prevent unauthorised changes to roles and administrative permissions.
- Never expose private account information to other players.

## 4.3 Team Management

**Purpose:** Allow players to organise teams for tournament participation.

### Team features
- Create a team.
- View team details.
- Edit permitted team information.
- View team members.
- Invite or add members through the supported membership workflow.
- Remove members when permitted.
- View team participation history.
- View team registrations.

### Team information
- Team name.
- Team identifier.
- Team captain.
- Team members.
- Creation date.
- Relevant tournament participation.

### Team rules
- The team captain must have the appropriate permissions to manage the team.
- Team size must follow the selected tournament's game mode.
- Do not hardcode a universal team size.
- Prevent duplicate membership where the business rules prohibit it.
- Do not permit unauthorised users to modify team membership.
- Protect team membership once tournament registration rules require it to be locked.

### Important distinction
Team creation and tournament registration are different operations. Creating a team must not automatically register it in a tournament.

## 4.4 Player Tournament Management

Players should be able to view all relevant tournaments associated with their teams.

### Information
- Tournament name.
- Team name.
- Registration status.
- Payment status.
- Tournament date.
- Current tournament stage.
- Upcoming match information.
- Results, when available.

### Filters
- Upcoming.
- Ongoing.
- Completed.
- Cancelled.

## 4.5 Player Payment History

**Purpose:** Provide transparency into payments submitted by the player or team.

### Information
- Tournament.
- Team.
- Entry fee.
- Transaction reference.
- Submission date.
- Payment verification status.
- Admin rejection reason, if applicable.

### Behaviour
- Display only payments the player is authorised to view.
- Allow access to their submitted payment information.
- Do not expose another team's payment screenshots or private information.
- Do not allow players to modify an approved payment record.

## 4.6 Player Match Schedule

Players should be able to view their team's upcoming and previous matches.

### Match information
- Match identifier.
- Tournament.
- Round.
- Opponent, when determined.
- Scheduled date and time.
- Match status.
- Relevant instructions.
- Result, once published.

### Behaviour
- Display only matches relevant to the player or their team.
- Show pending opponent information when a bracket position has not yet been determined.
- Update information when an administrator changes a permitted match schedule.
- Clearly distinguish scheduled, ongoing, completed, postponed, and cancelled matches.

## 4.7 Player Results

Players should be able to view:
- Team results.
- Match outcomes.
- Tournament progression.
- Final position.
- Published prize information, when applicable.

Results must be based on published and authorised tournament records.

## 4.8 Notifications

Players should receive relevant in-platform notifications.

### Possible notifications
- Registration created.
- Payment submitted.
- Payment approved.
- Payment rejected.
- Tournament registration confirmed.
- Match scheduled.
- Match rescheduled.
- Match result published.
- Tournament cancelled.
- Important tournament announcement.

### Behaviour
- Notifications must belong to the correct recipient.
- Users should be able to mark notifications as read.
- Unread notification count should be accurate.
- Notifications should link to the relevant page when possible.
- Duplicate notifications should be avoided.

# 5. Admin Dashboard Features

## 5.1 Admin Dashboard Overview

**Purpose:** Provide an overview of tournament operations.

### Dashboard information
- Total tournaments.
- Upcoming tournaments.
- Ongoing tournaments.
- Completed tournaments.
- Total registered teams.
- Pending payment verifications.
- Approved payments.
- Rejected payments.
- Total collected entry fees.
- Prize obligations.
- Recent administrative activity.

### Important rules
- Financial statistics must be calculated from actual payment records.
- Pending or rejected payments must not be counted as collected revenue.
- Gross collection, prize obligations, refunds, and organiser margin must be shown separately.
- Never present an unverified payment as confirmed revenue.

## 5.2 Tournament Creation

**Purpose:** Allow administrators to create independently configurable tournaments.

### Required configuration

**Basic information**
- Tournament name.
- Description.
- Game.
- Game mode.
- Tournament format.
- Optional tournament banner.

**Team and capacity configuration**
- Required team size.
- Minimum team capacity.
- Maximum team capacity.
- Total team slots.

The capacity must support any valid even number of teams, with a minimum of two. It must not be restricted to powers of two.

**Financial configuration**
- Entry fee.
- Prize pool or prize distribution.
- Prize allocation by position.
- Other explicitly configured financial details.

**Registration configuration**
- Registration opening date and time.
- Registration closing date and time.

**Tournament scheduling**
- Tournament date.
- Tournament starting time.
- Individual match schedules, where configured.

**Additional information**
- Tournament rules.
- Instructions.
- Optional YouTube livestream URL.

### Validation rules
- Required fields cannot be empty.
- Closing time must be after opening time.
- Tournament schedule must be valid.
- Capacity must be an even integer of at least two.
- Team size must be valid for the selected game mode.
- Financial values must be valid non-negative amounts.
- Prize distribution must not violate configured financial constraints.
- YouTube URL must be validated before being stored.
- Uploaded banners must satisfy file restrictions.

### Behaviour
- Admin can review the configuration before publishing.
- A tournament should not become publicly available until it reaches the appropriate publication state.
- Invalid configurations must not be saved as valid tournaments.
- Each tournament must maintain its own configuration.

## 5.3 Tournament Editing

Administrators can edit permitted tournament information.

### Editable information
- Description.
- Banner.
- Rules.
- Livestream URL.
- Other permitted details.

### Schedule lock
Once registration opens, the tournament date and starting time must be locked.

If an essential change to these locked schedule fields is required:
1. The administrator must cancel the existing tournament.
2. The system must process the applicable cancellation workflow.
3. Existing registrations and payments must be accounted for.
4. Refund obligations must be tracked.
5. A new tournament must be created with the corrected schedule.

The system must not silently alter locked tournament dates or times.

## 5.4 Tournament Cancellation

**Purpose:** Allow administrators to cancel a tournament through a controlled process.

### Workflow
1. Admin selects cancellation.
2. System asks for confirmation.
3. Admin provides a cancellation reason.
4. System updates tournament status.
5. New registrations are disabled.
6. Existing teams and players are informed.
7. Payment and refund obligations are identified.
8. Cancellation activity is recorded.

### Important rules
- Cancellation must not delete historical records.
- Existing payment records must be preserved.
- Refunds must be tracked separately.
- Financial reports must reflect cancellations and refunds correctly.

## 5.5 Registration Management

Administrators should be able to:
- View all registrations.
- Search by tournament or team.
- Filter by registration status.
- View registration details.
- Inspect team eligibility.
- View associated payment status.
- Approve or reject permitted registration actions.
- Handle cancellation according to platform rules.

All status changes must be authorised and recorded.

## 5.6 Payment Verification

**Purpose:** Allow administrators to manually verify payments made using the configured FamPay QR code.

### Payment QR management
- Upload payment QR code.
- Preview the uploaded QR code.
- Replace the existing QR code.
- Validate image format and size.
- Display the currently active QR code to players.

### Player payment submission
Players should be able to:
1. Open the relevant payment section.
2. View the payment amount.
3. Scan the QR code using their UPI application.
4. Complete payment outside SKYFALL.
5. Enter their transaction reference.
6. Upload payment screenshot.
7. Submit payment information.

### Admin verification
Administrators should be able to:
- View pending payment submissions.
- Open the relevant registration and team details.
- View transaction reference.
- Inspect the submitted screenshot.
- Compare the submitted information with the actual FamPay transaction history.
- Approve the payment.
- Reject the payment with a reason.

### Payment statuses
- Awaiting Submission.
- Submitted.
- Under Review.
- Approved.
- Rejected.
- Refund Pending.
- Refunded.

Use an appropriate state-transition model. Invalid transitions must be rejected.

### Duplicate transaction detection
- Transaction references must be checked for duplicates.
- A reference already associated with another payment must be flagged.
- Duplicate references must not silently create multiple approved payments.
- Administrators must be able to investigate flagged submissions.

### Security
- Payment screenshots must be stored privately.
- Only authorised users should access payment proof.
- Payment proof must not be publicly accessible.
- Do not collect FamPay passwords, UPI PINs, bank credentials, or other payment authentication secrets.
- Payment approval must be an explicit administrative action.
- Preserve an audit trail of every verification decision.

### Important limitation
The MVP does not use an automated payment gateway or automatic FamPay transaction verification. The administrator manually checks the actual transaction history.

A screenshot or transaction reference alone is not proof of successful payment.

## 5.7 Team Administration

Administrators should be able to:
- View teams.
- Search teams.
- View team members.
- View team captains.
- View tournament participation.
- Inspect registration eligibility.
- Handle permitted team-related issues.

Administrative actions must be logged.

## 5.8 Match Management

**Purpose:** Allow administrators to manage tournament matches.

### Features
- Generate tournament matches.
- View tournament rounds.
- View bracket.
- Assign teams to matches.
- Schedule matches.
- Edit permitted match details.
- Update match status.
- View match history.

### Match information
- Match ID.
- Tournament ID.
- Round.
- Match number.
- Participating teams.
- Scheduled date.
- Scheduled time.
- Match status.
- Winner.
- Result information.

### Match statuses
- Pending.
- Scheduled.
- Ongoing.
- Completed.
- Postponed.
- Cancelled.

### Knockout rules
- The initial supported tournament format is Knockout.
- Capacity may be any valid even number of teams.
- Bracket generation must support non-power-of-two capacities.
- Preliminary rounds or byes must be handled where required.
- Teams must progress based on actual match outcomes.
- A team must not be assigned to incompatible simultaneous matches.
- Match progression must not be based on fabricated or missing results.

### Important rule
The system must not assume every tournament has four teams or that every tournament has a power-of-two capacity.

## 5.9 Match Result Management

Administrators should be able to:
- Open a match.
- Enter the match result.
- Select the winning team.
- Enter relevant scores or result information.
- Review the result.
- Publish the result.
- Correct a result through an authorised correction process.

### Validation
- Match must belong to the selected tournament.
- Participating teams must be valid.
- Winner must be one of the participating teams, unless the match rules explicitly support another outcome.
- Match must be in an appropriate state.
- A completed match must not be overwritten without an authorised correction.
- Winner progression must be updated consistently.

## 5.10 Prize Distribution Management

Administrators must be able to view configured prize distribution and track its fulfilment.

### Information
- Tournament.
- Total entry fee collection.
- Configured prize pool.
- Position-wise prize allocation.
- Winning team.
- Prize payment status.
- Payment date.
- Relevant administrative notes.

### Financial rules
- Configured prize amounts must be consistent with the tournament's financial configuration.
- The system must distinguish prize allocation from actual prize payout.
- An allocated prize must not automatically be considered paid.
- Prize payout records must be maintained.
- Financial history must be auditable.

## 5.11 Financial Management

Administrators should be able to view:
- Approved collections.
- Pending payments.
- Rejected payments.
- Refund obligations.
- Completed refunds.
- Configured prize obligations.
- Recorded prize payouts.
- Organiser margin.

### Example test configuration

For a four-team test tournament:

- Four teams.
- Entry fee: ₹40 per team.
- Total collection: ₹160.
- Winner's prize: ₹120.
- Gross organiser margin: ₹40.

This is an example for testing, not a permanent tournament configuration.

The platform must calculate financial values from each tournament's actual configuration and verified payment records.

## 5.12 Admin Notifications and Announcements

Administrators should be able to:
- Send relevant announcements.
- Notify registered players or teams.
- Send tournament-specific updates.
- Communicate cancellation or scheduling changes.

The system must ensure that announcements reach only the intended audience.

## 5.13 Admin Activity and Audit Logs

Important administrative actions must be recorded.

Examples:
- Tournament created.
- Tournament updated.
- Tournament cancelled.
- Registration approved or rejected.
- Payment approved or rejected.
- Match scheduled.
- Match rescheduled.
- Result published.
- Prize payout recorded.
- Refund recorded.
- QR code replaced.

Each log should include the actor, action, affected record, timestamp, and relevant details.

# 6. Tournament Engine

The tournament engine is a core part of SKYFALL.

It must be configurable and independent of fixed tournament assumptions.

## 6.1 Game Mode Configuration

- Admin selects a game.
- Admin selects a supported game mode.
- Each game mode has its own team-size requirements.
- The tournament uses the selected mode's configuration.
- The system must validate team size before registration.

Do not permanently hardcode Clash Squad or four-player teams.

## 6.2 Team Capacity

- Minimum capacity: two teams.
- Capacity must be even.
- Any valid even capacity must be supported.
- Examples: 2, 4, 6, 8, 10, 12, 16, and so on.

## 6.3 Knockout Tournament Generation

The system should:
1. Retrieve eligible registered teams.
2. Confirm their registration and payment status.
3. Verify the tournament capacity.
4. Generate the required bracket structure.
5. Handle preliminary rounds or byes.
6. Assign teams to matches.
7. Save match relationships.
8. Display the bracket.
9. Advance winners when valid results are published.

### Important requirements
- Do not create duplicate matches.
- Do not lose team assignments.
- Do not advance a team without a valid result or explicitly defined bye rule.
- Preserve tournament history.
- Ensure bracket generation is repeat-safe or protected against accidental repeated execution.

## 6.4 Future Tournament Formats

The architecture should allow future support for:
- League.
- Round Robin.
- Other formats approved for development.

These are future capabilities, not mandatory MVP implementations.

# 7. Livestream Features

## 7.1 YouTube Livestream

Administrators can configure an optional YouTube livestream URL.

### Behaviour
- Display the livestream when a valid URL is available.
- Validate the URL.
- Allow visitors and authorised players to open or play the livestream.
- Initialise the embedded player only when playback is requested.
- Handle unavailable or invalid videos gracefully.
- Do not automatically play audio or video.

# 8. Authentication and Authorisation

## 8.1 Authentication

Clerk is responsible for authentication and identity management.

The platform should support the authentication flows configured for the project.

## 8.2 Application Roles

The application must maintain its own role and permission information.

Possible roles:
- Player.
- Admin.

### Authorisation rules
- Public visitors can access public information.
- Players can access their own permitted data.
- Players cannot access administrative operations.
- Admins can access authorised management operations.
- Role checks must be performed on the server.
- Hiding a button in the frontend is not sufficient security.

## 8.3 Account Ownership

Every private record must be associated with the correct owner or authorised entity.

Examples:
- Player profile.
- Team membership.
- Registration.
- Payment submission.
- Notification.

The system must prevent users from accessing or modifying another user's private records without permission.

**Open requirement:** The final decision on whether every player requires an account or only the team captain requires an account must be confirmed before implementing the final registration workflow.

# 9. Search, Filtering, and Sorting

Where relevant, the platform should support:

- Tournament search.
- Tournament status filtering.
- Game mode filtering.
- Team search.
- Registration filtering.
- Payment status filtering.
- Match filtering.
- Date-based filtering.

### Behaviour
- Filters should be compatible with one another.
- Search should handle empty queries.
- Sorting should be deterministic.
- Search results must respect user permissions.
- Large datasets should be handled efficiently.

# 10. File Upload and Storage

The platform may require uploads for:
- Tournament banners.
- Player profile images.
- Payment screenshots.
- Payment QR codes.

### Requirements
- Validate file type.
- Validate file size.
- Reject unsupported files.
- Use secure storage.
- Keep payment screenshots private.
- Permit public access only to files intended for public display.
- Avoid exposing internal storage credentials or private file locations.
- Handle failed uploads gracefully.

The storage provider remains a decision to be finalised.

# 11. System-Wide Behaviour

## 11.1 Loading States

Every data-dependent page or operation should provide an appropriate loading state.

Examples:
- Tournament listing loading.
- Dashboard loading.
- Payment submission processing.
- Admin verification processing.
- Match generation processing.

## 11.2 Empty States

Display meaningful messages when:
- No tournaments exist.
- No registrations exist.
- No teams exist.
- No matches are available.
- No payments are pending.
- No notifications exist.
- No results are published.

Where appropriate, provide an action to help users proceed.

## 11.3 Error Handling

The platform must handle:
- Network failures.
- Validation failures.
- Authentication failures.
- Authorisation failures.
- Missing records.
- Duplicate submissions.
- Invalid status transitions.
- File upload failures.
- Database errors.
- Background job failures.

Errors should be understandable to users without exposing internal technical information.

## 11.4 Data Consistency

Operations that affect multiple related records must maintain consistent data.

Examples:
- Registration and capacity allocation.
- Payment approval and registration confirmation.
- Match result and winner progression.
- Tournament cancellation and refund tracking.
- Prize payout and financial reporting.

Use database transactions and suitable constraints where necessary.

## 11.5 Duplicate Action Protection

The platform should protect against accidental repeated actions.

Examples:
- Double-clicking registration.
- Submitting the same payment twice.
- Generating the same bracket twice.
- Publishing the same result repeatedly.
- Repeating a refund action.

Use appropriate database constraints, idempotency, and server-side checks.

## 11.6 Date and Time

- Store timestamps consistently.
- Display dates and times in the appropriate local timezone.
- Validate registration windows.
- Validate tournament scheduling.
- Prevent invalid schedule modifications.
- Ensure scheduled background operations use the correct timezone assumptions.

# 12. Security and Privacy Requirements

Security is mandatory across all features.

The system must:
- Validate all user inputs on the server.
- Enforce role-based authorisation.
- Protect private player data.
- Protect payment screenshots.
- Prevent unauthorised administrative actions.
- Secure file uploads.
- Avoid exposing secrets.
- Protect against common web vulnerabilities.
- Use safe database queries through the approved ORM.
- Maintain appropriate audit records.
- Avoid trusting client-submitted prices, permissions, payment statuses, or tournament capacity.

The browser must never be treated as the authority for sensitive business decisions.

# 13. Background Jobs and Automation

Trigger.dev is the approved background job platform.

Potential jobs include:
- Registration deadline processing.
- Tournament reminders.
- Match reminders.
- Notification delivery.
- Scheduled tournament status updates.
- Other explicitly approved scheduled operations.

### Requirements
- Jobs must be idempotent.
- Jobs must be retry-safe.
- Failed jobs must be observable.
- The database remains the source of truth.
- Important state transitions must be validated.
- A background job must not silently create inconsistent records.

Do not introduce unnecessary background jobs for operations that can safely and simply happen in a normal request.

# 14. MVP Scope and Future Features

## 14.1 Initial MVP

The initial implementation should focus on:

- Public website.
- Tournament discovery.
- Tournament details.
- Player and admin experiences.
- Tournament creation and configuration.
- Team management.
- Tournament registration.
- Manual QR-based payments.
- Admin payment verification.
- Knockout tournament generation.
- Match scheduling.
- Match result publishing.
- Basic prize and financial tracking.
- Notifications.
- Authentication and authorisation.

## 14.2 Future Scope

Potential future capabilities include:
- League and Round Robin formats.
- Additional tournament formats.
- Automated payment gateway integration.
- Advanced analytics.
- More extensive notification channels.
- Additional games and game modes.
- Advanced live tournament updates.

Future features must not be implemented without being included in the approved development scope.

# 15. Feature Completion Requirements

A feature is complete only when all applicable conditions are satisfied:

1. The feature matches the requirements in this document.
2. Its user interface is implemented.
3. Its actual business logic works.
4. Server-side validation is implemented.
5. Authentication and authorisation are enforced.
6. Relevant database operations work correctly.
7. Loading, empty, success, and error states are handled.
8. Relevant edge cases are considered.
9. Tests have been performed.
10. Existing functionality has not been broken.
11. The progress tracker has been updated.
12. Any remaining limitation or known issue has been documented.

A static interface, mock response, placeholder button, or fabricated database result does not count as a completed feature.

# 16. Instructions for the AI Development Agent

The AI agent must:

- Read this document before implementing any feature.
- Read the other approved project context files as well.
- Follow the approved architecture and code standards.
- Implement one task at a time.
- Never silently remove or simplify a specified feature.
- Never invent business rules where requirements are unclear.
- Ask for clarification when an important decision is missing.
- Avoid implementing future-scope features during MVP development.
- Never introduce unapproved technologies or integrations.
- Test every implemented feature.
- Update `progress-tracker.md` after completing the task.
- Wait for approval before moving to the next task.

If an implementation detail is not specified, the AI must distinguish between:
1. An existing requirement.
2. A technical implementation decision.
3. A business decision requiring user approval.

The AI must not treat assumptions as approved requirements.

---

# 17. Pending Decisions

The following decisions must remain open until explicitly finalised:

1. Whether all players need accounts or only team captains.
2. Final file storage provider.
3. PostgreSQL hosting provider.
4. Production hosting provider.
5. Whether real-time updates are required for the MVP.
6. Final notification delivery channels.
7. Detailed refund execution and approval workflow.
8. Final supported game modes and their team-size configurations.
9. Final visual design choices, as defined in `ui-context.md`.

Do not silently decide these matters on behalf of the project owner.

---

**End of Feature Specification**