# UI Context — SKYFALL Tournament Platform

**Project:** SKYFALL  
**Status:** Approved design direction — detailed screen specifications  
**Purpose:** Define the complete user interface, screen layouts, navigation, interactions, responsive behaviour and performance requirements of the SKYFALL tournament platform.

---

# 1. Design Vision

SKYFALL is an esports tournament organisation platform focused on organising competitive gaming tournaments.

The interface must communicate:

- Professional esports identity.
- Competitive gaming atmosphere.
- Trust and reliability.
- Simplicity and ease of use.
- Fast and smooth interactions.
- Clear tournament information.

The platform should look premium without becoming visually overloaded.

**Official organiser branding: SKYFALL**

Use exactly `SKYFALL` wherever the organiser's branding is displayed.

Do not assume SKYFALL is necessarily the website's domain or technical application name.

## 1.1 Core Design Principles

1. Mobile-first development.
2. Performance before decorative effects.
3. Simple and intuitive navigation.
4. Consistent design across all screens.
5. Reusable UI components.
6. Clear visual hierarchy.
7. Accessible forms and controls.
8. Minimal unnecessary animations.
9. Consistent SKYFALL branding.
10. Professional esports-inspired appearance.

# 2. Application Interface Structure

The application must have three distinct interface areas.

| Interface | Target users | Main purpose |
|---|---|---|
| Public Website | Visitors and players | Discover and explore tournaments |
| Player Dashboard | Players and team captains | Register and manage tournament participation |
| Admin Dashboard | Authorised administrators | Operate and manage tournaments |

**Important:** The player and admin dashboards must have separate layouts, navigation systems and interface experiences.

They must not simply share one dashboard with different menu items.

## 2.1 Route and Layout Structure

Use the following as the initial UI routing guideline:

```text
Public Website
├── Home
├── Tournaments
│   └── Tournament Details
├── Results
├── Leaderboards
├── About
└── Contact

Player Dashboard
├── Dashboard
├── My Teams
├── My Tournaments
├── Payments
├── Matches
├── Results
├── Notifications
└── Profile

Admin Dashboard
├── Overview
├── Tournaments
│   ├── All Tournaments
│   ├── Create Tournament
│   └── Tournament Details
├── Registrations
├── Teams
├── Payments
├── Matches
├── Results
├── Financial Management
├── Notifications
└── Settings
```

Routes must follow the approved Next.js App Router architecture.

# 3. Public Website

The public website is the first experience visitors have with SKYFALL.

It must communicate credibility, display tournament opportunities and make registration easy.

## 3.1 Public Navigation

### Desktop

Use a clean top navigation bar containing:

- SKYFALL branding.
- Home.
- Tournaments.
- Results.
- Leaderboards.
- About.
- Login / Dashboard access.

### Mobile

Use a compact navigation system:

- SKYFALL branding.
- A simple menu or appropriate mobile navigation.
- A prominent tournament discovery or registration action.
- Easy access to authentication.

Avoid overcrowding the mobile header.

## 3.2 Homepage

**Purpose:** Introduce SKYFALL and help visitors discover tournaments quickly.

### Required sections

**A. Hero section**

Display:

- SKYFALL branding.
- A clear headline introducing tournaments.
- A short description.
- Primary CTA: Explore Tournaments.
- Secondary CTA: View Results.
- One optimised gaming visual, if useful.

Do not use a large autoplay background video.

**B. Featured Tournament**

Display:

- Tournament name.
- Game mode.
- Tournament date.
- Entry fee.
- Prize pool.
- Available slots.
- Registration status.
- View Details button.

**C. Upcoming Tournaments**

Display tournament cards with essential information.

**D. How It Works**

Explain the basic participation process:

1. Choose a tournament.
2. Register your team.
3. Complete payment.
4. Get registration confirmation.
5. Participate in matches.

**E. Results and Winners**

Display recent tournament results and winning teams.

**F. Livestream**

Show relevant YouTube livestream information.

Use a thumbnail first and load the actual video player only when requested.

**G. Footer**

Include:

- SKYFALL branding.
- Navigation links.
- Contact information.
- Applicable policies and rules.
- Social links when configured.

## 3.3 Tournament Listing Page

**Purpose:** Let players discover and compare tournaments.

### Page layout

- Page heading.
- Short introduction.
- Tournament status filters.
- Tournament cards.
- Empty state when no tournaments are available.

### Filters

Support appropriate filters such as:

- Upcoming.
- Registration Open.
- Registration Closed.
- Ongoing.
- Completed.

Additional filters such as game mode may be introduced where useful.

### Tournament Card

Each card should display:

- Tournament banner or lightweight visual.
- Tournament name.
- Game mode.
- Team size.
- Entry fee.
- Prize pool.
- Tournament date.
- Available slots.
- Registration status.
- View Details CTA.

Do not overcrowd cards with unnecessary information.

## 3.4 Tournament Details Page

**Purpose:** Provide everything a player needs before registering.

### Required information

**Tournament Overview**
- Tournament name.
- Description.
- Banner, if available.
- Game and selected game mode.
- Tournament format.
- Team size.
- Maximum team capacity.

**Financial Information**
- Entry fee.
- Prize pool.
- Configured prize distribution.

**Schedule**
- Registration opening time.
- Registration closing deadline.
- Tournament date.
- Tournament start time.
- Match schedule, when available.

**Rules**
- Tournament-specific rules.
- Player eligibility.
- Team requirements.
- Match instructions.
- Disqualification conditions.

**Registration Information**
- Registration status.
- Available slots.
- Registration CTA.

**Livestream**
- YouTube livestream URL when configured.

### Important behaviour

- Hide or disable registration when registration is closed.
- Clearly indicate when the tournament is full.
- Prevent registration after the deadline.
- Do not display private room credentials publicly.
- Reflect the actual tournament status from the database.

## 3.5 Team Registration Page

**Purpose:** Allow a captain to register a team.

### Form sections

**Tournament Information**
- Selected tournament.
- Game mode.
- Required team size.
- Entry fee.

**Team Information**
- Team name.
- Captain information.

**Player Information**

Provide player input fields according to the selected game mode's team-size requirement.

Each player entry must support:

- Player name.
- Free Fire UID.

The interface must not assume every game mode uses four players.

### Form behaviour

- Validate required fields.
- Validate team size.
- Show understandable error messages.
- Prevent duplicate player UIDs within the tournament.
- Prevent duplicate team registration.
- Display the payment amount before submission.
- Show a clear confirmation before continuing.

## 3.6 Payment Submission Page

**Purpose:** Collect payment information through the approved manual FamPay QR workflow.

### Layout

**Payment Summary**
- Tournament name.
- Team name.
- Entry fee.
- Payment status.

**QR Payment Section**
- Display the current admin-uploaded FamPay QR code.
- Provide clear scanning instructions.
- Display the exact payment amount.
- Provide a mobile-friendly payment experience.

**Payment Submission Form**
- Transaction reference.
- Payment screenshot upload.
- Submission button.

### Behaviour

- Validate required fields.
- Accept only permitted image formats and sizes.
- Display screenshot preview before submission.
- Show payment submission confirmation.
- Display pending verification status.
- Never treat screenshot submission as automatic payment approval.

Payment proof must remain private and accessible only to authorised users.

## 3.7 Registration Status Page

Display:

- Tournament details.
- Team details.
- Payment status.
- Registration status.
- Submission date.
- Admin decision when available.

Possible statuses:

- Awaiting Payment.
- Payment Submitted.
- Under Verification.
- Payment Approved.
- Payment Rejected.
- Registration Confirmed.
- Registration Cancelled.

Provide clear next steps for each status.

## 3.8 Results Page

Display completed tournaments.

Each tournament result should include:

- Tournament name.
- Game mode.
- Completion date.
- Winning team.
- Runner-up where applicable.
- Other configured prize positions.
- Final standings.

## 3.9 Leaderboard Page

Display tournament rankings.

Include:

- Team name.
- Rank.
- Wins.
- Losses or other relevant statistics, where supported.
- Points or score where applicable.

Do not invent statistics that are not stored or calculated by the application.

## 3.10 About and Contact Pages

**About**
- SKYFALL introduction.
- Tournament organisation information.
- Platform purpose.

**Contact**
- Configured contact information.
- Support instructions.
- Appropriate contact links.

Do not invent contact details.

# 4. Player Dashboard

The player dashboard must have its own layout and navigation.

Its main purpose is to help players manage their teams, registrations, payments and tournament participation.

## 4.1 Player Dashboard Layout

### Desktop

Use:

- Sidebar navigation.
- Top header.
- Main content area.
- Profile and notification access.

### Mobile

Use:

- Compact top header.
- Mobile-friendly navigation, preferably a bottom navigation bar for the main destinations.
- Scrollable content.
- Cards instead of wide tables wherever practical.

Keep the navigation focused on the most frequently used actions.

## 4.2 Player Dashboard Overview

**Purpose:** Provide a quick summary of the player's tournament activity.

### Information cards

- Active registrations.
- Upcoming matches.
- Pending payments.
- Completed tournaments.

### Main sections

**Upcoming Matches**
- Match date and time.
- Tournament name.
- Opponent when available.
- Match status.

**My Recent Activity**
- Registration updates.
- Payment verification updates.
- Match result announcements.

**Quick Actions**
- Explore Tournaments.
- Manage Team.
- View Registrations.

Do not show statistics that have no reliable source.

## 4.3 My Teams Page

Display teams associated with the player.

Each team card should contain:

- Team name.
- Captain.
- Player list.
- Player UIDs.
- Relevant tournament associations.

Provide team management actions only where the user's permissions allow them.

Team size must follow the selected tournament's game mode.

## 4.4 My Tournaments Page

Display the player's tournament participation.

Organise tournaments by status:

- Upcoming.
- Registration Pending.
- Confirmed.
- Ongoing.
- Completed.
- Cancelled.

Each tournament entry should provide access to its details and current status.

## 4.5 Payments Page

Display payment history.

Each payment record should contain:

- Tournament.
- Team.
- Amount.
- Transaction reference, appropriately protected.
- Submission date.
- Verification status.
- Admin decision where available.

Do not expose private payment proof to other players.

## 4.6 Matches Page

Display:

- Tournament.
- Match number.
- Opponent or competing teams.
- Match date.
- Match time.
- Match status.
- Relevant match instructions.

Room IDs and passwords must only be shown to authorised participants at the appropriate time.

## 4.7 Results Page

Display:

- Participated tournaments.
- Match results.
- Wins and losses where recorded.
- Tournament placement.
- Prize information where applicable.

## 4.8 Notifications Page

Display relevant notifications:

- Registration updates.
- Payment approval or rejection.
- Match schedule announcements.
- Match reminders.
- Tournament cancellation.
- Result announcements.
- Prize-related updates.

Include read/unread status.

## 4.9 Profile Page

Display and manage permitted profile information.

Potential fields:

- Player name.
- Email.
- Free Fire UID.
- Account information.
- Associated teams.

Authentication is managed through Clerk.

Application-specific profile information is managed through the application's database.

Do not create a separate password management system.

# 5. Admin Dashboard

The admin dashboard is the operational control centre of SKYFALL.

It must have a completely separate layout and navigation from the player dashboard.

It should prioritise efficiency, visibility and accurate management of tournaments.

## 5.1 Admin Dashboard Layout

### Desktop

Use:

- Left sidebar with management navigation.
- Top header with admin profile and notifications.
- Main content area.
- Dashboard statistics.
- Tables and management panels.

### Mobile

Use:

- Compact header.
- Collapsible navigation or mobile menu.
- Responsive cards instead of oversized tables.
- Touch-friendly management controls.
- Clear confirmation dialogs for important actions.

The admin must be able to verify payments and manage essential tournament operations from a smartphone.

## 5.2 Admin Overview Page

**Purpose:** Give the administrator an overview of platform activity.

### Statistics

Display:

- Total tournaments.
- Active tournaments.
- Upcoming tournaments.
- Completed tournaments.
- Total registered teams.
- Pending payment verifications.
- Total verified collections.
- Total prize commitments.

### Management sections

**Pending Payments**
- Recent submissions awaiting verification.
- Direct access to review payments.

**Upcoming Tournaments**
- Tournament name.
- Registration status.
- Start date.
- Registered teams.

**Recent Activity**
- New registrations.
- Payment approvals.
- Payment rejections.
- Tournament changes.
- Match result updates.

Financial statistics must distinguish collected payments from pending payments, prize commitments and organiser margin.

## 5.3 Tournament Management Page

Display all tournaments created by SKYFALL.

### Tournament table or mobile cards

Show:

- Tournament name.
- Game mode.
- Team capacity.
- Registered teams.
- Entry fee.
- Tournament date.
- Registration status.
- Tournament status.

### Available actions

- View.
- Edit where permitted.
- Publish.
- Close registration.
- Cancel tournament.
- Manage matches.
- View results.

Actions must depend on tournament status and permissions.

## 5.4 Create Tournament Page

**Purpose:** Allow admins to create fully configurable tournaments.

Organise the form into sections.

### A. Basic Information

- Tournament name.
- Description.
- Game selection.
- Optional banner.
- Optional livestream URL.

### B. Game Configuration

- Game mode.
- Team size according to selected mode.
- Tournament format.
- Maximum team capacity.

The interface must support different game modes and configurable team sizes.

Do not hardcode Clash Squad or four players per team.

### C. Registration Configuration

- Entry fee.
- Maximum teams.
- Registration opening date and time.
- Registration closing deadline.

### D. Prize Configuration

Allow the administrator to configure:

- Total prize pool.
- Winner's prize.
- Runner-up prize.
- Additional prize positions.

The distribution must support different tournament configurations.

Validate that configured prize allocations do not exceed the available prize pool unless an explicitly approved business rule permits it.

### E. Tournament Schedule

- Tournament date.
- Start time.
- Individual match scheduling when applicable.

### F. Rules and Instructions

- Tournament rules.
- Participation requirements.
- Match instructions.
- Disqualification conditions.

### G. Review and Publish

Before publishing, show a complete tournament preview.

The administrator must be able to review all important settings before making the tournament public.

### Important restrictions

- Registration opening must follow the approved tournament workflow.
- Once registration opens, the tournament date and start time must be locked.
- If a major schedule change becomes necessary after registration opens, follow the approved cancellation and replacement process.
- Do not silently modify locked tournament information.

## 5.5 Tournament Details Management Page

Display complete administrative information for a selected tournament.

Sections:

- Overview.
- Configuration.
- Registrations.
- Payments.
- Teams.
- Matches.
- Results.
- Financial summary.

Use clear tabs or sub-navigation.

## 5.6 Registration Management Page

Display registered teams.

### Information

- Team name.
- Captain.
- Player names.
- Player UIDs.
- Registration time.
- Payment status.
- Registration status.

### Actions

- View team.
- View payment status.
- Approve or reject registration where permitted.
- Remove or disqualify a team according to approved rules.

Do not expose private payment screenshots in publicly accessible views.

## 5.7 Payment Verification Page

This is one of the most important admin screens.

### Payment queue

Display payments awaiting verification.

Each record should include:

- Tournament.
- Team name.
- Captain.
- Amount.
- Transaction reference.
- Submission time.
- Payment screenshot preview.
- Verification status.

### Review interface

Allow the administrator to:

1. Open the submitted payment proof.
2. Review the transaction reference.
3. Compare the submission with actual FamPay transaction history.
4. Approve the payment.
5. Reject the payment with a reason.

### Security and consistency

- Only authorised admins can access payment proofs.
- Flag duplicate transaction references.
- Record who approved or rejected each payment.
- Record the decision time.
- Never approve a payment automatically based only on a screenshot.
- Avoid processing the same payment decision twice.

## 5.8 Team Management Page

Display teams and their tournament associations.

Allow authorised administrators to:

- View team information.
- View players and UIDs.
- Check registration status.
- Review associated payment status.
- Handle disqualification or removal where permitted.

## 5.9 Match Management Page

**Purpose:** Manage the tournament's matches.

For knockout tournaments:

- Display bracket.
- Display participating teams.
- Show rounds.
- Show match status.
- Schedule matches.
- Assign teams to matches.
- Enter match results.
- Advance winners.

For non-power-of-two capacities, support preliminary rounds or byes as required.

The interface must not assume that every tournament has exactly four or eight teams.

Future tournament formats can be introduced without forcing the initial MVP to implement them.

## 5.10 Match Details Page

Display:

- Tournament.
- Round.
- Match number.
- Participating teams.
- Scheduled date and time.
- Match status.
- Room information when configured.
- Result entry controls.

Keep private room credentials accessible only to authorised participants and admins.

## 5.11 Results Management Page

Allow admins to:

- Enter match scores.
- Record match winners.
- Verify results.
- Update tournament standings.
- Declare final positions.
- Publish results.

Require appropriate confirmation before publishing final results.

## 5.12 Financial Management Page

Display a clear financial overview.

### Financial figures

- Total registrations.
- Verified collections.
- Pending payments.
- Refunds.
- Prize commitments.
- Gross organiser margin.
- Actual expenses where recorded.
- Net profit where sufficient financial data exists.

Never label gross margin as net profit.

Financial values must be calculated using verified server-side data.

## 5.13 Notifications Management Page

Allow admins to manage announcements and relevant notifications.

Examples:

- Registration confirmation.
- Payment approved.
- Payment rejected.
- Match scheduled.
- Match reminder.
- Tournament cancelled.
- Results published.
- Winner announcement.

The interface should show notification status and delivery results where supported.

## 5.14 Settings Page

Organise administrative settings into sections:

**Payment Settings**
- Upload or replace FamPay QR code.
- Display current QR code.
- Validate uploaded image.
- Manage QR availability.

**Platform Settings**
- Configurable platform information.
- Public contact details.
- Other approved platform settings.

**Admin Account**
- Account information.
- Authentication and account management through Clerk.

Do not expose payment credentials or request banking passwords or UPI PINs.

# 6. Navigation and Layout Rules

## 6.1 Public Navigation

Keep public navigation simple and focused on discovering tournaments.

## 6.2 Player Navigation

Player navigation must prioritise:

- Dashboard.
- My Teams.
- My Tournaments.
- Matches.
- Profile.

Other destinations can be accessed through secondary navigation.

## 6.3 Admin Navigation

Admin navigation must prioritise:

- Overview.
- Tournaments.
- Registrations.
- Payments.
- Matches.
- Results.
- Financial Management.
- Settings.

Player and admin navigation must remain separate.

## 6.4 Role-Based Navigation

- Public visitors can access public pages.
- Authenticated players can access authorised player functionality.
- Only authorised admins can access admin functionality.
- Hiding a navigation link is not sufficient security.
- Backend authorization must protect all sensitive operations.

# 7. Shared UI Component Library

Create reusable components for:

### Layout
- PublicHeader.
- PublicFooter.
- PlayerLayout.
- AdminLayout.
- PlayerNavigation.
- AdminSidebar.
- MobileNavigation.

### Tournament
- TournamentCard.
- TournamentStatusBadge.
- TournamentDetails.
- PrizeDistribution.
- RegistrationStatus.
- TournamentFilters.

### Team
- TeamCard.
- TeamMemberList.
- PlayerUIDField.
- TeamRegistrationForm.

### Payments
- PaymentQRCode.
- PaymentSubmissionForm.
- PaymentStatusBadge.
- PaymentReviewCard.
- PaymentProofPreview.

### Matches
- MatchCard.
- MatchSchedule.
- KnockoutBracket.
- MatchResultForm.
- LeaderboardTable.

### General
- Button.
- Input.
- Select.
- Modal.
- ConfirmationDialog.
- Toast.
- LoadingIndicator.
- EmptyState.
- ErrorState.
- DataTable.

Reuse components instead of rebuilding similar interfaces independently.

# 8. Responsive Design Requirements

Mobile is the highest priority.

Priority order:

1. Smartphones.
2. Tablets.
3. Laptops.
4. Desktop screens.

Requirements:

- No unnecessary horizontal overflow.
- Touch-friendly buttons and controls.
- Appropriate text sizes.
- Responsive cards.
- Mobile-friendly forms.
- Responsive tables.
- Mobile-compatible knockout brackets.
- Easy navigation.
- Admin actions accessible on mobile.

Desktop layouts should use additional screen space effectively without compromising the mobile experience.

# 9. Performance and Asset Optimisation

**Performance is a non-negotiable design requirement.**

The website must load as quickly as possible.

Do not sacrifice loading speed for decorative images, videos or animations.

## 9.1 Images

- Use Next.js Image optimisation where appropriate.
- Prefer WebP and AVIF when supported.
- Compress images.
- Serve responsive image sizes.
- Avoid unnecessarily large background images.
- Lazy-load below-the-fold images.
- Prioritise only essential above-the-fold images.
- Reserve image dimensions to prevent layout shifts.
- Avoid unnecessary decorative image collections.

## 9.2 Videos

- Never autoplay large background videos.
- Do not initialise YouTube players on initial page load unnecessarily.
- Use lightweight thumbnails.
- Load the actual player only when the user requests playback.
- Defer videos below the viewport.
- Never make video essential for navigating the platform.

## 9.3 Application Performance

- Prefer Server Components by default.
- Use Client Components only where necessary.
- Avoid unnecessary JavaScript.
- Avoid unnecessary third-party scripts.
- Optimise database queries.
- Use appropriate caching.
- Avoid unnecessary rerenders.
- Keep animations lightweight.
- Prevent layout shifts.

## 9.4 Performance Targets

Use Core Web Vitals as measurable goals:

| Metric | Target |
|---|---:|
| LCP | 2.5 seconds or less |
| INP | 200 milliseconds or less |
| CLS | 0.1 or less |

Evaluate at the 75th percentile when sufficient real-user data is available.

Also test on mobile devices and slower network conditions.

Never claim the platform is fast without measurement.

# 10. UI States and Feedback

Every important screen must account for:

- Loading.
- Empty.
- Success.
- Error.
- Disabled.
- Pending.
- Unavailable.
- Permission denied.

Provide understandable feedback after important actions.

Examples:

- Registration submitted.
- Payment proof uploaded.
- Payment approved.
- Payment rejected.
- Tournament full.
- Registration closed.
- Match scheduled.
- Results published.

Never leave users with unexplained blank screens.

# 11. Accessibility

- Use semantic HTML.
- Maintain sufficient colour contrast.
- Use readable font sizes.
- Provide accessible form labels.
- Support keyboard navigation.
- Provide meaningful alternative text.
- Ensure touch targets are appropriately sized.
- Respect reduced-motion preferences.

# 12. Design Consistency

The AI must:

1. Follow the approved SKYFALL visual identity.
2. Maintain separate public, player and admin layouts.
3. Follow mobile-first development.
4. Reuse existing UI components.
5. Maintain consistent typography and spacing.
6. Avoid inconsistent designs between pages.
7. Use images and videos carefully.
8. Prioritise performance over decoration.
9. Avoid unnecessary animations.
10. Never change the approved design direction without permission.

The final colour palette, typography and detailed visual styling must be established consistently during UI implementation. Do not independently invent a permanent brand identity.

# 13. UI Testing Requirements

Before completing a UI task:

- Test smartphone layouts.
- Test tablet and desktop layouts.
- Test navigation.
- Test forms and validation.
- Test loading, empty and error states.
- Test image loading.
- Verify that videos load only when requested.
- Check horizontal overflow.
- Check layout shifts.
- Test important player journeys.
- Test important admin workflows.
- Measure performance on important pages.

# 14. Important User Journeys

## 14.1 Player Registration Journey

1. Open public website.
2. Browse tournaments.
3. Open tournament details.
4. Review game mode, team size, fee and prizes.
5. Submit team information.
6. Display payment QR.
7. Complete payment externally.
8. Submit transaction reference and screenshot.
9. Wait for manual verification.
10. Receive payment and registration status.
11. Access tournament information when confirmed.

## 14.2 Admin Tournament Creation Journey

1. Open admin dashboard.
2. Select Create Tournament.
3. Enter tournament information.
4. Select game mode.
5. Configure team size and capacity.
6. Configure entry fee.
7. Configure prize distribution.
8. Set registration dates and tournament schedule.
9. Add rules and optional media.
10. Review tournament preview.
11. Publish tournament.
12. Manage registrations and payments.

## 14.3 Admin Match Management Journey

1. Open a tournament.
2. Close registration when appropriate.
3. Review confirmed teams.
4. Generate or configure knockout bracket.
5. Schedule matches.
6. Share authorised match information.
7. Record match results.
8. Advance winners.
9. Publish final standings.

## 14.4 Payment Verification Journey

1. Admin opens pending payment queue.
2. Selects a payment submission.
3. Reviews screenshot and transaction reference.
4. Checks actual FamPay transaction history.
5. Approves or rejects the submission.
6. Records the decision and reason.
7. Player receives the updated status.

# 15. Implementation Rules for AI

Before implementing any screen:

1. Read this document.
2. Read the approved architecture and coding standards.
3. Identify the exact screen being implemented.
4. Understand its user and purpose.
5. Identify its required data.
6. Identify its navigation and interactions.
7. Plan the mobile layout first.
8. Plan the desktop adaptation.
9. Identify required reusable components.
10. Consider performance before introducing visual assets.
11. Implement only the current approved task.
12. Test the screen and its interactions.
13. Update the progress tracker.

Do not implement the entire UI in one task.

Build it incrementally according to the approved development plan.

# 16. Final Non-Negotiable Principles

1. Mobile-first experience.
2. Separate public, player and admin interfaces.
3. Detailed and understandable screen layouts.
4. Fast initial page loading.
5. Optimised images and videos.
6. No unnecessary heavy visual assets.
7. Simple and intuitive navigation.
8. Secure payment and admin interfaces.
9. Consistent SKYFALL branding.
10. Responsive player and admin dashboards.
11. Accessible interactions.
12. Measurable performance.
13. One UI implementation task at a time.

**Final Principle:** SKYFALL must deliver a professional esports experience with complete and functional public, player and admin interfaces. Every important action must be easy to perform on a smartphone, and visual quality must never come at the cost of loading speed, usability or reliability.