import { Universe, Cell } from "wasm-game-of-life"
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg"

const CELL_SIZE = 6
const GRID_WIDTH = 2
const DEAD_COLOR = "#fff"
const ALIVE_COLOR = "#222"
const TICK_INTERVAL_MS = 200

const universe = Universe.new()
const width = universe.width()
const height = universe.height()

const canvas = document.getElementById("game-of-life-canvas")
canvas.height = (CELL_SIZE + GRID_WIDTH) * height + GRID_WIDTH
canvas.width = (CELL_SIZE + GRID_WIDTH) * width + GRID_WIDTH

const ctx = canvas.getContext("2d")

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
        col * (CELL_SIZE + GRID_WIDTH) + GRID_WIDTH,
        row * (CELL_SIZE + GRID_WIDTH) + GRID_WIDTH,
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
    drawCells()
    universe.tick()
  }
  setTimeout(() => requestAnimationFrame(renderLoop))
}

requestAnimationFrame(renderLoop)
