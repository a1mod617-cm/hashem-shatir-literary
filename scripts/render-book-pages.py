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


def valid_page(path: Path) -> bool:
    if not path.is_file() or path.stat().st_size < 500:
        return False
    try:
        with Image.open(path) as image:
            image.verify()
        return True
    except Exception:
        return False


def write_page(jpeg: Path, destination: Path) -> None:
    temporary = destination.with_suffix(".tmp.webp")
    try:
        for _ in range(3):
            with Image.open(jpeg) as image:
                image.convert("RGB").save(temporary, "WEBP", quality=87, method=5)
            if valid_page(temporary):
                temporary.replace(destination)
                return
        raise RuntimeError(f"Failed to generate a valid page: {destination}")
    finally:
        temporary.unlink(missing_ok=True)


def render(slug: str, expected: int, repair_only: bool = False) -> None:
    source = ROOT / "public" / "books" / f"{slug}.pdf"
    destination = ROOT / "public" / "pages" / slug
    destination.mkdir(parents=True, exist_ok=True)

    print(f"Rendering {slug} ({expected} pages)", flush=True)
    with tempfile.TemporaryDirectory(prefix=f"book-{slug}-") as temp_dir:
        prefix = Path(temp_dir) / "page"
        to_render = [number for number in range(1, expected + 1)
                     if not repair_only or not valid_page(destination / f"{number:03d}.webp")]
        if not to_render:
            print(f"  {slug}: all pages verified", flush=True)
            return
        if repair_only:
            for number in to_render:
                subprocess.run(
                    ["pdftoppm", "-f", str(number), "-l", str(number),
                     "-scale-to", "2200", "-jpeg", "-jpegopt",
                     "quality=94,optimize=y", "-singlefile", str(source), str(prefix)],
                    check=True,
                )
                write_page(prefix.with_suffix(".jpg"), destination / f"{number:03d}.webp")
            print(f"  {slug}: repaired {len(to_render)} pages", flush=True)
        else:
            subprocess.run(
                ["pdftoppm", "-scale-to", "2200", "-jpeg", "-jpegopt",
                 "quality=94,optimize=y", str(source), str(prefix)],
                check=True,
            )
            original_pages = sorted(Path(temp_dir).glob("page-*.jpg"))
            if len(original_pages) != expected:
                raise RuntimeError(f"{slug}: expected {expected}, rendered {len(original_pages)}")
            for number, path in enumerate(original_pages, start=1):
                write_page(path, destination / f"{number:03d}.webp")
                if number % 40 == 0 or number == expected:
                    print(f"  {slug}: {number}/{expected}", flush=True)

    bad_pages = [number for number in range(1, expected + 1)
                 if not valid_page(destination / f"{number:03d}.webp")]
    if bad_pages:
        raise RuntimeError(f"Invalid pages in {slug}: {bad_pages}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--book", choices=BOOKS.keys(), help="Render just one book")
    parser.add_argument("--repair-only", action="store_true", help="Recreate only missing or invalid pages")
    options = parser.parse_args()
    for slug, count in BOOKS.items():
        if not options.book or options.book == slug:
            render(slug, count, options.repair_only)


if __name__ == "__main__":
    main()
