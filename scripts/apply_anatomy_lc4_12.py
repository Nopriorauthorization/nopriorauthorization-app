#!/usr/bin/env python3
"""Apply lec4–lec12 cheatSheet/quiz/flashcards patches to src/lib/study/anatomy-data.ts."""
from __future__ import annotations

import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from anatomy_patch_content import RANGES, format_lecture_block, get_patches


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    target = root / "src/lib/study/anatomy-data.ts"
    patches = get_patches()
    lines = target.read_text(encoding="utf-8").split("\n")

    for lec_id, start1, end1 in reversed(RANGES):
        if lec_id not in patches:
            raise SystemExit(f"Missing patch for {lec_id}")
        block = format_lecture_block(patches[lec_id])
        new_lines = block.split("\n")
        start0 = start1 - 1
        n = end1 - start1 + 1
        lines[start0 : start0 + n] = new_lines

    target.write_text("\n".join(lines), encoding="utf-8")
    print(f"Updated {target}")


if __name__ == "__main__":
    main()
