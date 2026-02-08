import { NextResponse } from "next/server";
import * as repo from "@/repositories/task.repository"

export async function PUT(req:Request,  context: { params: Promise<{ id: string }> }){ 
    const {title, description, status, category_id } = await req.json();
    const { id: idParam } = await context.params; 
    const id = Number(idParam);
    await repo.updateTask(id, title, description, status, category_id);
    return NextResponse.json({ message: "Task updated successfully" }, { status: 200 })
    // Fix: You previous code is calling the id from the body of the request (req.json) which should't be
    // so i am now calling it from the context.params
    // which is [id] in your folder structure / url i.e task/[id]
}

export async function DELETE(req:Request, context: { params: Promise<{ id: string }> }){
    const { id: idParam } = await context.params; 
    const id = Number(idParam);
    await repo.deleteTask(id);
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 })
    // Fix: thesame thing applies here
}

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");  
    if (!id) {
        return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
    }
    const task = await repo.getTaskById(Number(id));
    if (!task) {    
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }   
    return NextResponse.json(task, { status: 200 });
}