import { cn } from "cn"


type SkeletonType = 'card' | 'paragraph' | 'table' | 'item' | 'image-with-caption'
type ImageCaptionStyle = 'card-style' | 'single-line caption'

interface SkeletonProps {
  type: SkeletonType
  paragraphs?: number
  rows?: number
  columns?: number
  captionStyle?: ImageCaptionStyle
  className?: string
}

export function SkeletonShimmer(props: SkeletonProps) {
  const {
    type,
    paragraphs = 3,
    rows = 3,
    columns = 4,
    captionStyle = 'card-style',
    className
  } = props

  const paragraphNodes = Array.from({ length: paragraphs }, (_, index) => (
    <div key={index} className={'h-4 rounded-md bg-slate-200/70 mb-3 last:mb-0'} />
  ))

  const tableRows = Array.from({ length: rows }, (_, rowIndex) => (
    <div key={rowIndex} className="flex gap-3 mb-2 last:mb-0">
      {Array.from({ length: columns }, (_, colIndex) => (
        <div key={colIndex} className="flex-1 h-8 rounded-md bg-slate-200/70" />
      ))}
    </div>
  ))

  const imageWithCaption = (
    <div className={cn('space-y-3', className)}>
      <div className="h-40 rounded-lg bg-slate-200/70" />
      <div
        className={`h-4 rounded-md bg-slate-200/70 ${
          captionStyle === 'single-line caption' ? 'w-1/2' : 'w-full'
        }`}
      />
      {captionStyle === 'card-style' && <div className="h-4 rounded-md bg-slate-200/70 w-3/4" />}
    </div>
  )

  switch (type) {
    case 'card':
      return (
        <div
          className={cn('space-y-4 rounded-xl border border-slate-200 p-4 shadow-sm', className)}
        >
          <div className="h-6 w-1/3 rounded-md bg-slate-200/70" />
          <div className="h-4 w-2/3 rounded-md bg-slate-200/70" />
          <div className="space-y-2">{paragraphNodes}</div>
        </div>
      )
    case 'paragraph':
      return <div className={cn('space-y-3', className)}>{paragraphNodes}</div>
    case 'table':
      return <div className={cn('space-y-2', className)}>{tableRows}</div>
    case 'item':
      return (
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl border border-slate-200 p-4',
            className
          )}
        >
          <div className="h-14 w-14 rounded-md bg-slate-200/70" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded-md bg-slate-200/70" />
            <div className="h-4 w-1/2 rounded-md bg-slate-200/70" />
          </div>
        </div>
      )
    case 'image-with-caption':
      return imageWithCaption
    default:
      return null
  }
}
