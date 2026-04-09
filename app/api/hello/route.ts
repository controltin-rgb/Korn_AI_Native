import { NextResponse } from "next/server";


export async function GET() {
    return NextResponse.json({
        message: "Hello from nextjs API",
        timestamp: new Date().toISOString(),
    })
}