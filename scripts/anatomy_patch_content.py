# -*- coding: utf-8 -*-
"""Patch payloads for anatomy-data.ts lectures lec4–lec12 (cheatSheet, quiz, flashcards)."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

Ranges = List[Tuple[str, int, int]]

RANGES: Ranges = [
    ("lec4", 1040, 1355),
    ("lec5", 1363, 1678),
    ("lec6", 1686, 2001),
    ("lec7", 2009, 2324),
    ("lec8", 2332, 2647),
    ("lec9", 2655, 2970),
    ("lec10", 2978, 3293),
    ("lec11", 3301, 3616),
    ("lec12", 3624, 3939),
]


def _fmt_block(key: str, obj: Any) -> str:
    inner = json.dumps(obj, indent=2, ensure_ascii=False)
    lines = inner.split("\n")
    lines[0] = f'      "{key}": {lines[0]}'
    for i in range(1, len(lines)):
        lines[i] = f"      {lines[i]}"
    return "\n".join(lines)


def format_lecture_block(lecture: Dict[str, Any]) -> str:
    parts = [
        _fmt_block("cheatSheet", lecture["cheatSheet"]),
        _fmt_block("quiz", lecture["quiz"]),
        _fmt_block("flashcards", lecture["flashcards"]),
    ]
    # Object literal requires commas after cheatSheet and quiz arrays
    for i in range(2):
        lines = parts[i].split("\n")
        lines[-1] = lines[-1] + ","
        parts[i] = "\n".join(lines)
    return "\n".join(parts)


def get_patches() -> Dict[str, Dict[str, Any]]:
    """Return lec_id -> { cheatSheet, quiz, flashcards } from scripts/anatomy_patches/<id>.json."""
    here = Path(__file__).resolve().parent
    patches: Dict[str, Dict[str, Any]] = {}
    for lec_id, _, _ in RANGES:
        path = here / "anatomy_patches" / f"{lec_id}.json"
        patches[lec_id] = json.loads(path.read_text(encoding="utf-8"))
    return patches
