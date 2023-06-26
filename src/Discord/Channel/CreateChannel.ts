import nodeFetch from 'node-fetch';
import { config } from '../../Config';
import Log from '../../Utils/Logging';

/*
 * Create a channel
 *
 * @param {string} name - Channel name
 * @param {string} guild_id - Guild id
 * @param {number} type - Channel type
 * @param {string} parent_id - Parent channel id
 * @returns {Promise<string | null>}
 */
export const createChannel = async (
    name: string,
    guild_id: string,
    type = 0,
    parent_id?: string,
): Promise<string | null> => {
    const body = {
        name: name,
        type: type,
        permission_overwrites: [],
    };

    if (parent_id) {
        body['parent_id'] = parent_id;
    }

    const response = await nodeFetch(
        `https://discord.com/api/v9/guilds/${guild_id}/channels`,
        {
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

                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
            body: JSON.stringify(body),
            method: 'POST',
        },
    );

    if (response.status === 429) {
        // rate limited, wait for the retry-after response and try again
        const responseJson = await response.json();
        const retryAfter = responseJson['retry_after'];

        Log.info('Rate limited, waiting for ' + retryAfter + 's');
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));

        return createChannel(name, guild_id, type, parent_id);
    }

    if (response.status !== 201) {
        const responseText = await response.text();
        Log.error(
            'Failed to create channel: ' +
                name +
                ' response status: ' +
                response.status,
        );
        Log.error(responseText);

        return null;
    }

    const data = await response.json();

    return data.id;
};
