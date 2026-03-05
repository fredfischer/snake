# Snake

Minimal classic Snake game using plain HTML/CSS/JS (no dependencies).

## Run

1. Open `index.html` directly in a browser, or serve this folder with any static server.
2. Navigate to `/index.html`.

## Controls

- Keyboard: `Arrow` keys or `W/A/S/D`
- On-screen buttons: `Up`, `Left`, `Down`, `Right`
- `Pause/Resume` button toggles pause
- `Restart` button resets game state

## Tests

Run:

```bash
node tests/game-core.test.js
```

## Manual Verification Checklist

- Controls: Arrow keys/WASD and on-screen controls move in expected directions.
- Pause/Restart: pause halts movement; restart resets snake, score, and status.
- Boundaries: hitting a wall ends the game.
- Self-collision: moving into snake body ends the game.
- Food/Growth: eating food increments score and increases snake length.