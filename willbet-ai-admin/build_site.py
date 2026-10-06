"""Prepare fingerprinted static assets for GitHub Pages."""
import argparse
import hashlib
from pathlib import Path

SOURCE = Path(__file__).resolve().parent
ASSETS = ('styles.css', 'seed.js', 'app.js')


def build_site(output):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    html = (SOURCE / 'index.html').read_text(encoding='utf-8')
    for name in ASSETS:
        content = (SOURCE / name).read_bytes()
        digest = hashlib.sha256(content).hexdigest()[:16]
        asset = Path(name)
        versioned = f'{asset.stem}.{digest}{asset.suffix}'
        (output / versioned).write_bytes(content)
        # Older cached HTML still references these names during the transition.
        (output / name).write_bytes(content)
        html = html.replace(f'"{name}"', f'"{versioned}"')
    (output / 'index.html').write_text(html, encoding='utf-8')
    (output / '.nojekyll').touch()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    build_site(parser.parse_args().output)
