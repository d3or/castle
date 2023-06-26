export interface Footer {
    text: string;
    icon_url: string;
    proxy_icon_url: string;
}

export interface Image {
    url: string;
    proxy_url: string;
    height: number;
    width: number;
}

export interface Thumbnail {
    url: string;
    proxy_url: string;
    height: number;
    width: number;
}

export interface Video {
    url: string;
    height: number;
    width: number;
}

export interface Provider {
    name: string;
    url: string;
}

export interface Attatchment {
    id: string;
    filename: string;
    content_type: string;
    size: number;
    url: string;
    proxy_url: string;
    height: number;
    width: number;
}

export interface Embed {
    title: string;
    type: string;
    description: string;
    url: string;
    timestamp: Date;
    color: number;
    footer: Footer;
    image: Image;
    thumbnail: Thumbnail;
    video: Video;
    provider: Provider;
}
export interface WebhookBody {
    content: string;
    username: string;
    avatar_url: string;
    embeds: Embed[];
    attachments: Attatchment[];
}
