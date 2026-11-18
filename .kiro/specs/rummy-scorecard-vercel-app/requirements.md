# Requirements Document

## Introduction

A Rummy scorecard frontend application for tracking player scores in the card game Rummy. The application allows users to add players, track scores across rounds, and automatically identify when players reach the maximum score and are eliminated from the game.

## Glossary

- **Scorecard_App**: The frontend web application deployed on Vercel
- **Player**: An individual participant in the Rummy game with a name and score
- **Round**: A single playing session where scores are recorded for all active players
- **Active_Player**: A Player whose total score is less than 200
- **Eliminated_Player**: A Player whose total score reaches 201 or more
- **Score_Entry**: A numerical value added to a Player's total score for a given round

## Requirements

### Requirement 1: Player Management

**User Story:** As a game host, I want to add players with names, so that I can track scores for each participant in the Rummy game.

#### Acceptance Criteria

1. THE Scorecard_App SHALL support a maximum of 7 Players
2. WHEN a Player is added, THE Scorecard_App SHALL assign a unique identifier to the Player
3. WHEN a Player is added, THE Scorecard_App SHALL require a Player name
4. WHEN a Player name is provided, THE Scorecard_App SHALL store the name
5. WHERE a Player name exceeds maximum display length, THE Scorecard_App SHALL truncate or wrap the display appropriately

### Requirement 2: Score Tracking

**User Story:** As a game host, I want to enter scores for each round, so that I can track the cumulative score for each Player.

#### Acceptance Criteria

1. WHEN a Score_Entry is added for a Player, THE Scorecard_App SHALL add it to the Player's total score
2. WHEN a Player's total score reaches 201, THE Scorecard_App SHALL mark the Player as Eliminated_Player
3. WHILE a Player is Active_Player, THE Scorecard_App SHALL display the Player's current total score
4. WHILE a Player is Eliminated_Player, THE Scorecard_App SHALL display the Player as eliminated
5. THE Scorecard_App SHALL prevent Score_Entry for Eliminated_Players

### Requirement 3: Score Display and Calculation

**User Story:** As a game participant, I want to see real-time score updates, so that I can know my current standing in the game.

#### Acceptance Criteria

1. WHEN any Player's score changes, THE Scorecard_App SHALL update the display immediately
2. THE Scorecard_App SHALL display all Players' names and current total scores
3. THE Scorecard_App SHALL visually distinguish Active_Players from Eliminated_Players
4. WHERE multiple Players have the same score, THE Scorecard_App SHALL display them in order of addition or alphabetically

### Requirement 4: Round Management

**User Story:** As a game host, I want to manage rounds, so that I can organize score entries by playing session.

#### Acceptance Criteria

1. WHEN a new Round is started, THE Scorecard_App SHALL reset Score_Entry tracking for that Round
2. WHEN a Round is completed, THE Scorecard_App SHALL finalize all Score_Entries for that Round
3. THE Scorecard_App SHALL display the current Round number
4. WHILE entering scores for a Round, THE Scorecard_App SHALL prevent modification of previous Rounds' scores

### Requirement 5: Data Persistence

**User Story:** As a user, I want my game data to persist during the session, so that I don't lose progress if I refresh the page.

#### Acceptance Criteria

1. WHEN the page is refreshed, THE Scorecard_App SHALL restore all Players and their scores
2. WHEN the browser tab is closed and reopened, THE Scorecard_App SHALL attempt to restore the game state
3. IF browser storage is unavailable, THEN THE Scorecard_App SHALL initialize with an empty game state

### Requirement 6: User Interface

**User Story:** As a user, I want an intuitive interface, so that I can easily manage the scorecard without confusion.

#### Acceptance Criteria

1. THE Scorecard_App SHALL provide clear buttons for adding Players
2. THE Scorecard_App SHALL provide clear input fields for entering Player names
3. THE Scorecard_App SHALL provide clear input fields for entering scores
4. THE Scorecard_App SHALL display validation messages for invalid inputs
5. WHERE a Player name is empty, THE Scorecard_App SHALL prevent Player creation
6. WHERE a Score_Entry is not a valid number, THE Scorecard_App SHALL prevent score submission

### Requirement 7: Deployment and Accessibility

**User Story:** As a developer, I want to deploy the application on Vercel, so that users can access it from any device.

#### Acceptance Criteria

1. THE Scorecard_App SHALL be deployable to Vercel
2. THE Scorecard_App SHALL be responsive and work on mobile, tablet, and desktop devices
3. THE Scorecard_App SHALL follow web accessibility standards (WCAG 2.1 AA)
4. WHERE JavaScript is disabled, THE Scorecard_App SHALL display a fallback message
