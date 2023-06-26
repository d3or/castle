export interface ConfigChannel {
    // id of channel to mirror from in target guild
    target_channel_id: string;

    // id of channel to mirror to, leave blank if you want the bot to create a channel for you in the mirror guild
    mirror_channel_id: string;

    // webhook to send messages to, leave blank if you want the bot to create a webhook for you pointing to the mirror channel
    mirror_webhook: string;
}

export interface Config {
    gateway: string;
    target_user_token: string;
    mirror_user_token: string;

    target_user_status: 'online' | 'idle' | 'dnd' | 'invisible';

    // mirror options

    // enabling this will create channels and webhooks in the mirror guild for every channel in the target guild, and automatically mirror them to the mirror guild. for this to work, the mirror_user_token bot must have the MANAGE_CHANNELS permission in the mirror guild
    autoMirror: boolean;

    // target guild to mirror
    target_guild_id: string;

    // guild to mirror to
    mirror_guild_id: string;

    target_channels: ConfigChannel[];

    // category set
    categories: {
        // target parent category id -> mirror parent category id
        [key: string]: string;
    };
}
