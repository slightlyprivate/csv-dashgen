#!/usr/bin/env node
// Generates placeholder app icons and the OG/social preview image from the
// existing Wordmark motif (dark rounded square + amber 2x2 grid), using only
// Node's built-in zlib for PNG encoding — no image libraries required.
//
// These are placeholders. Replace with real designed assets when available;
// re-run this script (`node scripts/generate-icons.mjs`) is not required
// once that happens — just overwrite the PNGs in public/ directly.

import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

const INK_950 = [12, 14, 19]
const AMBER_400 = [251, 191, 36]

let crcTable
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      }
      crcTable[n] = c >>> 0
    }
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 6 // color type: RGBA
  const ihdr = chunk('IHDR', ihdrData)

  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter type: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = chunk('IDAT', deflateSync(raw, { level: 9 }))
  const iend = chunk('IEND', Buffer.alloc(0))
  return Buffer.concat([sig, ihdr, idat, iend])
}

function createCanvas(w, h, bg) {
  const buf = Buffer.alloc(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    buf[i * 4] = bg[0]
    buf[i * 4 + 1] = bg[1]
    buf[i * 4 + 2] = bg[2]
    buf[i * 4 + 3] = 255
  }
  return { buf, w, h }
}

function blendPixel(canvas, x, y, rgb, alpha) {
  if (x < 0 || y < 0 || x >= canvas.w || y >= canvas.h) return
  const i = (y * canvas.w + x) * 4
  canvas.buf[i] = Math.round(rgb[0] * alpha + canvas.buf[i] * (1 - alpha))
  canvas.buf[i + 1] = Math.round(
    rgb[1] * alpha + canvas.buf[i + 1] * (1 - alpha)
  )
  canvas.buf[i + 2] = Math.round(
    rgb[2] * alpha + canvas.buf[i + 2] * (1 - alpha)
  )
  canvas.buf[i + 3] = 255
}

// Rounded rect with per-pixel corner rounding via distance check, plus a
// uniform fill alpha (used to reproduce the Wordmark's translucent cells).
function fillRoundedRect(canvas, x0, y0, w, h, r, rgb, alpha = 1) {
  const x0i = Math.round(x0)
  const y0i = Math.round(y0)
  const wi = Math.round(w)
  const hi = Math.round(h)
  for (let y = 0; y < hi; y++) {
    for (let x = 0; x < wi; x++) {
      let inside = true
      if (x < r && y < r) {
        const dx = r - x
        const dy = r - y
        inside = dx * dx + dy * dy <= r * r
      } else if (x >= wi - r && y < r) {
        const dx = x - (wi - r - 1)
        const dy = r - y
        inside = dx * dx + dy * dy <= r * r
      } else if (x < r && y >= hi - r) {
        const dx = r - x
        const dy = y - (hi - r - 1)
        inside = dx * dx + dy * dy <= r * r
      } else if (x >= wi - r && y >= hi - r) {
        const dx = x - (wi - r - 1)
        const dy = y - (hi - r - 1)
        inside = dx * dx + dy * dy <= r * r
      }
      if (inside) blendPixel(canvas, x0i + x, y0i + y, rgb, alpha)
    }
  }
}

// Draws the Wordmark motif (dark rounded square + 2x2 amber grid, corner
// cells lighter) scaled to fit an sxs box with the given top-left offset.
function drawMark(canvas, offsetX, offsetY, s) {
  const unit = s / 28
  fillRoundedRect(canvas, offsetX, offsetY, s, s, 6 * unit, INK_950)
  const cell = 7 * unit
  const gap = 2 * unit
  const pad = 6 * unit
  const r = 1.5 * unit
  fillRoundedRect(
    canvas,
    offsetX + pad,
    offsetY + pad,
    cell,
    cell,
    r,
    AMBER_400,
    0.95
  )
  fillRoundedRect(
    canvas,
    offsetX + pad + cell + gap,
    offsetY + pad,
    cell,
    cell,
    r,
    AMBER_400,
    0.55
  )
  fillRoundedRect(
    canvas,
    offsetX + pad,
    offsetY + pad + cell + gap,
    cell,
    cell,
    r,
    AMBER_400,
    0.55
  )
  fillRoundedRect(
    canvas,
    offsetX + pad + cell + gap,
    offsetY + pad + cell + gap,
    cell,
    cell,
    r,
    AMBER_400,
    0.95
  )
}

function writeIcon(name, size) {
  const canvas = createCanvas(size, size, INK_950)
  drawMark(canvas, 0, 0, size)
  writeFileSync(
    path.join(publicDir, name),
    encodePNG(size, size, canvas.buf)
  )
  console.log(`wrote ${name} (${size}x${size})`)
}

function writeOgImage() {
  const w = 1200
  const h = 630
  const canvas = createCanvas(w, h, INK_950)

  // Faint grid-paper texture, echoing the app's empty-state grid motif.
  const step = 40
  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y++) blendPixel(canvas, x, y, AMBER_400, 0.05)
  }
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x++) blendPixel(canvas, x, y, AMBER_400, 0.05)
  }

  const markSize = 280
  drawMark(canvas, (w - markSize) / 2, (h - markSize) / 2, markSize)

  writeFileSync(path.join(publicDir, 'og-image.png'), encodePNG(w, h, canvas.buf))
  console.log(`wrote og-image.png (${w}x${h})`)
}

writeIcon('icon-32.png', 32)
writeIcon('icon-192.png', 192)
writeIcon('icon-512.png', 512)
writeIcon('apple-touch-icon.png', 180)
writeOgImage()
