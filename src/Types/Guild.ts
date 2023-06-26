import { Channel } from './Channel';

export interface Role {
    unicode_emoji?: any;
    tags: any;
    position: number;
    permissions_new: string;
    permissions: number;
    name: string;
    mentionable: boolean;
    managed: boolean;
    id: string;
    icon?: any;
    hoist: boolean;
    flags: number;
    color: number;
}

export interface Properties {
    application_id?: any;
    description?: any;
    rules_channel_id?: any;
    splash?: any;
    system_channel_id: string;
    hub_type?: any;
    premium_progress_bar_enabled: boolean;
    afk_timeout: number;
    vanity_url_code?: any;
    mfa_level: number;
    id: string;
    default_message_notifications: number;
    owner_id: string;
    nsfw_level: number;
    safety_alerts_channel_id?: any;
    banner?: any;
    max_stage_video_channel_users: number;
    premium_tier: number;
    public_updates_channel_id?: any;
    home_header?: any;
    verification_level: number;
    preferred_locale: string;
    discovery_splash?: any;
    features: string[];
    explicit_content_filter: number;
    max_video_channel_users: number;
    latest_onboarding_question_id?: any;
    system_channel_flags: number;
    max_members: number;
    name: string;
    afk_channel_id?: any;
    nsfw: boolean;
    icon?: any;
}

export interface Guild {
    version: number;
    threads: any[];
    stickers: any[];
    stage_instances: any[];
    roles: Role[];
    properties: Properties;
    premium_subscription_count: number;
    member_count: number;
    lazy: boolean;
    large: boolean;
    joined_at: Date;
    id: string;
    guild_scheduled_events: any[];
    emojis: any[];
    data_mode: string;
    channels: Channel[];
    application_command_counts: any;
}
