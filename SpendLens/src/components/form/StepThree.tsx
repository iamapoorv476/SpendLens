
"use client"

import { ToolEntry, ToolName, ExtendedUserInput } from "@/lib/types"
import { PLANS } from "./StepTwo"

type StepThreeProps = {
  tools: ToolEntry[]
  hasHitLimits: Partial<Record<string, boolean>>
  onUpdateTool: (
    toolName: ToolName,
    field: string,
    value: string | number
  ) => void
  onToggleHitLimits: (toolName: string, value: boolean) => void
  onToggleTool: (toolName: ToolName) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function StepThree({
  tools,
  hasHitLimits,
  onUpdateTool,
  onToggleHitLimits,
  onToggleTool,
  onSubmit,
  onBack,
  isSubmitting,
}: StepThreeProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="mono text-xs text-[#444] tracking-widest mb-2">
          STEP 03
        </p>
        <h2 className="text-2xl font-bold mb-1">Your spending details</h2>
        <p className="text-sm text-[#555]">
          Approximate numbers are fine. We will show you exactly what we find.
        </p>
      </div>

      {/* Per tool inputs */}
      <div className="space-y-4">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="border border-[#1a1a1a] p-5 space-y-4 hover:border-[#222] transition-colors"
          >
            {/* Tool header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{tool.name}</h3>
              <button
                onClick={() => onToggleTool(tool.name)}
                className="text-xs text-[#333] hover:text-[#555] mono transition-colors"
              >
                remove
              </button>
            </div>

            {/* Plan / Seats / Spend */}
            <div className="grid grid-cols-3 gap-3">
              {/* Plan */}
              <div className="space-y-1">
                <label className="text-xs text-[#444] block">Plan</label>
                <select
                  value={tool.plan}
                  onChange={(e) =>
                    onUpdateTool(tool.name, "plan", e.target.value)
                  }
                  className="w-full bg-[#111] border border-[#222] px-2 py-2 text-xs text-[#ccc] focus:border-[#00ff88] focus:outline-none transition-colors"
                >
                  {PLANS[tool.name].map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seats */}
              <div className="space-y-1">
                <label className="text-xs text-[#444] block">Seats</label>
                <input
                  type="number"
                  min={1}
                  value={tool.seats}
                  onChange={(e) =>
                    onUpdateTool(
                      tool.name,
                      "seats",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="mono w-full bg-[#111] border border-[#222] px-2 py-2 text-xs focus:border-[#00ff88] focus:outline-none transition-colors"
                />
              </div>

              {/* Monthly spend */}
              <div className="space-y-1">
                <label className="text-xs text-[#444] block">
                  $/month
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-xs text-[#444] mono">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={tool.monthlySpend}
                    onChange={(e) =>
                      onUpdateTool(
                        tool.name,
                        "monthlySpend",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="mono w-full bg-[#111] border border-[#222] pl-5 pr-2 py-2 text-xs focus:border-[#00ff88] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Hit limits checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id={`limits-${tool.name}`}
                checked={hasHitLimits[tool.name] === true}
                onChange={(e) =>
                  onToggleHitLimits(tool.name, e.target.checked)
                }
                className="accent-[#00ff88]"
              />
              <label
                htmlFor={`limits-${tool.name}`}
                className="text-xs text-[#444] cursor-pointer"
              >
                I have hit the limits of this plan in the past 30 days
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Total preview */}
      {tools.length > 0 && (
        <div className="border border-[#1a1a1a] p-4 flex items-center justify-between">
          <span className="text-xs text-[#444]">Total monthly spend entered</span>
          <span className="mono text-sm text-[#00ff88]">
            ${tools.reduce((sum, t) => sum + t.monthlySpend, 0).toFixed(2)}/mo
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost flex-1">
          ← BACK
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || tools.length === 0}
          className="btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "RUNNING AUDIT..." : "RUN AUDIT →"}
        </button>
      </div>
    </div>
  )
}