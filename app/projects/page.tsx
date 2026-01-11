"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
    // variables
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");

    async function fetchProjects() {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.ok) {
            console.log(data.data);
            setProjects(data.data);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    async function createProject() {
        if (!name || name.trim().length === 0) {
            return alert("Please verify name");
        }

        const res = await fetch("/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name })
        });

        if(!res.ok) {
            alert("Failed to create Project");
        }

        setName("");
        fetchProjects();
    }

    return (
        <div>
            <h2>Project List</h2>
            <div>
                <input placeholder="Name" value={name} onChange={e=> setName(e.target.value)} />

                <button onClick={createProject}> Add Project </button>
            </div>

            <ul>
                {projects.map((project: any) => (
                    <li key={project.id}>
                        <span> {project.name} </span>
                        <Link href={`/tasks/${project.id}`}> View Tasks </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}