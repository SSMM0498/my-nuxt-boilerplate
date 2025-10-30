import type { AuthModel } from 'pocketbase';

export type UserModel = AuthModel & {
    name: string;
    avatar: string;
    email: string;
    username: string;
}