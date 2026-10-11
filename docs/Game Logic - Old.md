# Game Logic - Old

Pre-october 2026 update.

Reverse-engineered from the code. Where code and the in-game tutorial disagree, the code wins. Quirks and likely bugs are collected at the end.

## Overview

Trample is a daily, single-player word game. Everyone gets the same 3-letter starting word and the same letter bank each day. Each turn you change the current word by one letter to make a new valid word. You score points for every word you make. The game ends when no valid move exists, when you forfeit, or (in hard mode) when you make too many bad guesses in one turn.

## The daily puzzle

- **Day number**: days since local midnight on 2023-12-31, so 2024-01-01 is Trample #1. Shown in the title as `Trample #N`. Uses the player's local time (`src/utils/getDayNumber.ts`).
- **Starting word**: picked from a fixed list of 467 common 3-letter words, seeded by the day number (`src/utils/getTodaysWord.ts`). Same word for everyone on the same local date.
- **Letter bank**: a deterministic sequence of 1000 letters seeded by the local date (`src/utils/getFullLetterBank.ts`). The first 10 are shown as the visible bank; the other 990 are the refill pile.
- **Rollover**: the page checks every 5 seconds and reloads when the day number changes.

### Letter distribution

Each letter is drawn independently using these weights (total 207):

| Weight | Letters | Chance each |
| --- | --- | --- |
| 10 | B C D F G H K L M N P R S T W | 4.8% |
| 8 | A E I O U | 3.9% |
| 6 | Y | 2.9% |
| 5 | V | 2.4% |
| 3 | J | 1.4% |
| 1 | Q X Z | 0.5% |

Vowels are weighted slightly lower than most consonants. An older, more English-frequency-like distribution is left commented out in the file.

## Board layout

Top to bottom:

1. Header: settings gear (tutorial, hard mode toggle), title with day number, Forfeit button.
2. Score and history bar: current score and every word played so far, starting word included.
3. Current word: one tile per letter.
4. Action buttons (only while a current-word letter is selected) or the last error message.
5. Letter bank: 10 tiles.

Every tile shows its point value in the corner.

## Taking a turn

1. Tap a letter in the current word. Tapping it again deselects it.
2. Pick an action:
   - **Insert before**: add a bank letter to the left of the selected letter.
   - **Replace** (called "swap" in code): replace the selected letter with a bank letter.
   - **Insert after**: add a bank letter to the right of the selected letter.
   - **Delete**: remove the selected letter. No bank letter needed. Limited to 2 per game.
3. For insert/replace, tap a bank letter. Bank letters are disabled until a current-word letter is selected. Action and bank letter can be picked in either order.

The move is submitted as soon as the selections are complete. There is no confirm step.

### Validation

The candidate word is checked in this order:

1. **Length**: must be 2 to 15 letters. Otherwise: "Word too short!"
2. **Already used**: must not be in this game's history, including the starting word. Otherwise: `You've already used "X"`. Delete is exempt from this check (see quirks).
3. **Dictionary**: must be in the word list. Otherwise: `"X" is not a word!`

### On a valid word

- It becomes the current word and is added to the history.
- Its points are added to the score.
- The used bank letter is replaced in the same slot by the next letter from the refill pile (taken from the end of the 1000-letter sequence).
- For delete, the deletion count drops by 1.
- Hard mode attempts reset to 5.

### On an invalid word

- Error message is shown.
- Nothing is consumed: no bank letter used, no deletion used.
- Hard mode: costs 1 attempt for "not a word" (including failed deletes). "Too short" and "already used" cost nothing.

## Scoring

Each valid word scores the sum of its letter values (standard Scrabble values), times a length multiplier, rounded up.

| Points | Letters |
| --- | --- |
| 1 | A E I O U L N S T R |
| 2 | D G |
| 3 | B C M P |
| 4 | F H V W Y |
| 5 | K |
| 8 | J X |
| 10 | Q Z |

| Word length | Multiplier |
| --- | --- |
| 2-3 | 1.0 |
| 4 | 1.1 |
| 5 | 1.2 |
| 6 | 1.3 |
| 7 | 1.4 |
| 8 | 1.5 |
| 9+ | 1.0 (no multiplier, see quirks) |

Notes:

- The whole new word is scored every turn, not just the letter you changed. Long words keep paying out each turn you keep them long.
- The starting word scores nothing. Score starts at 0.
- Example: COG to CON scores C(3) + O(1) + N(1) = 5. CON to CONE scores ceil(6 x 1.1) = 7.

## Dictionary

Per-length word lists in `src/utils/dicts/{2..15}.ts`, about 279k words total. Includes Collins-only words (e.g. CH, ZE, OK, AALII), so it appears to be a Collins Scrabble Words list. No 1-letter words.

| Length | Words | Length | Words |
| --- | --- | --- | --- |
| 2 | 127 | 9 | 42,933 |
| 3 | 1,346 | 10 | 37,235 |
| 4 | 5,637 | 11 | 29,027 |
| 5 | 12,972 | 12 | 21,025 |
| 6 | 23,030 | 13 | 14,345 |
| 7 | 34,336 | 14 | 9,397 |
| 8 | 42,150 | 15 | 5,925 |

## Game end

The game ends in one of three ways:

1. **No moves left ("You've been trampled")**: after every change, the game searches for any legal next word using the current word, the 10 visible bank letters, and remaining deletions (`src/utils/evaluation.ts`). It tries, in order: deleting any letter (if word is 3+ letters and deletions remain), replacing any letter with any bank letter, inserting any bank letter at any position. Words already in the history don't count. If nothing is found, the game ends automatically.
2. **Forfeit ("Game Over")**: the Forfeit button is enabled once score is above 0. The end screen says "You've gave up" and shows a word you could have played (the first one the search above found).
3. **Hard mode lockout**: 5 invalid guesses within one turn. Shows "You've been trampled".

### End screen

- Score, number of words, all-time best score.
- Share button (only where the browser supports `navigator.share`), sharing:
  ```
  Trample #N
  🏆 Score: X
  🥇 Number of words: Y
  ```
- "Come back tomorrow for more!"

## One game per day

- Only the first finished game each day is recorded. Once today's stats exist, loading the page shows the end screen.
- In-progress games are saved to localStorage and restored on reload: current word, score, history, deletions left, hard mode attempts. Saved state from a previous day is discarded.
- `?reset=true` in the URL clears saved stats (debug escape hatch).

## Stats

Stored in localStorage under `trample-history-stats`, overwritten on each day's first finished game:

| Field | Meaning |
| --- | --- |
| `dayNumber` | Day of the last recorded game |
| `score` | Final score |
| `longestWord` | Length (not the word) of the longest word in history |
| `numWords` | Number of words in history, including the starting word |
| `bestScore` | All-time best score; the only value carried across days |

No streaks, win counts, or history of past days are kept.

## Hard mode

- Toggled from the settings gear. Only allowed before your first move.
- Persists across days.
- Rule: 5 "not a word" guesses in a single turn ends the game. The counter resets after every valid word.
- Day number is styled with a red rainbow instead of the normal rainbow.
- Does not change scoring and is not recorded in stats or the share text.

## Tutorial

Shown automatically on first visit until dismissed. Reopen from the settings gear. Six steps:

1. **Intro**: "a game of clever words, strategy, and a little luck."
2. **Current word**: new 3-letter word each day; tap a letter to act on it.
3. **Turns**: goal each turn is to make a new word using the letter bank.
4. **Actions**: replace, insert before/after, or delete. Warns that only 2 deletes are allowed per game.
5. **Example**: interactive. Turn COG into CON by selecting G, Replace, then N.
6. **Tips**:
   - Longer words are worth more but riskier, since deletes are expensive.
   - Use up bad or repeated bank letters quickly.
   - Each word can only be used once.
   - New game and starting word every day.

## Analytics

Mixpanel events: `CHECK_WORD_START`, `CHECK_WORD_VALID` (word and history), `FORFEIT` (history), `FINISH_GAME` (stats plus full word list).

## Quirks and likely bugs

Worth deciding on during the rework:

- **Reload refreshes the letter bank.** The bank isn't saved, so a reload restores the day's original 10 letters while keeping your word, score, and deletions. Players can reroll a bad bank.
- **Delete can reuse old words.** Delete skips the "already used" check, so you can delete back to a previous word and score it again. The tutorial says words can only be used once.
- **End detection disagrees with delete.** The no-moves search does not allow reused words for delete, so the game can end even though a delete to an old word would have been accepted.
- **No multiplier at 9+ letters.** The multiplier table stops at 8, so a 9-letter word gets less bonus than an 8-letter word.
- **15-letter words can break things.** Inserting into a 15-letter word or searching for moves from one tries to load a 16-letter dictionary that doesn't exist. Rare in practice.
- **"Word too short!" is also shown for too-long words.**
- **Refills come from the end of the sequence**, not in order. Doesn't matter for fairness since the whole sequence is seeded, but is surprising.
- **Last starting word is never picked.** The index math means YET can never be the daily word.
- **Two different seeds.** The word uses the day number; the bank uses the calendar date string. Both are local time, so players in different time zones can be on different puzzles at the same moment.
- **DST edge.** Day number divides by 24 hours, so for the first hour after a spring-forward the day number can lag by one.
- **`numWords` counts the starting word**, so it's one more than the number of words played.
- **Replacing a letter with itself** produces the current word and shows "already used" instead of being blocked.
