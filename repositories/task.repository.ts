import pool from "@/lib/db";
import { Task, TaskStatus } from "@/types/task";
import { get } from "http";

console.log({user:process.env.DB_USER, pswrd:process.env.DB_PASSWORD});


//Get single task by id
export const getTaskById = async (id: number): Promise<Task | null> => {
    const [rows] = await pool.query<Task[]>(
        `SELECT t.*, c.name as category_name
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?`,
        [id]
    );
    return rows[0] || null;
}


// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
    const [rows] = await pool.query<Task[]>(
        `SELECT t.*, c.name as category_name
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.created_at DESC`
    );
    return rows;
};

// Create new task
export const createTask = async (
    title: string,
    description: string | null,
    status: TaskStatus,
    category_id: number | null
) => {
    await pool.query(
        `INSERT INTO tasks (title, description, status, category_id) VALUES (?,?,?,?)`,
         [title, description, status, category_id]);
};

// Update/Edith task
export const updateTask = async (
    id: number,
    title: string,
    description: string | null,
    status: TaskStatus,
    category_id: number | null
) => {
   await pool.query(
        `UPDATE tasks SET title=?, description=?, status=?, category_id=? WHERE id=?`,
        [title, description, status, category_id, id]
    );
  return getTaskById(id);
};

// Delete task
export const deleteTask = async (id: number) => {
   await pool.query("DELETE FROM tasks WHERE id=?", [id]);
   return getTaskById(id);
};