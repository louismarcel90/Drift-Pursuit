import readline from "node:readline";

const WIDTH = 110;
const HEIGHT = 30;
const TICK_MS = 100;
const COUNTDOWN_SECONDS = 3;

const PLAYER_SPRITE = ["           ", "  __/[]\\__", "  =O----O=="];

const POLICE_SPRITE = ["     +++ ", "  _/|_P_|\\_", "  ==O----O=="];

const OBSTACLE_SPRITE = ["||||", "||||"];

const EXIT_SPRITE = [
  "################",
  "#     EXIT     #",
  "#              #",
  "#              #",
  "################",
];

const PLAYER_WIDTH = Math.max(...PLAYER_SPRITE.map((line) => line.length));
const POLICE_WIDTH = Math.max(...POLICE_SPRITE.map((line) => line.length));

type Position = {
  readonly x: number;
  readonly y: number;
};

type GameStatus = "countdown" | "playing" | "won" | "lost";

type GameState = {
  readonly player: Position;
  readonly enemies: readonly Position[];
  readonly obstacles: readonly Position[];
  readonly exit: Position;
  readonly tick: number;
  readonly countdownTicks: number;
  readonly status: GameStatus;
  readonly lostReason?: string;
};

type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

const input: InputState = {
  up: false,
  down: false,
  left: false,
  right: false,
};

let shouldRestart = false;

function createInitialState(): GameState {
  return {
    player: { x: 4, y: Math.floor(HEIGHT / 2) },
    enemies: [
      { x: WIDTH - 26, y: 4 },
      { x: WIDTH - 30, y: HEIGHT - 10 },
      { x: WIDTH - 22, y: Math.floor(HEIGHT / 2) },
    ],
    obstacles: [
      { x: 30, y: 6 },
      { x: 48, y: 14 },
      { x: 66, y: 9 },
      { x: 82, y: 21 },
    ],
    exit: { x: WIDTH - 20, y: Math.floor(HEIGHT / 2) - 2 },
    tick: 0,
    countdownTicks: COUNTDOWN_SECONDS * 10,
    status: "countdown",
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function setupKeyboard(): void {
  readline.emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", (_str, key) => {
    if (key.sequence === "\u0003" || key.name === "q") {
      process.exit(0);
    }

    if (key.name === "r") {
      shouldRestart = true;
      return;
    }

    if (key.name === "up" || key.name === "w") input.up = true;
    if (key.name === "down" || key.name === "s") input.down = true;
    if (key.name === "left" || key.name === "a") input.left = true;
    if (key.name === "right" || key.name === "d") input.right = true;
  });
}

function clearInput(): void {
  input.up = false;
  input.down = false;
  input.left = false;
  input.right = false;
}

function movePlayer(player: Position): Position {
  let x = player.x;
  let y = player.y;

  if (input.up) y -= 1;
  if (input.down) y += 1;
  if (input.left) x -= 1;
  if (input.right) x += 1;

  return {
    x: clamp(x, 1, WIDTH - PLAYER_WIDTH - 1),
    y: clamp(y, 1, HEIGHT - PLAYER_SPRITE.length - 1),
  };
}

function moveEnemyTowardPlayer(enemy: Position, player: Position, tick: number): Position {
  if (tick % 3 !== 0) return enemy;

  const dx = Math.sign(player.x - enemy.x);
  const dy = Math.sign(player.y - enemy.y);
  const moveHorizontally = Math.abs(player.x - enemy.x) >= Math.abs(player.y - enemy.y);

  return {
    x: clamp(enemy.x + (moveHorizontally ? dx : 0), 1, WIDTH - POLICE_WIDTH - 1),
    y: clamp(enemy.y + (moveHorizontally ? 0 : dy), 1, HEIGHT - POLICE_SPRITE.length - 1),
  };
}

function moveObstacles(obstacles: readonly Position[], tick: number): Position[] {
  return obstacles.map((obstacle, index) => {
    const nextX = obstacle.x - 1;

    if (nextX <= 1) {
      return {
        x: WIDTH - 24,
        y: 2 + ((tick + index * 7) % (HEIGHT - 8)),
      };
    }

    return {
      x: nextX,
      y: obstacle.y,
    };
  });
}

function spriteHit(
  a: Position,
  aSprite: readonly string[],
  b: Position,
  bSprite: readonly string[],
): boolean {
  const aWidth = Math.max(...aSprite.map((line) => line.length));
  const bWidth = Math.max(...bSprite.map((line) => line.length));

  return (
    a.x < b.x + bWidth &&
    a.x + aWidth > b.x &&
    a.y < b.y + bSprite.length &&
    a.y + aSprite.length > b.y
  );
}

function updateGame(state: GameState): GameState {
  if (state.status === "countdown") {
    const nextCountdownTicks = state.countdownTicks - 1;

    return {
      ...state,
      countdownTicks: nextCountdownTicks,
      status: nextCountdownTicks <= 0 ? "playing" : "countdown",
    };
  }

  if (state.status !== "playing") return state;

  const nextTick = state.tick + 1;
  const nextPlayer = movePlayer(state.player);
  const nextEnemies = state.enemies.map((enemy) =>
    moveEnemyTowardPlayer(enemy, nextPlayer, nextTick),
  );
  const nextObstacles = moveObstacles(state.obstacles, nextTick);

  if (spriteHit(nextPlayer, PLAYER_SPRITE, state.exit, EXIT_SPRITE)) {
    return {
      ...state,
      player: nextPlayer,
      enemies: nextEnemies,
      obstacles: nextObstacles,
      tick: nextTick,
      status: "won",
    };
  }

  if (
    nextObstacles.some((obstacle) =>
      spriteHit(nextPlayer, PLAYER_SPRITE, obstacle, OBSTACLE_SPRITE),
    )
  ) {
    return {
      ...state,
      player: nextPlayer,
      enemies: nextEnemies,
      obstacles: nextObstacles,
      tick: nextTick,
      status: "lost",
      lostReason: "Tu as percuté un obstacle.",
    };
  }

  if (nextEnemies.some((enemy) => spriteHit(nextPlayer, PLAYER_SPRITE, enemy, POLICE_SPRITE))) {
    return {
      ...state,
      player: nextPlayer,
      enemies: nextEnemies,
      obstacles: nextObstacles,
      tick: nextTick,
      status: "lost",
      lostReason: "La police t’a rattrapé.",
    };
  }

  return {
    ...state,
    player: nextPlayer,
    enemies: nextEnemies,
    obstacles: nextObstacles,
    tick: nextTick,
    status: "playing",
  };
}

function putSprite(grid: string[][], position: Position, sprite: readonly string[]): void {
  for (let yOffset = 0; yOffset < sprite.length; yOffset += 1) {
    const row = grid[position.y + yOffset];
    const line = sprite[yOffset];

    if (row === undefined || line === undefined) continue;

    for (let xOffset = 0; xOffset < line.length; xOffset += 1) {
      const char = line[xOffset];

      if (char === undefined || char === " ") continue;

      const x = position.x + xOffset;

      if (x <= 0 || x >= WIDTH - 1) continue;

      row[x] = char;
    }
  }
}

function render(state: GameState): string {
  const grid: string[][] = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => " "),
  );

  const topRow = grid[0];
  const bottomRow = grid[HEIGHT - 1];

  for (let x = 0; x < WIDTH; x += 1) {
    if (topRow !== undefined) topRow[x] = "-";
    if (bottomRow !== undefined) bottomRow[x] = "-";
  }

  for (let y = 0; y < HEIGHT; y += 1) {
    const row = grid[y];

    if (row !== undefined) {
      row[0] = "|";
      row[WIDTH - 1] = "|";
    }
  }

  putSprite(grid, state.exit, EXIT_SPRITE);

  for (const obstacle of state.obstacles) {
    putSprite(grid, obstacle, OBSTACLE_SPRITE);
  }

  for (const enemy of state.enemies) {
    putSprite(grid, enemy, POLICE_SPRITE);
  }

  putSprite(grid, state.player, PLAYER_SPRITE);

  const countdownSeconds = Math.ceil(state.countdownTicks / 10);
  const nearestPoliceDistance = Math.min(
    ...state.enemies.map(
      (enemy) => Math.abs(enemy.x - state.player.x) + Math.abs(enemy.y - state.player.y),
    ),
  );

  return [
    "DRIFT PURSUIT GRID — REALTIME ESCAPE",
    "",
    state.status === "countdown"
      ? `STARTING IN ${countdownSeconds}...`
      : "GO! Reach the EXIT gate.",
    "",
    "Legend:",
    "Fugitif:",
    PLAYER_SPRITE.join("\n"),
    "",
    "Police:",
    POLICE_SPRITE.join("\n"),
    "",
    "Obstacle: ||||",
    "Exit: EXIT gate",
    "",
    grid.map((row) => row.join("")).join("\n"),
    "",
    "HUD",
    `Status      : ${state.status.toUpperCase()}`,
    `Scenario    : realtime.pursuit`,
    `Tick        : ${state.tick}`,
    `Goal        : atteindre EXIT`,
    `Nearest P   : ${nearestPoliceDistance}`,
    state.status === "lost" ? `Lost reason : ${state.lostReason}` : "",
    state.status === "won" ? "RESULT      : YOU WON. Tu as atteint la sortie." : "",
    "",
    "Controls: Arrow keys / WASD. Restart: R. Quit: Q or Ctrl+C",
  ]
    .filter(Boolean)
    .join("\n");
}

export function runRealtimeGame(): void {
  setupKeyboard();

  let state = createInitialState();

  const loop = (): void => {
    if (shouldRestart) {
      state = createInitialState();
      shouldRestart = false;
    }

    state = updateGame(state);

    console.clear();
    console.log(render(state));

    clearInput();

    setTimeout(loop, TICK_MS);
  };

  loop();
}

runRealtimeGame();
