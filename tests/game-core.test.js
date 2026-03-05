const assert = require('assert');
const {
  createInitialState,
  step,
  placeFood,
  isCollision
} = require('../src/game-core');

function constantRng(value) {
  return function () {
    return value;
  };
}

(function testMovement() {
  const state = createInitialState({ gridSize: 10, startLength: 3 }, constantRng(0));
  const next = step(state, 'right', constantRng(0));

  assert.deepStrictEqual(next.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y });
  assert.strictEqual(next.snake.length, state.snake.length);
})();

(function testGrowthAndScore() {
  const state = {
    gridSize: 6,
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 }
    ],
    direction: 'right',
    pendingDirection: 'right',
    food: { x: 3, y: 2 },
    score: 0,
    gameOver: false,
    paused: false
  };

  const next = step(state, 'right', constantRng(0));

  assert.strictEqual(next.snake.length, state.snake.length + 1);
  assert.strictEqual(next.score, 1);
  assert.ok(next.food);
  const occupiesFood = next.snake.some((p) => p.x === next.food.x && p.y === next.food.y);
  assert.strictEqual(occupiesFood, false);
})();

(function testWallCollision() {
  const state = {
    gridSize: 5,
    snake: [
      { x: 4, y: 2 },
      { x: 3, y: 2 }
    ],
    direction: 'right',
    pendingDirection: 'right',
    food: { x: 0, y: 0 },
    score: 0,
    gameOver: false,
    paused: false
  };

  const next = step(state, 'right', constantRng(0));
  assert.strictEqual(next.gameOver, true);
})();

(function testSelfCollision() {
  const state = {
    gridSize: 6,
    snake: [
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 }
    ],
    direction: 'up',
    pendingDirection: 'up',
    food: { x: 5, y: 5 },
    score: 0,
    gameOver: false,
    paused: false
  };

  const next = step(state, 'up', constantRng(0));
  assert.strictEqual(next.gameOver, true);
})();

(function testOppositeDirectionIgnored() {
  const state = {
    gridSize: 10,
    snake: [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 }
    ],
    direction: 'right',
    pendingDirection: 'right',
    food: { x: 9, y: 9 },
    score: 0,
    gameOver: false,
    paused: false
  };

  const next = step(state, 'left', constantRng(0));
  assert.strictEqual(next.direction, 'right');
})();

(function testRestartState() {
  const first = createInitialState({ gridSize: 12, startLength: 3 }, constantRng(0));
  const restarted = createInitialState({ gridSize: 12, startLength: 3 }, constantRng(0));

  assert.deepStrictEqual(restarted, first);
})();

(function testPlaceFoodNoOverlap() {
  const occupied = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 }
  ];

  const food = placeFood(occupied, 3, constantRng(0));
  assert.deepStrictEqual(food, { x: 0, y: 1 });
})();

(function testIsCollision() {
  assert.strictEqual(
    isCollision({
      gridSize: 4,
      snake: [
        { x: -1, y: 0 },
        { x: 0, y: 0 }
      ]
    }),
    true
  );

  assert.strictEqual(
    isCollision({
      gridSize: 4,
      snake: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 1 }
      ]
    }),
    true
  );
})();

console.log('All game-core tests passed.');
