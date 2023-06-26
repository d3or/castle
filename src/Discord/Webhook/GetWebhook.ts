import nodeFetch from 'node-fetch';
import { config } from '../../Config';
import Log from '../../Utils/Logging';

/*
 * Get webhook url
 *
 * @param {string} channel_id - Channel id
 * @returns {Promise<string | null>}
 */
export const getWebhook = async (channel_id: string) => {
    const options = {
        method: 'GET',
        headers: {
            authority: 'discord.com',
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            authorization: config.mirror_user_token,
            'sec-ch-ua':
                '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            'x-debug-options': 'bugReporterEnabled',
            'x-discord-locale': 'en-US',
        },
    };

    const response = await nodeFetch(
        `https://discord.com/api/v9/channels/${channel_id}/webhooks`,
        options,
    );
    if (response.status !== 200) {
        const text = await response.text();
        Log.error('Failed to get webhook for channel: ' + channel_id);
        Log.error(text);
        return null;
    }

    const data = await response.json();
    if (data.length === 0) {
        return null;
    }

    // just return the first webhook for the channel
    return `https://discord.com/api/webhooks/${data[0].id}/${data[0].token}`;
};
