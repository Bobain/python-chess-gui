# Python Chess GUI

A Python chess application with a graphical user interface built using pygame and python-chess library.

## Features

- Graphical chess board with pygame
- Full chess rules enforcement via python-chess
- Stockfish engine integration for AI opponent

## Requirements

- Python 3.12+
- uv (package manager)
- Stockfish engine

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Bobain/python-chess-gui.git
   cd python-chess-gui
   ```

2. Install dependencies with uv:
   ```bash
   uv sync
   ```

3. Install Stockfish:
   - macOS: `brew install stockfish`
   - Linux: `apt install stockfish`
   - Windows: Download from [stockfishchess.org](https://stockfishchess.org/download/)

## Usage

Run the application:
```bash
uv run chess-gui
```

## Project Structure

```
python-chess-gui/
├── src/
│   └── python_chess_gui/
│       ├── __init__.py
│       └── main.py
├── .claude/
│   └── styleguide.md
├── pyproject.toml
├── README.md
└── .gitignore
```

## Development

This project uses:
- **uv** for dependency management
- **pygame** for the graphical interface
- **python-chess** for chess logic and Stockfish communication

## License

MIT License
