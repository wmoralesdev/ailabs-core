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
])

type Options = {
  inputDir: string
  outputDir: string | null
  quality: number
  recursive: boolean
  overwrite: boolean
  sequential: boolean
  deleteOriginals: boolean
}

function printUsage() {
  console.log(`Usage: pnpm compress:webp <directory> [options]

Compress images in a directory to WebP.

Options:
  -o, --output <dir>   Output directory (default: same as input)
  -q, --quality <n>    WebP quality 1-100 (default: 80)
  -r, --recursive      Include subdirectories
  -s, --sequential     Name outputs 1.webp, 2.webp, … continuing existing numbers
  --overwrite          Replace existing .webp files
  -d, --delete-originals
                       Delete source files after successful conversion
  -h, --help           Show this help

Examples:
  pnpm compress:webp ./public/images
  pnpm compress:webp ./public/carousel -s
  pnpm compress:webp ./public/carousel -s -d
  pnpm compress:webp ./assets -o ./assets/webp -q 75 -r
`)
}

function parseArgs(argv: string[]): Options | null {
  if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
    printUsage()
    return null
  }

  let inputDir = ""
  let outputDir: string | null = null
  let quality = 80
  let recursive = false
  let overwrite = false
  let sequential = false
  let deleteOriginals = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === "-o" || arg === "--output") {
      const value = argv[++i]
      if (!value) {
        throw new Error("Missing value for --output")
      }
      outputDir = value
      continue
    }

    if (arg === "-q" || arg === "--quality") {
      const value = argv[++i]
      if (!value) {
        throw new Error("Missing value for --quality")
      }
      quality = Number(value)
      if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
        throw new Error("Quality must be an integer between 1 and 100")
      }
      continue
    }

    if (arg === "-r" || arg === "--recursive") {
      recursive = true
      continue
    }

    if (arg === "--overwrite") {
      overwrite = true
      continue
    }

    if (arg === "-s" || arg === "--sequential") {
      sequential = true
      continue
    }

    if (arg === "-d" || arg === "--delete-originals") {
      deleteOriginals = true
      continue
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`)
    }

    if (!inputDir) {
      inputDir = arg
      continue
    }

    throw new Error(`Unexpected argument: ${arg}`)
  }

  if (!inputDir) {
    throw new Error("Directory path is required")
  }

  return {
    inputDir: path.resolve(inputDir),
    outputDir: outputDir ? path.resolve(outputDir) : null,
    quality,
    recursive,
    overwrite,
    sequential,
    deleteOriginals,
  }
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

  return files.sort()
}

function outputPathFor(
  filePath: string,
  inputDir: string,
  outputDir: string | null
): string {
  if (!outputDir) {
    return filePath.replace(/\.[^.]+$/, ".webp")
  }

  const relative = path.relative(inputDir, filePath)
  return path.join(outputDir, relative).replace(/\.[^.]+$/, ".webp")
}

const SEQUENTIAL_WEBP_PATTERN = /^(\d+)\.webp$/i

function getNextSequentialIndex(dir: string): number {
  if (!fs.existsSync(dir)) {
    return 1
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let max = 0

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue
    }

    const match = SEQUENTIAL_WEBP_PATTERN.exec(entry.name)
    if (match) {
      max = Math.max(max, Number(match[1]))
    }
  }

  return max + 1
}

function nextSequentialPath(dir: string, index: number, overwrite: boolean): {
  path: string
  index: number
} {
  let nextIndex = index

  while (true) {
    const destination = path.join(dir, `${nextIndex}.webp`)
    if (overwrite || !fs.existsSync(destination)) {
      return { path: destination, index: nextIndex }
    }
    nextIndex++
  }
}

async function compressImage(
  filePath: string,
  destination: string,
  quality: number
): Promise<{ before: number; after: number }> {
  const before = fs.statSync(filePath).size

  await fs.promises.mkdir(path.dirname(destination), { recursive: true })

  await sharp(filePath)
    .rotate()
    .webp({ quality, effort: 4 })
    .toFile(destination)

  const after = fs.statSync(destination).size
  return { before, after }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
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

  const outputBase = options.outputDir ?? options.inputDir
  let nextIndex = options.sequential
    ? getNextSequentialIndex(outputBase)
    : 0

  if (options.sequential) {
    console.log(
      `Sequential naming in ${outputBase} starting at ${nextIndex}.webp`
    )
  }

  let converted = 0
  let skipped = 0
  let deleted = 0
  let beforeTotal = 0
  let afterTotal = 0

  for (const filePath of images) {
    let destination: string

    if (options.sequential) {
      const next = nextSequentialPath(outputBase, nextIndex, options.overwrite)
      destination = next.path
      nextIndex = next.index + 1
    } else {
      destination = outputPathFor(
        filePath,
        options.inputDir,
        options.outputDir
      )
    }

    if (
      !options.sequential &&
      !options.overwrite &&
      fs.existsSync(destination) &&
      path.resolve(filePath) !== path.resolve(destination)
    ) {
      skipped++
      console.log(`skip  ${path.relative(options.inputDir, filePath)}`)
      continue
    }

    const { before, after } = await compressImage(
      filePath,
      destination,
      options.quality
    )

    if (options.deleteOriginals) {
      await fs.promises.unlink(filePath)
      deleted++
    }

    converted++
    beforeTotal += before
    afterTotal += after

    const saved = before > 0 ? Math.round((1 - after / before) * 100) : 0
    const label = path.relative(options.inputDir, filePath)
    const outputLabel = path.relative(outputBase, destination)
    const deletedLabel = options.deleteOriginals ? ", original deleted" : ""
    console.log(
      `done  ${label} -> ${outputLabel} (${formatBytes(before)} -> ${formatBytes(after)}, ${saved}% smaller${deletedLabel})`
    )
  }

  const totalSaved =
    beforeTotal > 0 ? Math.round((1 - afterTotal / beforeTotal) * 100) : 0

  const deletedSummary = options.deleteOriginals
    ? `, deleted ${deleted} original(s)`
    : ""

  console.log("")
  console.log(
    `Converted ${converted} image(s), skipped ${skipped}${deletedSummary}. Total: ${formatBytes(beforeTotal)} -> ${formatBytes(afterTotal)} (${totalSaved}% smaller)`
  )
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error: ${message}`)
  process.exit(1)
})
