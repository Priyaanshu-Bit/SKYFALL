# PROJECT CONTEXT
## Free Fire India Tournament Management Platform

**Document:** project-context.md  
**Status:** Draft — Awaiting Approval

---

# 1. Project Overview

We are building a customizable web-based Tournament Management Platform initially focused on organising Free Fire India tournaments.

The platform will allow administrators to create and manage different types of tournaments, including Clash Squad, Battle Royale and other supported game modes.

Players will be able to explore tournaments, register their teams, pay entry fees, access match information and view tournament results.

The platform will provide a centralised administration system for managing tournaments, teams, payments, schedules, matches, results and prize distributions.

The system must be flexible enough to support small tournaments initially and larger tournaments as the business grows.

# 2. Project Vision

Our vision is to transform gaming activities into an organised and sustainable revenue-generating business.

The platform will connect:

- Players who want to participate in competitive gaming tournaments.
- Organisers who create and manage tournaments.
- Audiences who watch gaming livestreams.
- Sponsors and gaming communities.

The long-term goal is to establish a reliable gaming tournament platform that can organise multiple tournaments and generate revenue through entry fees, sponsorships and other permitted monetisation opportunities.

# 3. Primary Objectives

1. Provide a platform for organising Free Fire India tournaments.
2. Support multiple game modes.
3. Allow administrators to customise every tournament.
4. Provide a reliable team registration system.
5. Support configurable entry fees and prize distributions.
6. Manage payments and payment verification.
7. Generate and manage tournament brackets.
8. Schedule tournaments and individual matches.
9. Record and publish match results.
10. Integrate YouTube livestreams.
11. Calculate tournament collections, prize allocations and gross margins.
12. Support gradual business expansion.

# 4. Target Users

## 4.1 Players

Players should be able to:

- Browse upcoming tournaments.
- View tournament details and rules.
- Register their teams.
- Submit team and player information.
- Pay tournament entry fees.
- Check registration and payment status.
- View tournament schedules.
- Access room IDs and passwords when authorised.
- Track tournament progress.
- View match results and winners.

## 4.2 Tournament Administrators

Administrators should be able to:

- Create, edit and manage tournaments.
- Select the game mode.
- Configure team capacity.
- Set entry fees.
- Configure prize distribution.
- Set tournament dates and starting times.
- Configure registration deadlines.
- Define tournament rules.
- Manage team registrations.
- Verify payments.
- Generate and manage tournament brackets.
- Schedule individual matches.
- Distribute room information.
- Record and verify match results.
- Declare winners.
- Manage prize distribution.
- View financial summaries.

## 4.3 Livestream Audience

Viewers should be able to:

- Access tournament livestreams.
- View tournament details.
- Follow tournament progress.
- View match results.
- See declared winners.

# 5. Tournament Customisation System

Tournament configuration is one of the most important features of this platform.

Every tournament must be independently configurable by the administrator.

## 5.1 Game Mode Selection

Administrators should be able to select the game mode for each tournament.

Initially supported modes:

- Clash Squad.
- Battle Royale.

The architecture should allow additional game modes to be introduced later.

## 5.2 Team Capacity

Administrators should be able to configure the maximum number of participating teams.

Rules:

- Minimum two teams.
- Team capacity must be an even number.
- Examples: 2, 4, 6, 8, 10, 12, 16 and so on.
- Capacity must not be permanently hardcoded.
- Registration must automatically close when the available capacity is filled.

For knockout tournaments, non-power-of-two team counts must be handled through appropriate preliminary rounds or byes.

## 5.3 Entry Fee Configuration

Administrators must be able to set the entry fee independently for every tournament.

Examples:

- ₹20 per team.
- ₹40 per team.
- ₹50 per team.
- ₹100 per team.

These are examples, not fixed prices.

## 5.4 Prize Distribution

Administrators should be able to define prize distributions according to tournament requirements.

Examples:

- Winner takes all.
- Winner and runner-up.
- Multiple prize positions.

The system must calculate the total prize pool and remaining gross margin automatically.

## 5.5 Tournament Format

The platform should support configurable tournament formats.

Initial format:

- Knockout.

The architecture should allow other formats, such as league and round-robin, to be introduced in future development.

# 6. Tournament Scheduling

Every tournament must have configurable scheduling information.

Administrators should be able to set:

- Tournament date.
- Tournament starting time.
- Registration opening date and time.
- Registration closing date and time.
- Individual match schedules when required.

## Scheduling Rules

1. The administrator must configure the schedule before publishing the tournament.
2. Tournament date and starting time must be displayed publicly.
3. Players must be able to see a countdown to the tournament.
4. Registration must close automatically at the configured deadline.
5. Once registration opens, the tournament date and starting time become locked.
6. If a schedule change becomes necessary after registration opens, the existing tournament must be cancelled and a new tournament created.
7. Appropriate refund handling must be provided for cancelled paid tournaments.

# 7. Initial Tournament Business Model

The initial business model is based on tournament entry fees.

Current testing configuration:

| Parameter | Value |
|---|---:|
| Game | Free Fire India |
| Game Mode | Clash Squad |
| Tournament Format | Knockout |
| Initial Teams | 4 |
| Players per Team | 4 |
| Entry Fee per Team | ₹40 |
| Total Collection | ₹160 |
| Winner Prize | ₹120 |
| Gross Organiser Margin | ₹40 |

The above figures represent the initial testing tournament, not permanent platform settings.

## 7.1 Financial Calculations

Total Collection:

Total Collection = Paid Teams × Entry Fee

Gross Margin:

Gross Margin = Total Collection − Total Prize Distribution

The platform must distinguish between:

- Registered teams.
- Payment-pending teams.
- Payment-verified teams.
- Cancelled registrations.
- Refunded payments.

Only successfully verified payments should be counted as collected revenue.

# 8. Business Expansion Strategy

The platform must support gradual expansion.

Planned growth:

- Stage 1: 4 teams — initial testing.
- Stage 2: 8 teams.
- Stage 3: 12–16 teams.
- Stage 4: 24–32 teams.
- Future: Larger tournaments based on operational capacity.

The platform must not require code modifications every time the administrator changes tournament capacity or entry fees.

# 9. Standard Tournament Workflow

1. Administrator creates a tournament.
2. Administrator selects the game mode.
3. Administrator selects the tournament format.
4. Administrator configures team capacity.
5. Administrator sets entry fees.
6. Administrator defines prize distribution.
7. Administrator configures tournament dates and registration deadlines.
8. Administrator defines tournament rules.
9. Tournament is published.
10. Players browse available tournaments.
11. Team captains submit registrations.
12. Payments are completed and verified.
13. Registration closes when the deadline or capacity limit is reached.
14. Administrator finalises participating teams.
15. Tournament brackets are generated.
16. Match schedules and room information are communicated.
17. Matches are conducted.
18. Results are recorded and verified.
19. Winners are declared.
20. Prize distributions are recorded.

# 10. Product Principles

The platform must follow these principles:

- **Customisation:** Administrators control tournament settings.
- **Simplicity:** Players should find registration straightforward.
- **Transparency:** Entry fees, prize distributions and rules must be clear.
- **Fairness:** Results and payments must be verifiable.
- **Reliability:** Tournament registrations and match information must remain accurate.
- **Scalability:** The system must support increasing tournament sizes.
- **Maintainability:** The application should follow modular development practices.
- **Security:** Player accounts and payment information must be protected.
- **Responsiveness:** The website must work on desktop and mobile devices.

# 11. Initial Project Scope

The initial implementation should focus on:

- Public homepage.
- Tournament listing.
- Tournament creation and management.
- Game mode selection.
- Configurable team capacity.
- Team registration.
- Entry fee management.
- Payment verification.
- Tournament scheduling.
- Registration management.
- Knockout bracket generation.
- Match management.
- Room information distribution.
- Result management.
- Winner announcements.
- Financial summaries.
- YouTube livestream integration.

Advanced automation and additional tournament formats can be implemented in later phases.

# 12. Long-Term Vision

The long-term goal is to build a scalable esports tournament management platform.

Potential future capabilities include:

- Multiple game support.
- Multiple tournament formats.
- Advanced player statistics.
- Automated tournament management.
- Real-time match updates.
- Advanced livestream integration.
- Sponsorship management.
- Larger competitive gaming communities.

The first priority is to successfully operate small tournaments, validate the business model and gradually expand the platform.

---

**End of Project Context**

**Document Status:** Draft — Awaiting Approval