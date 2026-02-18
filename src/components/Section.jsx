import { cn } from '@/lib/utils'

export default function Section({
  title,
  description,
  children,
  className,
  headerAction,
}) {
  return (
    <div className={cn('', className)}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
