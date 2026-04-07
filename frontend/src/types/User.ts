export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    status: "active" | "inactive";
    createdAt: Date | null;
    updatedAt: Date | null;
}