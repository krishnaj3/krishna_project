export type Complaint = {
    id: string;
    status: ComplaintStatus;
    createdAt: Date | null;
    updatedAt: Date | null;
    description: string;
    userId: string;
    title: string;
    response: string | null;
}

export type ComplaintStatus = "pending" | "working" | "failed" | "resolved"