import { ChannelCreateData } from './ChannelCreate';
import { MessageCreateData } from './MessageCreate';

export interface WebsocketMessage {
    t: string | null;
    s: number | null;
    op: number;
    d: any | null | MessageCreateData | ChannelCreateData;
}
