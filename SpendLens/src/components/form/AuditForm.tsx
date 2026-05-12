"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ExtendedUserInput,ToolEntry,ToolName } from "@/src/lib/types"
import { runAudit } from "@/src/lib/audit-engine"
import { StepOne } from "./StepOne"
import { StepTwo, PLANS } from "./StepTwo"
import { StepThree } from "./StepThree"

const STORAGE_KEY = "spendlens_audit_input"

const defaultInput: ExtendedUserInput = {
  teamSize: 1,
  useCase: "coding",
  usageIntensity: "moderate",
  hasComplianceRequirements: false,
  hasHitLimits: {},
  tools: [],
}

export function AuditForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [input, setInput] = useState<ExtendedUserInput>(defaultInput)
  const [selectedTools, setSelectedTools] = useState<Set<ToolName>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── Load from localStorage ─────────────────────────────────────────────────

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed: ExtendedUserInput = JSON.parse(saved)
        setInput(parsed)
        setSelectedTools(
          new Set<ToolName>(parsed.tools.map((t: ToolEntry) => t.name))
        )
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
  }, [input])

  function updateField<K extends keyof ExtendedUserInput>(
    field: K,
    value: ExtendedUserInput[K]
  ) {
    setInput((prev) => ({ ...prev, [field]: value }))
  }

  function toggleTool(toolName: ToolName) {
    const next = new Set(selectedTools)
    if (next.has(toolName)) {
      next.delete(toolName)
      setInput((prev) => ({
        ...prev,
        tools: prev.tools.filter((t) => t.name !== toolName),
      }))
    } else {
      next.add(toolName)
      setInput((prev) => ({
        ...prev,
        tools: [
          ...prev.tools,
          {
            name: toolName,
            plan: PLANS[toolName][1] ?? PLANS[toolName][0],
            seats: 1,
            monthlySpend: 0,
          },
        ],
      }))
    }
    setSelectedTools(next)
  }

  function updateTool(
    toolName: ToolName,
    field: string,
    value: string | number
  ) {
    setInput((prev) => ({
      ...prev,
      tools: prev.tools.map((t) =>
        t.name === toolName ? { ...t, [field]: value } : t
      ),
    }))
  }

  function toggleHitLimits(toolName: string, value: boolean) {
    setInput((prev) => ({
      ...prev,
      hasHitLimits: { ...prev.hasHitLimits, [toolName]: value },
    }))
  }

  async function handleSubmit() {
  setIsSubmitting(true)
  try {
    // Call API route instead of running engine client-side
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })

    const data = await res.json()

    // Store result for results page
    localStorage.setItem("spendlens_audit_result", JSON.stringify(data.result))
    localStorage.setItem("spendlens_audit_input_final", JSON.stringify(input))

    // Redirect to shareable URL if ID exists, otherwise results
    if (data.id) {
      router.push(`/results?id=${data.id}`)
    } else {
      router.push("/results")
    }
  } catch {
    setIsSubmitting(false)
  }
}

  return (
    <div>
      {/* Progress bar */}
      <div className="flex gap-1 mb-10">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="h-0.5 flex-1 transition-all duration-300"
            style={{
              background: s <= step ? "var(--savings-green)" : "#1a1a1a",
              boxShadow:
                s <= step ? "0 0 8px rgba(0,255,136,0.4)" : "none",
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <StepOne
          input={input}
          onUpdate={updateField}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepTwo
          selectedTools={selectedTools}
          tools={input.tools}
          onToggleTool={toggleTool}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <StepThree
          tools={input.tools}
          hasHitLimits={input.hasHitLimits}
          onUpdateTool={updateTool}
          onToggleHitLimits={toggleHitLimits}
          onToggleTool={toggleTool}
          onSubmit={handleSubmit}
          onBack={() => setStep(2)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}