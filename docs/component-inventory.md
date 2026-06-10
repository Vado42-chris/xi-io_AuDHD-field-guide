# Component Inventory

## Shell components
- AppShell
- TopLevelNav
- SectionHeader
- EmptyState
- InlineNotice
- BottomSheet

## State system components
- CurrentStateBar
- CurrentStateSelector
- StateChip
- IntensityPicker
- PostSendStateCheck
- StateTimelineRow

## Journal components
- ThreadList
- ThreadCard
- ThreadHeader
- MessageBubble
- ComposerBar
- SummaryCard
- TagRow

## Support and learning components
- HelpNowLauncher
- SupportCard
- SupportOutcomeRow
- StressorCard
- DeStresserCard
- SensoryTile
- ComfortWallFilterBar
- PatternConfidenceMeter

## Settings and customization components
- SortableStateRow
- CanonicalMappingPill
- PreferenceToggleRow
- ExportCard

## Component contract rules
- every shared component must define supported states: default, active, disabled, loading, empty, error where relevant
- every shared component must support mobile-first use
- every interaction-critical component must meet large tap-target expectations
- every component must have plain-language labels before brand flavor copy
- shared components should not encode feature-specific business logic
- if a component is used in more than one slice, it belongs in the shared inventory, not a one-off feature folder

## First components to build
1. CurrentStateBar
2. CurrentStateSelector
3. SupportCard
4. PostSendStateCheck
5. ThreadHeader
6. SummaryCard
7. TagRow
8. PatternConfidenceMeter