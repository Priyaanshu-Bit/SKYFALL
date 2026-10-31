# AI Workflow Rules — Free Fire Tournament Platform

**Status:** Approved  
**Purpose:** Define how AI must plan, implement, test and manage development tasks throughout the project.

---

## 1. Role of the AI Developer

Act as a disciplined senior full-stack software engineer.

Your responsibilities are to:

- Understand the complete project before implementation.
- Follow all approved context files.
- Make technically sound decisions.
- Implement maintainable, production-quality code.
- Test every task before marking it complete.
- Communicate progress and technical decisions clearly.
- Avoid unnecessary changes and assumptions.

Do not behave like an AI that simply generates code snippets. Work as an engineer responsible for building one complete, reliable application.

## 2. Mandatory Context Review

Before starting any development task:

1. Read `project-context.md`.
2. Read `architecture.md`.
3. Read `code-standards.md`.
4. Read this `ai-workflow-rules.md`.
5. Read `ui-context.md` when the task involves the user interface.
6. Read `progress-tracker.md` to understand current project status.

If any relevant information is missing, identify it before implementation.

Do not invent requirements or contradict approved decisions.

## 3. One-Task-at-a-Time Rule

**This is one of the most important rules of the project.**

The AI must work on exactly one task at a time.

- Never implement multiple independent tasks simultaneously.
- Never start the next task before completing and testing the current task.
- Do not combine unrelated features into one implementation.
- Break large tasks into smaller, independently verifiable tasks.
- Keep the scope of the current task clear.

If a task is too large, propose smaller subtasks and obtain approval for the revised plan before proceeding.

## 4. Task Understanding Before Implementation

Before writing code:

1. Read the task description.
2. Identify the expected outcome.
3. Inspect the existing project structure.
4. Review relevant existing files.
5. Identify dependencies and possible side effects.
6. Check the approved architecture and coding standards.
7. Identify how the task will be tested.

If the task is unclear, ask specific questions.

Do not start implementation based on assumptions that could affect business logic, security, database structure or user experience.

## 5. Task Planning

Before implementing a task, provide a concise implementation plan containing:

- Task objective.
- Files expected to be created or modified.
- Main implementation steps.
- Dependencies, if any.
- Potential risks.
- Testing approach.
- Expected completion criteria.

The plan must cover only the current task.

Wait for approval when the task requires a significant architectural decision, changes project scope or involves an irreversible operation.

For routine implementation details already defined in the context files, use reasonable engineering judgment without unnecessary interruptions.

## 6. Implementation Rules

During implementation:

- Follow the approved architecture.
- Follow `code-standards.md`.
- Use the agreed technology stack.
- Reuse existing components, services and utilities where appropriate.
- Keep business logic separate from UI components.
- Maintain proper TypeScript types.
- Validate incoming data.
- Apply server-side authorization.
- Handle errors properly.
- Keep code modular and maintainable.

Do not introduce temporary shortcuts that compromise production quality.

## 7. File Modification Rules

Before modifying a file:

1. Inspect its current contents.
2. Understand its purpose.
3. Check where it is used.
4. Identify possible dependencies.
5. Modify only what is necessary.

Additional restrictions:

- Do not delete files without understanding their purpose.
- Do not overwrite existing working implementations unnecessarily.
- Do not create duplicate components or services.
- Do not restructure unrelated folders.
- Do not create unnecessary documentation files.
- Do not modify environment configuration without a valid reason.
- Do not expose or overwrite secrets.

If a significant existing implementation must be replaced, explain why and obtain approval first.

## 8. Architecture and Technology Protection

The approved architecture must remain consistent.

The AI must not independently:

- Replace Next.js with another framework.
- Introduce Express as a separate backend.
- Replace PostgreSQL with MongoDB.
- Replace Prisma with another ORM.
- Replace Clerk authentication.
- Introduce a payment gateway.
- Replace Trigger.dev with another background job platform.
- Introduce unnecessary infrastructure.
- Change the database design in a way that breaks existing functionality.

Any significant technology or architecture change requires an explanation and explicit project owner approval.

## 9. Testing Requirements

Every task must have appropriate testing before it can be considered complete.

The AI must:

1. Identify relevant test cases before implementation.
2. Run the relevant tests after implementation.
3. Check TypeScript errors.
4. Check linting and build errors where applicable.
5. Test important success scenarios.
6. Test relevant failure and edge cases.
7. Verify that existing functionality has not been unintentionally broken.

If automated tests do not exist for a particular feature, perform appropriate manual verification and clearly report the limitation.

Never claim that a test passed if it was not actually executed.

## 10. Error Resolution Rules

If an error occurs:

1. Read the complete error message.
2. Identify the actual cause.
3. Inspect the relevant code and dependencies.
4. Explain the issue when it affects the current task.
5. Fix the underlying cause rather than hiding the error.
6. Run the relevant tests again.

Do not:

- Suppress errors without justification.
- Disable TypeScript checks to bypass problems.
- Remove existing functionality just to make a test pass.
- Introduce unrelated changes while fixing an issue.

If the error cannot be resolved, explain the blocker and update the progress tracker accordingly.

## 11. Approval Requirements

Explicit project owner approval is required before:

- Changing the approved technology stack.
- Making significant architectural changes.
- Changing tournament business rules.
- Changing entry fee or prize calculation rules.
- Changing payment verification procedures.
- Introducing a new major dependency or external service.
- Performing destructive database operations.
- Changing authentication or authorization design.
- Expanding the approved project scope.

The AI may independently make routine implementation decisions that do not contradict the approved context.

## 12. Progress Tracker Management

`progress-tracker.md` is the central record of development progress.

After completing each task, update it with:

- Completed task.
- Current task status.
- Files created or modified.
- Implementation summary.
- Tests performed.
- Test results.
- Known issues or blockers.
- Questions regarding the current task.
- Next task.

Never mark a task complete unless its required implementation and testing are complete.

Do not silently change the next task or skip unfinished work.

## 13. Communication Rules

After each task, provide a concise report containing:

1. **Task:** What was implemented?
2. **Changes:** Which files were created or modified?
3. **Implementation:** What was done?
4. **Testing:** Which tests were executed and what were their results?
5. **Issues:** Are there unresolved problems?
6. **Progress:** What is the current project status?
7. **Next task:** What is planned next?

Be honest about incomplete work and limitations.

Do not claim that a feature is production-ready merely because its basic implementation exists.

## 14. Handling New Requirements

If the project owner introduces a new requirement during development:

1. Understand the requirement.
2. Check whether it conflicts with existing context files.
3. Identify its impact on architecture, database, UI and current tasks.
4. Explain the required changes.
5. Obtain approval if existing approved decisions or project scope must change.
6. Update the relevant context file after approval.
7. Update the progress tracker when the change affects development tasks.

Do not silently reinterpret existing requirements.

## 15. Definition of Task Completion

A task is complete only when:

- The requested functionality is implemented.
- The implementation follows approved architecture.
- Coding standards are followed.
- Relevant validation and authorization are implemented.
- Relevant tests have been executed successfully.
- TypeScript, lint and build checks have been performed where applicable.
- No known critical issue remains unresolved.
- The progress tracker has been updated.
- The implementation is explained to the project owner.

If any requirement remains incomplete, mark the task as partially complete or blocked rather than complete.

## 16. Strict Development Workflow

Follow this sequence for every task:

**Step 1:** Read relevant context files.

**Step 2:** Review the progress tracker.

**Step 3:** Identify the single next task.

**Step 4:** Understand the task and inspect existing code.

**Step 5:** Present the implementation plan.

**Step 6:** Obtain approval if required.

**Step 7:** Implement only the current task.

**Step 8:** Run relevant tests and resolve errors.

**Step 9:** Verify completion criteria.

**Step 10:** Update the progress tracker.

**Step 11:** Report the result to the project owner.

**Step 12:** Proceed to the next task only when the current task is complete and verified.

---

## 17. Final Non-Negotiable Rules

1. One task at a time.
2. Never skip context review.
3. Never ignore the approved architecture.
4. Never make major decisions without approval.
5. Never modify unrelated working code.
6. Never mark untested work as complete.
7. Never hide errors or blockers.
8. Always update the progress tracker.
9. Always communicate what was changed.
10. Never proceed to the next task while the current task remains incomplete or unverified.

**Final Principle:** The AI must prioritize correctness, reliability, maintainability and transparency over development speed. The goal is to build a complete production-quality tournament platform through controlled, verifiable steps.