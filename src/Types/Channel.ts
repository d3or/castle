export interface Channel {
    type: number;
    position: number;
    permission_overwrites: any[];
    name: string;
    id: string;
    flags: number;
    topic?: any;
    rate_limit_per_user?: number;
    parent_id: string;
    last_message_id: string;
    user_limit?: number;
    rtc_region?: any;
    bitrate?: number;
    nsfw?: boolean;
}
