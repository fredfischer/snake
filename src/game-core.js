(function (global) {
  var DIR_DELTA = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  var OPPOSITE = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };

  function toKey(point) {
    return point.x + ',' + point.y;
  }

  function clonePoint(point) {
    return { x: point.x, y: point.y };
  }

  function normalizeConfig(config) {
    var source = config || {};
    var gridSize = Number.isInteger(source.gridSize) ? source.gridSize : 20;
    var startLength = Number.isInteger(source.startLength) ? source.startLength : 3;

    return {
      gridSize: Math.max(5, gridSize),
      startLength: Math.max(2, startLength)
    };
  }

  function placeFood(occupiedCells, gridSize, rng) {
    var occupied = new Set();
    var index;

    for (index = 0; index < occupiedCells.length; index += 1) {
      occupied.add(toKey(occupiedCells[index]));
    }

    var freeCells = [];
    var x;
    var y;

    for (y = 0; y < gridSize; y += 1) {
      for (x = 0; x < gridSize; x += 1) {
        var candidate = { x: x, y: y };
        if (!occupied.has(toKey(candidate))) {
          freeCells.push(candidate);
        }
      }
    }

    if (freeCells.length === 0) {
      return null;
    }

    var randomValue = typeof rng === 'function' ? rng() : Math.random();
    var selectedIndex = Math.floor(randomValue * freeCells.length);
    return clonePoint(freeCells[selectedIndex]);
  }

  function createInitialSnake(gridSize, startLength) {
    var startY = Math.floor(gridSize / 2);
    var startX = Math.floor(gridSize / 2);
    var snake = [];
    var i;

    for (i = 0; i < startLength; i += 1) {
      snake.push({ x: startX - i, y: startY });
    }

    return snake;
  }

  function createInitialState(config, rng) {
    var normalized = normalizeConfig(config);
    var snake = createInitialSnake(normalized.gridSize, normalized.startLength);

    return {
      gridSize: normalized.gridSize,
      snake: snake,
      direction: 'right',
      pendingDirection: 'right',
      food: placeFood(snake, normalized.gridSize, rng),
      score: 0,
      gameOver: false,
      paused: false
    };
  }

  function isReverseDirection(current, next) {
    return OPPOSITE[current] === next;
  }

  function resolveDirection(state, inputDirection) {
    if (!inputDirection || !DIR_DELTA[inputDirection]) {
      return state.direction;
    }

    if (isReverseDirection(state.direction, inputDirection)) {
      return state.direction;
    }

    return inputDirection;
  }

  function isCollision(state) {
    var head = state.snake[0];
    var gridSize = state.gridSize;

    if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize) {
      return true;
    }

    var bodyIndex;
    for (bodyIndex = 1; bodyIndex < state.snake.length; bodyIndex += 1) {
      var body = state.snake[bodyIndex];
      if (body.x === head.x && body.y === head.y) {
        return true;
      }
    }

    return false;
  }

  function step(state, inputDirection, rng) {
    if (state.gameOver || state.paused) {
      return {
        gridSize: state.gridSize,
        snake: state.snake.map(clonePoint),
        direction: state.direction,
        pendingDirection: state.pendingDirection,
        food: state.food ? clonePoint(state.food) : null,
        score: state.score,
        gameOver: state.gameOver,
        paused: state.paused
      };
    }

    var nextDirection = resolveDirection(state, inputDirection || state.pendingDirection);
    var head = state.snake[0];
    var delta = DIR_DELTA[nextDirection];
    var nextHead = { x: head.x + delta.x, y: head.y + delta.y };
    var nextSnake = [nextHead].concat(state.snake.map(clonePoint));

    var ateFood =
      state.food &&
      nextHead.x === state.food.x &&
      nextHead.y === state.food.y;

    if (!ateFood) {
      nextSnake.pop();
    }

    var nextState = {
      gridSize: state.gridSize,
      snake: nextSnake,
      direction: nextDirection,
      pendingDirection: nextDirection,
      food: state.food ? clonePoint(state.food) : null,
      score: state.score + (ateFood ? 1 : 0),
      gameOver: false,
      paused: false
    };

    if (ateFood) {
      nextState.food = placeFood(nextSnake, state.gridSize, rng);
    }

    if (isCollision(nextState)) {
      nextState.gameOver = true;
    }

    return nextState;
  }

  var api = {
    createInitialState: createInitialState,
    step: step,
    placeFood: placeFood,
    isCollision: isCollision
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.SnakeCore = api;
})(typeof window !== 'undefined' ? window : globalThis);