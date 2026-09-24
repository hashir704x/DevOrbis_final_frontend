export type role = "user" | "admin" | "staff";

export type User = {
  id: string;
  username: string;
  email: string;
  role: role;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
  setAuthLoading: (isAuthLoading: boolean) => void;
};

export type SideBarNavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  allowedRoles: role[];
};

export type Document = {
  id: string;
  filename: string;
  storageKey: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
  status: "processing" | "success" | "failed";
};

export type Chat = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  from: "Human" | "Ai";
  content: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

export type TaskAdmin = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  leadId: string;
  leadName: string;
  createdAt: string;
  updatedAt: string;
};

export type Lead = {
  id: string;
  username: string;
  email: string;
  budget: string;
  projectDescription: string;
};

export type Staff = {
  id: string;
  username: string;
  email: string;
};

export type TaskDetail = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  createdAt: string;
  updatedAt: string;
  assignedStaffName: string;
};

export type AiUsageStats = {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCost: string;
};

export type GeneratedTask = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
};
