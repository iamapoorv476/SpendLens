import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { supabase } from "@/src/lib/supabase"
import { runAudit } from "@/src/lib/audit-engine"
import { generateSummary } from "@/src/lib/anthropic"
import { ExtendedUserInput } from "@/src/lib/types"

export async function POST(req: NextRequest) {
  try {
    const input: ExtendedUserInput = await req.json()

    // Validate minimum required fields
    if (!input.tools || input.tools.length === 0) {
      return NextResponse.json(
        { error: "No tools provided" },
        { status: 400 }
      )
    }

    const result = runAudit(input)

    // Generate AI summary — falls back to template if API fails

    const summary = await generateSummary(result, input)
    result.summary = summary

    // Generate unique ID for shareable URL
    const id = nanoid(10)

    // Save to Supabase
    const { error } = await supabase.from("audits").insert({
      id,
      input_json: input,
      result_json: result,
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ id: null, result })
    }

    return NextResponse.json({ id, result })
  } catch (err) {
    console.error("Audit route error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}