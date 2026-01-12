'use client'

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TasksPage() {
    // params for projectId
    const params = useParams();
    const projectId = params.projectId as string;

    // variables
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');

    const fetchTasks = useCallback(async () => {
        const res = await fetch(`/api/tasks?projectId=${projectId}`);
        const data = await res.json();
        if(data.ok) {
            console.log(data.data);
            setTasks(data.data);
        }
    }, [projectId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    async function createTask() {
        if (!title || title.trim().length === 0) {
            return alert("Please verify title name");
        }
        if (!assignee || assignee.trim().length === 0) {
            return alert("Please verify assignee name");
        }

        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, projectId, assignee })
        });

        if(!res.ok) {
            alert("Failed to create Task");
        }

        setTitle("");
        setDescription("");
        setAssignee("");
        await fetchTasks();
    }

    async function updateTask(id: number, status: string) {
        if(!['todo','in_progress','done'].includes(status)) {
            return alert("Please verify status");
        }

        const res = await fetch("/api/tasks", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, status })
        });

        if(!res.ok) {
            alert("Failed to update Task");
        }
        
        await fetchTasks();
    }

    async function deleteTask(id: number){
        if(!id) {
            return alert ("id not valid");
        }

        const res = await fetch("/api/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id })
        });

        if(!res.ok) {
            alert("Failed to delete Task");
        }

        await fetchTasks();
    }
    
    const handleStatusChange = (id: number, event: any) => {
        const status = event.target.value;
        updateTask(id, status);
    }

    return(
        <div className="container">
            <h1> Task Tracker </h1>
            <h2>Project Tasks</h2>
            <div className="columns">
                <input className="input" placeholder="Title" value={title} onChange={e=> setTitle(e.target.value)} />
                <input className="input" placeholder="Description" value={description} onChange={e=> setDescription(e.target.value)} />
                <input className="input" placeholder="Assignee" value={assignee} onChange={e=> setAssignee(e.target.value)} />

                <button className="btn btn-action" onClick={createTask}> Add Task </button>
            </div>

            {tasks.length > 0 ? (
            <ul className="table">
                <li className="row header">
                    <span> Title </span>
                    <span> Description </span>
                    <span> Assignee </span>
                    <span> Status </span>
                    <span> Actions </span>
                </li>
                {tasks.map((task: any) => (
                    <li className="row" key={task.id}>
                        <span> {task.title} </span>
                        <span> {task.description} </span>
                        <span> {task.assignee} </span>

                        <select className="input" value={task.status} onChange={(e) => handleStatusChange(task.id, e)}>
                            <option value="todo">todo</option>
                            <option value="in_progress">in progress</option>
                            <option value="done">done</option>
                        </select>

                        <button className="btn btn-warning" onClick={() => deleteTask(task.id)}> Delete </button>
                    </li>
                ))}
            </ul>) : (<p className="text-centered">No tasks found for this project.</p>)}

            <Link className="btn btn-action" href={'/'}> Return Home </Link>
            
        </div>
    );
}