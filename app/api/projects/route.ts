import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/projects
export async function GET() {
    // error handling
    try {
        const result = await pool.query("SELECT * FROM projects");
        return NextResponse.json({ ok: true, message: "Ok", data: result.rows }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error fetching projects" }, { status: 500 });
    }
}

// POST /api/projects
export async function POST(req: Request) {
    // error handling
    try {
        const body = await req.json();
        const { name } = body;

        // validation name exists and name is a word
        if (!name || name.trim().length === 0) {
            return NextResponse.json({ ok: false, message: "Name is required" }, { status: 400 });
        }

        const result = await pool.query("INSERT INTO projects (name) VALUES ($1) RETURNING *", [name]);
        return NextResponse.json({ ok: true, message: "Project created", data: result.rows[0] }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Error creating project" }, { status: 500 });
    }
}