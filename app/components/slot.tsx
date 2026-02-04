export function Slot({
  index,
  char,
  isActive,
  isSelected,
  status,
}: {
  index: number
  char: string | undefined
  isActive: boolean
  isSelected?: boolean
  status: "idle" | "submitting" | "success" | "error"
}) {
  const hasValue = char !== undefined
  const showCaret = isActive && !hasValue && status === "idle" // caret setup

  // hardcoded for 4-digit passcode; could be made dynamic if needed
  const isFirst = index === 0
  const isLast = index === 3

  // active slot highlight
  const borderColor = isActive ? "border-highlight"
    : status === "error" ? "border-error"
    : status === "success" ? "border-highlight"
    : "border-border"

  const borderClasses = isActive
    ? `border-[3px] ${borderColor} relative z-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]`
    : `border ${borderColor}${!isFirst ? " -ml-px" : ""}`

  // radius setup (values defined in globals.css)
  const radiusClasses = isActive || isSelected
    ? isFirst
      ? "rounded-l-slot rounded-r-slot-inner"
      : isLast
        ? "rounded-l-slot-inner rounded-r-slot"
        : "rounded-slot-inner" // middle slots
    : isFirst
      ? "rounded-l-slot"
      : isLast
        ? "rounded-r-slot"
        : ""

  // select all (Cmd+A) setup
  const selectedClasses = isSelected
    ? "ring-[3px] ring-highlight relative z-10"
    : ""

  // color setup
  const colorClasses = {
    error: "bg-error-fill text-error",
    success: "bg-highlight text-text-1",
    submitting: "bg-fill-disabled text-text-disabled",
    idle: hasValue || isActive ? "bg-fill text-text-1" : "bg-fill",
  }[status]

  return (
    <div
      className={`
        relative flex h-32 w-21 items-center justify-center
        text-4xl font-medium transition-[background-color,border-color,box-shadow,color] duration-180
        ${borderClasses} ${radiusClasses} ${colorClasses} ${selectedClasses}
      `}
    >
      {hasValue ? (
        <span>{char}</span>
      ) : showCaret ? (
        <span className="animate-[blink_1s_step-end_infinite] font-light text-border">|</span>
      ) : null}
    </div>
  )
}
