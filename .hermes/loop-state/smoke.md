---
loop: smoke
last_run: 2026-06-19T22:13:40Z
run_count: 6
consecutive_failures: 6
status: active
---

# smoke — Daily E2E state

## Open findings
(none)

## Findings in progress

- [ ] smoke-20260619-213608 — generator spawned, awaiting result | evaluator: pending

- [ ] smoke-20260619-213204 — generator spawned, awaiting result | evaluator: pending

- [ ] smoke-20260619-213101 — generator spawned, awaiting result | evaluator: pending
(none)

## Done (last 30)
(none)

## Human review queue

- smoke-20260619 — exit=1 | reasons: Smoke subset expects 32 tests
VERDICT: FAIL
  expected=31 skipped=0 unexpected=1 flaky=0
REASONS:
  - 1 unexpected test failure(s)
  - expected >=32 tests, got 31 (drift)

- smoke-20260619 — exit=1 | reasons: /Users/alishafique/Code/worki-pro/scripts/loops/_lib.sh: line 167: EXPECTED_TESTS: unbound variable

- smoke-20260619 — exit=1 | reasons: Traceback (most recent call last):
  File "<string>", line 3, in <module>
  File "/Users/alishafique/.local/share/uv/python/cpython-3.11-macos-aarch64-none/lib/python3.11/json/__init__.py", line 293, in load
    return loads(fp.read(),
           ^^^^^^^^^^^^^^^^
  File "/Users/alishafique/.local/share/uv/python/cpython-3.11-macos-aarch64-none/lib/python3.11/json/__init__.py", line 346, in loads
    return _default_decoder.decode(s)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/alishafique/.local/share/uv/python/cpython-3.11-macos-aarch64-none/lib/python3.11/json/decoder.py", line 337, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/alishafique/.local/share/uv/python/cpython-3.11-macos-aarch64-none/lib/python3.11/json/decoder.py", line 355, in raw_decode
    raise JSONDecodeError("Expecting value", s, err.value) from None
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)

- smoke-20260619 — exit=1 | reasons: Playwright report missing at /Users/alishafique/Code/worki-pro/playwright-report/results.json — run 'npx playwright test' first

- smoke-20260619 — exit=1 | reasons: Playwright report missing at /Users/alishafique/Code/worki-pro/playwright-report/results.json — run 'npx playwright test' first

- smoke-20260619 — exit=1 | reasons: Playwright report missing at /Users/alishafique/Code/worki-pro/playwright-report/results.json — run 'npx playwright test' first
(none)

## Token spend this week
| Day | Tokens |
|-----|--------|