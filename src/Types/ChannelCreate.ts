export interface Roles {
    hash: string;
}

export interface Metadata {
    hash: string;
}

export interface Channels {
    hash: string;
}

export interface Hashes {
    version: number;
    roles: Roles;
    metadata: Metadata;
    channels: Channels;
}

export interface Roles2 {
    hash: string;
}

export interface Metadata2 {
    hash: string;
}

export interface Channels2 {
    hash: string;
}

export interface GuildHashes {
    version: number;
    roles: Roles2;
    metadata: Metadata2;
    channels: Channels2;
}

export interface ChannelCreateData {
    version: number;
    type: number;
    topic: any;
    rate_limit_per_user: number;
    position: number;
    permission_overwrites: any[];
    parent_id: any;
    nsfw: boolean;
    name: string;
    last_message_id: any;
    id: string;
    hashes: Hashes;
    guild_id: string;
    guild_hashes: GuildHashes;
    flags: number;
}

export interface ChannelCreate {
    t: string;
    s: number;
    op: number;
    d: ChannelCreateData;
}
