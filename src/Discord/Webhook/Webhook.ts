import nodeFetch from 'node-fetch';
import { MessageCreate } from '../../Types/MessageCreate';
import { WebhookBody } from '../../Types/Webhook';
import Log from '../../Utils/Logging';

/*
 * Webhook object
 *
 *
 */
class Webhook {
    private body: WebhookBody;
    private url: string;

    /*
     * @param {MessageCreate} message - MessageCreate object
     * @param {string} url - Webhook url
     */
    constructor(message: MessageCreate, url: string) {
        this.buildWebhook(message);
        this.url = url;
    }

    /*
     * Build webhook body
     *
     * @param {MessageCreate} message - MessageCreate object
     */
    public buildWebhook = (message: MessageCreate): void => {
        this.body = {
            content: message.d.content,
            username: message.d.author.username,
            avatar_url: `https://cdn.discordapp.com/avatars/${message.d.author.id}/${message.d.author.avatar}.webp`,
            embeds: message.d.embeds,
            attachments: message.d.attachments,
        };
    };

    /*
     * Send webhook
     *
     * @returns {Promise<void>}
     */
    public send = async (): Promise<void> => {
        try {
            const response = await nodeFetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.body),
            });

            if (response.status !== 204) {
                const data = await response.text();
                Log.error('Failed to send webhook');
                Log.error(data);
            } else {
                Log.info('Webhook sent');
            }
        } catch (error) {
            Log.error('Failed to send webhook');
        }
    };
}

export default Webhook;
