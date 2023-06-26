import EventEmitter from 'events';
import { config } from './Config';
import { MessageCreate } from './Types/MessageCreate';
import { channelHandler } from './Utils/ChannelHandler';
import Log from './Utils/Logging';
import { webhookHandler } from './Utils/WebhookHandler';

let isListening = false;

// Create new event emitter for new messages
export const newMessage = new EventEmitter();
/*
 * Start listening for new messages
 *
 * @returns void
 *
 */
export const startListening = (): void => {
    // if we are already listening, we don't need to do anything
    // so if we reconnect or something happens to the websocket, we don't need to start listening again
    if (isListening) {
        return;
    }
    isListening = true;

    Log.info('Starting to listen for new messages');
    newMessage.on('message', async (message: MessageCreate) => {
        // we need to check if the channel is in the config
        // if it is, we need to check if a webhook is set
        // if it is, we need to send the message to the webhook
        // if it isn't, we need to create a webhook and send the message to it
        if (config.target_guild_id !== message.d.guild_id) {
            return;
        }

        Log.message_create(
            message.d.content,
            message.d.author.username,
            message.d.channel_id,
        );

        const mirror_channel_id = await channelHandler(message);
        if (!mirror_channel_id) {
            Log.error('No channel to mirror to');
            return;
        }

        webhookHandler(message, mirror_channel_id);
    });
};
