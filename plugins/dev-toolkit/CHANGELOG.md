# Changelog

All notable changes to the dev-toolkit plugin will be documented in this file.

## [1.3.0] - 2025-12-29

### Added
- "Trust Subagent Output" as foundational principle #2 in SWARM workflow
- Main agent must present subagent results directly without duplicating their analysis
- Expanded delegation rules in swarm command with detailed guidance

### Changed
- All subagent references now use plugin namespace prefix (e.g., `dev-toolkit:backend-developer`)
- All slash command references now use plugin namespace prefix (e.g., `/dev-toolkit:swarm`)
- Renamed `agile-ticket-manager` to `dev-toolkit:ticket-manager` for consistency

## [1.2.0] - 2025-12-07

### Added
- Phase 0 (Comparative Analysis) for feature parity work
- Prevents costly debugging by ensuring thorough understanding of existing patterns before implementation

## [1.1.0] - 2025-11-08

### Changed
- Implemented targeted testing strategy
- Defer comprehensive testing to Phase 4 to avoid per-task test bottleneck
