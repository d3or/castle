import fs from 'fs/promises';
import { Config } from './Types/Config';

export let config: Config = {
    gateway: 'wss://gateway.discord.gg/?v=9&encoding=json',
    target_user_token: '',
    mirror_user_token: '',
    target_user_status: 'online',
    target_guild_id: '',
    mirror_guild_id: '',
    autoMirror: false,
    target_channels: [
        {
            target_channel_id: '',
            mirror_channel_id: '',
            mirror_webhook: '',
        },
    ],
    categories: {},
};

/*
 * Save the config to a file
 *
 * @returns Promise<void>
 */
export const SaveConfigToFile = async (): Promise<void> => {
    const configString = JSON.stringify(config, null, 4);
    await fs.writeFile('./config.json', configString);
};

/*
 * Load the config from a file
 *
 * @returns Promise<void>
 */
export const LoadConfigFromFile = async (): Promise<void> => {
    const configString = await fs.readFile('./config.json', 'utf8');
    config = JSON.parse(configString);
};
