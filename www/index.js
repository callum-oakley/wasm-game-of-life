import { Universe, Cell } from "wasm-game-of-life"
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg"

const CELL_SIZE = 8
const GRID_COLOR = "#eee"
const DEAD_COLOR = "#fff"
const ALIVE_COLOR = "#222"
const TICK_INTERVAL_MS = 200

const universe = Universe.new()
const width = universe.width()
const height = universe.height()

const canvas = document.getElementById("game-of-life-canvas")
canvas.height = (CELL_SIZE + 1) * height + 1
canvas.width = (CELL_SIZE + 1) * width + 1

const ctx = canvas.getContext("2d")

const drawGrid = () => {
  ctx.beginPath()
  ctx.strokeStyle = GRID_COLOR

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0)
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1)
  }

  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1)
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1)
  }

  ctx.stroke()
}

const getIndex = (row, column) => {
  return row * width + column
}

const bitIsSet = (n, arr) => {
  const mask = 1 << n % 8
  return (arr[Math.floor(n / 8)] & mask) === mask
}

const drawCells = () => {
  const cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8)

  ctx.beginPath()

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      ctx.fillStyle = bitIsSet(getIndex(row, col), cells)
        ? ALIVE_COLOR
        : DEAD_COLOR

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE,
      )
    }
  }

  ctx.stroke()
}

let lastTick
const renderLoop = () => {
  const now = Date.now()
  if (!lastTick || now > lastTick + TICK_INTERVAL_MS) {
    lastTick = now
    drawGrid()
    drawCells()
    universe.tick()
  }
  setTimeout(() => requestAnimationFrame(renderLoop))
}

requestAnimationFrame(renderLoop)
