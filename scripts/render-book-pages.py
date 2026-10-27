#!/usr/bin/env python3
"""Render the author's PDFs as faithful, optimized pages for mobile readers.

Requires Poppler's pdftoppm and Pillow. It never changes the original PDFs.
Run from the repository root: python3 scripts/render-book-pages.py
"""

from pathlib import Path
import argparse
import subprocess
import tempfile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BOOKS = {
    "12-12": 112,
    "haribini-bisharaf": 173,
    "la-tuhaddiq-kathiran": 153,
    "warith-al-ahd": 218,
}


def render(slug: str, expected: int) -> None:
    source = ROOT / "public" / "books" / f"{slug}.pdf"
    destination = ROOT / "public" / "pages" / slug
    destination.mkdir(parents=True, exist_ok=True)

    print(f"Rendering {slug} ({expected} pages)", flush=True)
    with tempfile.TemporaryDirectory(prefix=f"book-{slug}-") as temp_dir:
        prefix = Path(temp_dir) / "page"
        subprocess.run(
            ["pdftoppm", "-scale-to", "2200", "-jpeg", "-jpegopt",
             "quality=94,optimize=y", str(source), str(prefix)],
            check=True,
        )
        original_pages = sorted(Path(temp_dir).glob("page-*.jpg"))
        if len(original_pages) != expected:
            raise RuntimeError(f"{slug}: expected {expected}, rendered {len(original_pages)}")

        for number, path in enumerate(original_pages, start=1):
            with Image.open(path) as page:
                page.convert("RGB").save(
                    destination / f"{number:03d}.webp", "WEBP", quality=87, method=5,
                )
            if number % 40 == 0 or number == expected:
                print(f"  {slug}: {number}/{expected}", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--book", choices=BOOKS.keys(), help="Render just one book")
    options = parser.parse_args()
    for slug, count in BOOKS.items():
        if not options.book or options.book == slug:
            render(slug, count)


if __name__ == "__main__":
    main()
