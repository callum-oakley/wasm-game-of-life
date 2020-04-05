import { Universe, Cell } from "wasm-game-of-life"
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg"

const CELL_SIZE = 6
const SPACING = 2
const DEAD_COLOR = "#fff"
const ALIVE_COLOR = "#222"
const TICK_INTERVAL_MS = 200
const DENSITY = 0.1
const WIDTH = 128
const HEIGHT = 128

const u = Universe.new(WIDTH, HEIGHT, DENSITY)

const canvas = document.getElementById("game-of-life-canvas")
canvas.height = (CELL_SIZE + SPACING) * u.height() + SPACING
canvas.width = (CELL_SIZE + SPACING) * u.width() + SPACING

const ctx = canvas.getContext("2d")

const getIndex = (row, column) => {
  return row * u.width() + column
}

const bitIsSet = (n, arr) => {
  const mask = 1 << n % 8
  return (arr[Math.floor(n / 8)] & mask) === mask
}

const drawCells = () => {
  const cellsPtr = u.cells()
  const cells = new Uint8Array(
    memory.buffer,
    cellsPtr,
    (u.width() * u.height()) / 8,
  )

  ctx.beginPath()

  for (let row = 0; row < u.height(); row++) {
    for (let col = 0; col < u.width(); col++) {
      ctx.fillStyle = bitIsSet(getIndex(row, col), cells)
        ? ALIVE_COLOR
        : DEAD_COLOR
      ctx.fillRect(
        col * (CELL_SIZE + SPACING) + SPACING,
        row * (CELL_SIZE + SPACING) + SPACING,
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
    drawCells()
    u.tick()
    lastTick = now
  }
  requestAnimationFrame(renderLoop)
}

requestAnimationFrame(renderLoop)
