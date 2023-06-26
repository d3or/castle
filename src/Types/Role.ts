export interface Role {
    user_id: string;
    roles: string[];
    premium_since?: any;
    pending: boolean;
    nick?: any;
    mute: boolean;
    joined_at: Date;
    flags: number;
    deaf: boolean;
    communication_disabled_until?: any;
    avatar?: any;
}
