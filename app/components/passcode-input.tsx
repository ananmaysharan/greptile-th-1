"use client"

import { useState, useReducer, useEffect, useRef } from "react"
import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { Slot } from "./slot"
import { FadingSpinner } from "./fading-spinner";
import { AnimatedCheckSquare } from "./animated-check-square";

type Status = "idle" | "submitting" | "success" | "error"

type PasscodeAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR" }
  | { type: "RESET" }


// manage status transitions based on actions
function statusReducer(state: Status, action: PasscodeAction): Status {
  switch (action.type) {
    case "SUBMIT":
      return state === "idle" ? "submitting" : state
    case "SUCCESS":
      return state === "submitting" ? "success" : state
    case "ERROR":
      return state === "submitting" ? "error" : state
    case "RESET":
      return state === "error" ? "idle" : state
    default:
      return state
  }
}

export function PasscodeInput() {
  const [value, setValue] = useState("")
  const [status, dispatch] = useReducer(statusReducer, "idle")
  const [isFocused, setIsFocused] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Derived state
  const activeIndex = Math.min(value.length, 3)

  // Focus management
  useEffect(() => {
    if (status === "idle") {
      inputRef.current?.focus()
    }
  }, [status])

  // Event handlers
  function handleSelect(e: React.SyntheticEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement
    setIsAllSelected(
      target.selectionStart === 0 &&
      target.selectionEnd === target.value.length &&
      target.value.length > 0
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "") // only numeric input
    setValue(digits)
    setIsAllSelected(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.length === 4) {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    dispatch({ type: "SUBMIT" })
    await new Promise((resolve) => setTimeout(resolve, 2000)) // simulated delay

    if (value === "1234") {
      dispatch({ type: "SUCCESS" })
    } else {
      dispatch({ type: "ERROR" })
      await new Promise((resolve) => setTimeout(resolve, 1500)) // error state timing
      setValue("")
      dispatch({ type: "RESET" })
    }
  }

  if (status === "success") {
    return (
      <>
        <button
          onClick={() => window.location.reload()}
          className="fixed top-4 right-4 flex items-center justify-center rounded-full text-text-1 border border-border p-2 cursor-pointer hover:bg-fill"
          aria-label="Refresh page"
        >
          <ArrowClockwiseIcon size={20} className="text-text-1" />
        </button>
        <div className="flex items-center gap-2">
          <AnimatedCheckSquare size={32} className="text-highlight" />
          <p className="text-lg font-medium text-text-1">Authenticated</p>
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="h-6 text-lg font-medium" aria-live="polite">
        {status === "submitting" && (
          <span className="text-text-1 flex items-center gap-2">
            <FadingSpinner size={24} />
            Verifying...
            </span>
        )}
        {status === "error" && (
          <span className="text-error">Invalid Code</span>
        )}
      </p>

      {/* Actual Input Setup (opacity 0 for accessibility and keyboard support) */}
      <div
        className="relative"
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={4}
          autoComplete="one-time-code"
          pattern="[0-9]*" // only numeric input
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            const len = e.target.value.length
            e.target.setSelectionRange(Math.min(len, 3), len)
            setIsFocused(true)
          }}
          onSelect={handleSelect}
          onBlur={() => { setIsFocused(false); setIsAllSelected(false) }}
          disabled={status !== "idle"}
          className="absolute inset-0 z-10 opacity-0"
          aria-label="Passcode input"
        />

        {/* Overlaid slots */}
        <div className={`flex ${status === "error" ? "motion-safe:animate-[shake_300ms_ease-in-out]" : ""}`}>
          {[0, 1, 2, 3].map((i) => {
            const isAnyActive = status === "idle" && isFocused && !isAllSelected
            return (
              <Slot
                key={i}
                index={i}
                char={value[i]}
                isActive={isAnyActive && i === activeIndex}
                isSelected={isAllSelected && value[i] !== undefined && status === "idle" && isFocused}
                status={status}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
