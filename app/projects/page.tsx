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
        <div className="container">
            <h2>Project List</h2>
            <div className="columns">
                <input className="input" placeholder="Name" value={name} onChange={e=> setName(e.target.value)} />

                <button className="btn btn-action" onClick={createProject}> Add Project </button>
            </div>

            {projects.length > 0 ? (
            <ul className="table">
                <li className="row-single header">
                    <span> Name </span>
                    <span> Created At </span>
                    <span> Actions </span>
                </li>
                {projects.map((project: any) => (
                    <li className="row-single" key={project.id}>
                        <span> {project.name} </span>
                        <span> {new Date(project.createdat).toLocaleString()} </span>
                        <Link className="btn btn-primary" href={`/tasks/${project.id}`}> View Tasks </Link>
                    </li>
                ))}
            </ul>) : (<p className="text-centered">No projects found. Please add a project.</p>)}
        </div>
    );
}