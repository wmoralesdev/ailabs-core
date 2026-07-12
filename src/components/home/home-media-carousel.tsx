import { cn } from "@/lib/utils"
import {
  TRANSITION_MS,
  useHomeMediaCarousel,
} from "@/components/home/hooks/use-home-media-carousel"

type HomeMediaCarouselProps = {
  images: ReadonlyArray<string>
  alt: string
  intervalMs?: number
  className?: string
  imgClassName?: string
}

function HomeMediaCarousel({
  images,
  alt,
  intervalMs,
  className,
  imgClassName,
}: HomeMediaCarouselProps) {
  const {
    index,
    animate,
    displayIndex,
    trackImages,
    logicalCount,
  } = useHomeMediaCarousel(images, intervalMs)

  if (images.length === 0) {
    return null
  }

  return (
    <div
      className={cn("absolute inset-0", className)}
      aria-roledescription="carousel"
      aria-label={alt}
    >
      <div className="absolute inset-0 z-1 overflow-hidden">
        <div
          className={cn(
            "flex h-full",
            animate && "transition-transform ease-in-out"
          )}
          style={{
            width: `${trackImages.length * 100}%`,
            transform: `translate3d(-${(index / trackImages.length) * 100}%, 0, 0)`,
            transitionDuration: animate ? `${TRANSITION_MS}ms` : "0ms",
          }}
        >
          {trackImages.map((src, slideIndex) => (
            <div
              key={`${src}-${slideIndex}`}
              className="relative h-full shrink-0"
              style={{ width: `${100 / trackImages.length}%` }}
              aria-hidden={slideIndex !== displayIndex}
            >
              <img
                src={src}
                alt={slideIndex === displayIndex ? alt : ""}
                className={cn(
                  "absolute inset-0 size-full object-cover",
                  imgClassName
                )}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {logicalCount > 1 ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Slide indicators"
        >
          {images.map((src, slideIndex) => (
            <span
              key={src}
              role="tab"
              aria-current={slideIndex === displayIndex ? "true" : undefined}
              aria-label={`Slide ${slideIndex + 1} of ${logicalCount}`}
              className={cn(
                "h-1.5 rounded-full",
                slideIndex === displayIndex
                  ? "w-4 bg-on-dark"
                  : "w-1.5 bg-on-dark/40"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { HomeMediaCarousel }
