import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/src/lib/supabase"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: "Audit ID required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("audits")
      .select("id, input_json, result_json, created_at")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      )
    }

    // Strip identifying details for public version
    const publicData = {
      id: data.id,
      createdAt: data.created_at,
      tools: data.input_json.tools,
      useCase: data.input_json.useCase,
      teamSize: data.input_json.teamSize,
      totalMonthlySavings: data.result_json.totalMonthlySavings,
      totalAnnualSavings: data.result_json.totalAnnualSavings,
      recommendations: data.result_json.recommendations,
      isAlreadyOptimal: data.result_json.isAlreadyOptimal,
      highSavings: data.result_json.highSavings,
      lowSavings: data.result_json.lowSavings,
    }

    return NextResponse.json(publicData)
  } catch (err) {
    console.error("Fetch audit error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}