export interface User {
    uid: string;
    email: string;
    displayName?: string;
    role: 'admin' | 'user';
    createdAt: number;
    photoURL?: string;
}

export type UserRole = 'admin' | 'user';
