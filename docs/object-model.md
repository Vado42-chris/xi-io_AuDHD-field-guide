# Object Model

## Core shared objects

### CurrentState
Represents the user's live, global state.
- canonical state id
- user-facing label
- intensity
- timestamp
- source of change

### CanonicalState
Stable internal state category used for routing and analysis.
Starter set:
- steady
- overloaded
- activated
- shut_down
- in_pain
- stuck
- unclear

### CustomStateLabel
User-owned label mapped to a canonical state.
- label
- canonical state id
- favorite
- hidden
- display order

### Thread
A saved conversation container.
- title
- created at
- updated at
- starting current state snapshot
- active tags
- summary

### Message
A single user or ibal message.
- role
- content
- timestamp
- optional sources

### StateTransition
A recorded change from one state to another.
- thread id
- from state
- to state
- intensity change
- timestamp
- source

### MemoryEntry
Structured summary generated from a thread or support flow.
- summary
- state tags
- trigger tags
- support tags
- confidence level
- user confirmed flag
- related thread id

### Stressor
A factor that tends to increase load.
- label
- category
- contexts
- outcomes over time

### DeStresser
A factor that tends to reduce load.
- label
- category
- contexts
- outcomes over time

### SensorySupport
A sensory strategy the user may prefer or avoid.
- label
- category
- user affinity
- helpful states
- unhelpful states
- outcome counts

### SupportOutcome
Recorded effect of a support.
- helped
- a_little
- no_change
- worse
- skipped

### PatternConfidence
Tracks readiness for personalized suggestions.
- early
- learning
- trusted
- supporting evidence count
- contradiction count

## Rules
- current state is global and always editable
- every thread stores its starting state snapshot
- state transitions are first-class records, not just overwritten values
- custom labels never replace canonical routing underneath
- memory entries are user-correctable
- personalized suggestions depend on pattern confidence, not one-off observations