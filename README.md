# Eagle Point AI - Technical Assessment

This repository contains my solutions for the Eagle Point AI technical assessment tasks.

## Tasks Completed

### Task 1: Smart Text Analyzer (Python)
A function that analyzes text and returns:
- Total word count
- Average word length (2 decimals)
- Longest word(s) - all if tied
- Word frequency (case-insensitive)

**File:** `task1_text_analyzer.py`

### Task 2: Async Data Fetcher with Retry (JavaScript)
A JavaScript function that fetches data from a URL with retry logic:
- Retries on failure (up to max retry count)
- Waits 1 second between retries
- Returns data or throws error after all retries fail
- Uses async/await

**File:** `task2_async_fetcher.js`

## How to Run

### Task 1 (Python)
```bash
python task1_text_analyzer.py
```

### Task 2 (JavaScript)
```bash
node task2_async_fetcher.js
```

## Notes

Both solutions are implemented using built-in language features with no external dependencies. The code includes detailed comments explaining the approach and logic used.
