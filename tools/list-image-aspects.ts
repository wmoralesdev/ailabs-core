#!/usr/bin/env node
import * as fs from "node:fs"
import * as path from "node:path"
import sharp from "sharp"

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".tiff",
  ".tif",
  ".bmp",
  ".avif",
  ".webp",
])

const COMMON_RATIOS = [
  { w: 21, h: 9 },
  { w: 16, h: 9 },
  { w: 3, h: 2 },
  { w: 4, h: 3 },
  { w: 5, h: 4 },
  { w: 1, h: 1 },
  { w: 4, h: 5 },
  { w: 3, h: 4 },
  { w: 2, h: 3 },
  { w: 9, h: 16 },
  { w: 9, h: 21 },
] as const

type Options = {
  inputDir: string
  dirLabel: string
  recursive: boolean
}

type AspectInfo = {
  ratio: string
  orientation: "landscape" | "portrait" | "square"
}

function printUsage() {
  console.log(`Usage: pnpm images:list <directory> [options]

List images with name, directory path, aspect ratio, and orientation.

Options:
  -r, --recursive      Include subdirectories
  -h, --help           Show this help

Examples:
  pnpm images:list ./public/carousel
  pnpm images:list ./public -r
`)
}

function parseArgs(argv: string[]): Options | null {
  if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
    printUsage()
    return null
  }

  let inputArg = ""
  let recursive = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === "-r" || arg === "--recursive") {
      recursive = true
      continue
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`)
    }

    if (!inputArg) {
      inputArg = arg
      continue
    }

    throw new Error(`Unexpected argument: ${arg}`)
  }

  if (!inputArg) {
    throw new Error("Directory path is required")
  }

  const inputDir = path.resolve(inputArg)

  return {
    inputDir,
    dirLabel: formatDirLabel(inputDir, inputArg),
    recursive,
  }
}

function formatDirLabel(resolvedDir: string, rawArg: string): string {
  if (!path.isAbsolute(rawArg)) {
    return rawArg.startsWith("./") ? rawArg : `./${rawArg}`
  }

  const relative = path.relative(process.cwd(), resolvedDir)
  if (relative && !relative.startsWith("..")) {
    return relative.startsWith("./") ? relative : `./${relative}`
  }

  return resolvedDir
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)

  while (y !== 0) {
    const temp = y
    y = x % y
    x = temp
  }

  return x
}

function describeAspectRatio(width: number, height: number): AspectInfo {
  if (width === height) {
    return { ratio: "1:1", orientation: "square" }
  }

  const orientation: AspectInfo["orientation"] =
    width > height ? "landscape" : "portrait"

  const divisor = gcd(width, height)
  const simplifiedW = width / divisor
  const simplifiedH = height / divisor
  const actual = width / height

  let closest: (typeof COMMON_RATIOS)[number] = COMMON_RATIOS[0]
  let closestDelta = Number.POSITIVE_INFINITY

  for (const candidate of COMMON_RATIOS) {
    const candidateValue = candidate.w / candidate.h
    const delta = Math.abs(actual - candidateValue)
    if (delta < closestDelta) {
      closest = candidate
      closestDelta = delta
    }
  }

  const snappedValue = closest.w / closest.h
  const useSnap = Math.abs(actual - snappedValue) / snappedValue <= 0.02

  const ratio = useSnap
    ? `${closest.w}:${closest.h}`
    : `${simplifiedW}:${simplifiedH}`

  return { ratio, orientation }
}

function collectImages(dir: string, recursive: boolean): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (recursive) {
        files.push(...collectImages(fullPath, recursive))
      }
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (IMAGE_EXTENSIONS.has(ext)) {
      files.push(fullPath)
    }
  }

  return files.sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b), undefined, {
      numeric: true,
      sensitivity: "base",
    })
  )
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (!options) {
    return
  }

  if (!fs.existsSync(options.inputDir)) {
    throw new Error(`Directory not found: ${options.inputDir}`)
  }

  const stat = fs.statSync(options.inputDir)
  if (!stat.isDirectory()) {
    throw new Error(`Not a directory: ${options.inputDir}`)
  }

  const images = collectImages(options.inputDir, options.recursive)

  if (images.length === 0) {
    console.log("No images found.")
    return
  }

  for (const filePath of images) {
    const metadata = await sharp(filePath).metadata()
    const width = metadata.width
    const height = metadata.height

    if (!width || !height) {
      console.log(
        `${path.basename(filePath)} ${options.dirLabel} unknown unknown`
      )
      continue
    }

    const { ratio, orientation } = describeAspectRatio(width, height)
    console.log(
      `${path.basename(filePath)} ${options.dirLabel} ${ratio} ${orientation}`
    )
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error: ${message}`)
  process.exit(1)
})
