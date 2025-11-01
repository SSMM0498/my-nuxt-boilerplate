import type { AuthModel } from 'pocketbase';
import type { AvatarProps } from '@nuxt/ui'

export type UserModel = AuthModel & {
    name: string;
    avatar: string;
    email: string;
    username: string;
}

export interface Member {
    name: string
    username: string
    role: 'member' | 'owner'
    avatar: AvatarProps
}

export interface Notification {
    id: number
    unread?: boolean
    sender: Member
    body: string
    date: string
}