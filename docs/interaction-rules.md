# Interaction Rules

## Global rules
- current state must be visible and editable from anywhere important in the app
- uncertainty must always be a valid answer
- users must be able to skip non-essential prompts
- low-demand paths must exist for distressed users
- free-text input is optional in primary flows, not mandatory

## State rules
- every new thread inherits the current state snapshot
- post-send state check is soft, not blocking
- if the user changes state, the change is stored as a state transition, not just overwritten
- custom labels map to canonical states underneath

## Help Now rules
- first useful action must appear quickly
- no typing required
- only safe starter supports appear before personalization threshold unlocks
- support outcomes must be easy to log

## Journal rules
- users can start new threads or continue old ones quickly
- thread UI must make state and summary context visible without clutter
- ibal should guide reflection, not replace user voice
- summaries and tags are suggestions and must remain correctable

## Learning rules
- the product can suggest structure but never force final interpretation
- pattern confidence must shape how strong any suggestion sounds
- contradictions must reduce confidence instead of being ignored

## Accessibility rules
- large tap targets on primary flows
- strong contrast in dark mode
- readable hierarchy at larger text sizes
- reduced motion support
- no essential information hidden behind hover-only behavior
- no sensory-heavy effects in primary distressed-use flows

## Quality rules
- every primary flow must include empty, skip, unsure, and recovery paths
- every slice must define what shared objects it reads and writes
- every slice must define which shared components it depends on
- every slice must pass mobile-first review before considered complete