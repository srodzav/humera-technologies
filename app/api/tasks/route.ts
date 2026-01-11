import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/tasks
export async function GET() {
    const result = await pool.query("SELECT * FROM tasks");
    return NextResponse.json({ ok: true, message: "Ok", data: result.rows }, { status: 200 });
}

// POST /api/tasks
export async function POST(req: Request) {
    const body = await req.json();
    const { title, description, projectId, assignee } = body;

    const result = await pool.query("INSERT INTO tasks (title, description, status, projectId, assignee) VALUES ($1, $2, $3, $4, $5) RETURNING *", [title, description, 'todo', projectId, assignee ]);
    return NextResponse.json({ ok: true, message: "Ok", data: result.rows[0] }, { status: 201 });
}

// PUT /api/tasks
export async function PUT(req: Request) {
    const body = await req.json();
    const { id, status } = body;

    const result = await pool.query("UPDATE tasks SET status = $1, updatedAt = NOW() WHERE id = $2", [status, id]);
    return NextResponse.json({ ok: true, message: "Ok" }, { status: 200 });
}

// DELETE /api/tasks
export async function DELETE(req: Request) {
    const body = await req.json();
    const { id } = body;

    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    return NextResponse.json({ ok: true, message: "Ok" }, { status: 200 });
}