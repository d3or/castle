import { createWebhook } from '../Discord/Webhook/CreateWebhook';
import { getWebhook } from '../Discord/Webhook/GetWebhook';
import Webhook from '../Discord/Webhook/Webhook';
import { MessageCreate } from '../Types/MessageCreate';
import { config, SaveConfigToFile } from '../Config';
import Log from './Logging';

/*
 * Get a webhook from the config
 * @param channelId The channel id to get webhook for
 * @returns The webhook if it exists, undefined if it doesn't
 *
 * @returns string | null
 *
 */
export const getWebhookFromConfig = (channel_id: string): string | null => {
    const channel = config.target_channels.find(
        channel => channel.target_channel_id === channel_id,
    );
    if (channel && channel.mirror_webhook) {
        return channel.mirror_webhook;
    }

    return null;
};

/*
 * Set a webhook in the config
 * @param channelId The channel id to set webhook for
 * @param webhookUrl The webhook url to set
 * @returns void
 *
 */
export const setWebhookInConfig = (
    mirror_channel_id: string,
    webhookUrl: string,
): void => {
    const allChannels = config.target_channels;
    const channel = allChannels.find(
        channel => channel.mirror_channel_id === mirror_channel_id,
    );

    if (channel) {
        const channelIndex = allChannels.indexOf(channel);

        Log.info(
            `Setting webhook for channel: ${mirror_channel_id} to ${webhookUrl}`,
        );
        channel.mirror_webhook = webhookUrl;

        allChannels.splice(channelIndex, 1, channel);

        config.target_channels = allChannels;

        SaveConfigToFile();
    }
};

/*
 * Handle a new message event from a channel
 *
 * @param message MessageCreate
 *
 * @returns void
 *
 */
export const webhookHandler = async (
    message: MessageCreate,
    mirror_channel_id: string,
): Promise<void> => {
    // Check if the webhook is in the config
    let webhookUrl = getWebhookFromConfig(mirror_channel_id);
    if (webhookUrl) {
        // If it is, send the message
        sendWebhook(message, webhookUrl);
        return;
    } else {
        Log.info(
            `No webhook found in config, checking for webhook in channel: ${mirror_channel_id}`,
        );
    }

    // Try to get the webhook from the channel itself
    webhookUrl = await getWebhook(mirror_channel_id);
    if (!webhookUrl) {
        Log.info(
            `No webhook found, creating one for channel: ${mirror_channel_id}`,
        );

        // If it doesn't exist, create one
        webhookUrl = await createWebhook(mirror_channel_id);
    } else {
        Log.info(`Found webhook for channel: ${mirror_channel_id}`);
        setWebhookInConfig(mirror_channel_id, webhookUrl);
    }

    if (!webhookUrl) {
        Log.error(
            `Unable to retrieve Webhook. Could not send message to channel: ${mirror_channel_id}`,
        );
        return;
    }
    sendWebhook(message, webhookUrl);
};

/*
 * Send a message to a webhook
 * @param message The message to send
 * @param webhookUrl The webhook url to send to
 * @returns void
 */
export const sendWebhook = async (
    message: MessageCreate,
    webhookUrl: string,
): Promise<void> => {
    const webhook = new Webhook(message, webhookUrl);
    await webhook.send();
};
