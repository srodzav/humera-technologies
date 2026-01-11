import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/projects
export async function GET() {
    const result = await pool.query("SELECT * FROM projects");
    return NextResponse.json({ ok: true, message: "Ok", data: result.rows }, { status: 200 });
}

// POST /api/projects
export async function POST(req: Request) {
    const body = await req.json();
    const { name } = body;

    const result = await pool.query("INSERT INTO projects (name) VALUES ($1) RETURNING *", [name]);
    return NextResponse.json({ ok: true, message: "Ok", data: result.rows[0] }, { status: 201 });
}