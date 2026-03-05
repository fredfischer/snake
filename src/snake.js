(function () {
  var core = window.SnakeCore;
  var GRID_SIZE = 20;
  var TICK_MS = 140;

  var state = core.createInitialState({ gridSize: GRID_SIZE, startLength: 3 });
  var queuedDirection = state.direction;

  var grid = document.getElementById('game-grid');
  var scoreEl = document.getElementById('score');
  var statusEl = document.getElementById('status');
  var pauseBtn = document.getElementById('pause-btn');
  var restartBtn = document.getElementById('restart-btn');
  var gridLinesToggle = document.getElementById('grid-lines-toggle');
  var controlButtons = Array.prototype.slice.call(document.querySelectorAll('.ctrl'));

  function indexFromPoint(point) {
    return point.y * GRID_SIZE + point.x;
  }

  function buildGrid() {
    var total = GRID_SIZE * GRID_SIZE;
    var frag = document.createDocumentFragment();
    var i;
    for (i = 0; i < total; i += 1) {
      var cell = document.createElement('div');
      cell.className = 'cell';
      frag.appendChild(cell);
    }
    grid.replaceChildren(frag);
  }

  function clearGrid() {
    var cells = grid.children;
    var i;
    for (i = 0; i < cells.length; i += 1) {
      cells[i].className = 'cell';
    }
  }

  function render() {
    clearGrid();

    var food = state.food;
    if (food) {
      grid.children[indexFromPoint(food)].classList.add('food');
    }

    var i;
    for (i = 0; i < state.snake.length; i += 1) {
      var segment = state.snake[i];
      var cell = grid.children[indexFromPoint(segment)];
      cell.classList.add('snake');
      if (i === 0) {
        cell.classList.add('head');
      }
    }

    scoreEl.textContent = String(state.score);

    if (state.gameOver) {
      statusEl.textContent = 'Game over';
    } else if (state.paused) {
      statusEl.textContent = 'Paused';
    } else {
      statusEl.textContent = 'Running';
    }

    pauseBtn.textContent = state.paused ? 'Resume' : 'Pause';
  }


  function setGridLinesVisible(isVisible) {
    grid.classList.toggle('hide-grid', !isVisible);
  }
  function setDirection(direction) {
    queuedDirection = direction;
  }

  function keyToDirection(key) {
    var lower = key.toLowerCase();
    if (lower === 'arrowup' || lower === 'w') return 'up';
    if (lower === 'arrowdown' || lower === 's') return 'down';
    if (lower === 'arrowleft' || lower === 'a') return 'left';
    if (lower === 'arrowright' || lower === 'd') return 'right';
    return null;
  }

  function onKeydown(event) {
    var direction = keyToDirection(event.key);
    if (!direction) return;
    event.preventDefault();
    setDirection(direction);
  }

  function onControlClick(event) {
    var target = event.currentTarget;
    setDirection(target.getAttribute('data-dir'));
  }

  function togglePause() {
    if (state.gameOver) {
      return;
    }
    state = {
      gridSize: state.gridSize,
      snake: state.snake.map(function (p) {
        return { x: p.x, y: p.y };
      }),
      direction: state.direction,
      pendingDirection: state.pendingDirection,
      food: state.food ? { x: state.food.x, y: state.food.y } : null,
      score: state.score,
      gameOver: false,
      paused: !state.paused
    };
    render();
  }

  function restart() {
    state = core.createInitialState({ gridSize: GRID_SIZE, startLength: 3 });
    queuedDirection = state.direction;
    render();
  }

  function tick() {
    state = core.step(state, queuedDirection);
    queuedDirection = state.direction;
    render();
  }

  buildGrid();
  render();

  document.addEventListener('keydown', onKeydown);
  pauseBtn.addEventListener('click', togglePause);
  restartBtn.addEventListener('click', restart);
  if (gridLinesToggle) {
    setGridLinesVisible(gridLinesToggle.checked);
    gridLinesToggle.addEventListener('change', function () {
      setGridLinesVisible(gridLinesToggle.checked);
    });
  }
  controlButtons.forEach(function (button) {
    button.addEventListener('click', onControlClick);
  });

  window.setInterval(tick, TICK_MS);
})();
