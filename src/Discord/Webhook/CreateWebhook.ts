import nodeFetch from 'node-fetch';

import { config } from '../../Config';
import Log from '../../Utils/Logging';

/*
 * Create webhook
 *
 * @param {string} channel_id - Channel id
 * @returns {Promise<string | null>}
 */
export const createWebhook = async (channel_id: string) => {
    const body = {
        name: 'Castle Bot',
    };
    const options = {
        headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            authorization: config.mirror_user_token,
            'content-type': 'application/json',
            'sec-ch-ua':
                '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-debug-options': 'bugReporterEnabled',
            'x-discord-locale': 'en-US',
        },
        referrerPolicy: 'strict-origin-when-cross-origin',

        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    };
    const response = await nodeFetch(
        `https://discord.com/api/v9/channels/${channel_id}/webhooks`,
        options,
    );

    if (response.status === 429) {
        // rate limited, wait for the retry-after seconds, then try again
        const responseJson = await response.json();
        const retryAfter = responseJson['retry_after'];
        Log.info('Rate limited, waiting for ' + retryAfter + 's');
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));

        return createWebhook(channel_id);
    }

    if (response.status !== 200) {
        const responseText = await response.text();
        Log.error('Failed to create webhook for channel: ' + channel_id);
        Log.error(responseText);
        return null;
    }

    const data = await response.json();

    return `https://discord.com/api/webhooks/${data.id}/${data.token}`;
};
