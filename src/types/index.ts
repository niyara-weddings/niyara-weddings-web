export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface WeddingProfile {
    id: number;
    user: number; // User ID
    wedding_date: string | null;
    bride_name: string | null;
    groom_name: string | null;
    venue: string | null;
    budget: string | null; // Decimal represented as string
    theme: string | null;
    colors: string | null;
    expected_guest_count: number | null;
    created_at: string;
    updated_at: string;
}

export type RsvpStatus = 'invited' | 'confirmed' | 'declined' | 'maybe';

export interface Guest {
    id: number;
    wedding_profile: number;
    name: string;
    email: string | null;
    phone: string | null;
    rsvp_status: RsvpStatus;
    plus_one: boolean;
    dietary_restrictions: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Vendor {
    id: number;
    wedding_profile: number;
    name: string;
    category: string;
    email: string | null;
    phone: string | null;
    quote_price: string | null; // Decimal as string
    contact_person: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskAssignment = 'bride' | 'groom' | 'couple';

export interface Task {
    id: number;
    wedding_profile: number;
    vendor: number | null; // Vendor ID
    title: string;
    description: string | null;
    assigned_to: TaskAssignment;
    is_completed: boolean;
    due_date: string | null;
    priority: TaskPriority;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
    status: string;
    code: number;
    error?: string; // Sometimes populated on failure
    errors?: any[]; // Detailed validation errors
}
