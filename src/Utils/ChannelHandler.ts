import { config, SaveConfigToFile } from '../Config';
import { getGuild } from '../Discord/Cache/Guilds';
import { createChannel } from '../Discord/Channel/CreateChannel';
import { ConfigChannel } from '../Types/Config';
import { MessageCreate } from '../Types/MessageCreate';
import Log from './Logging';

/*
 * Get a channel from the config
 * @param channelId The channel id to get
 * @returns The channel if it exists, undefined if it doesn't
 */
export const getChannel = (channelId: string): ConfigChannel | undefined => {
    return config.target_channels.find(
        channel => channel.target_channel_id === channelId,
    );
};

/*
 * Handle a new message event from a channel
 *
 * @param message MessageCreate
 * @returns string | null
 * @returns channel id of the channel to mirror to if the channel is in the config, if its not in the config, and autoMirror is true, the channel is created, and the channel id is returned
 * @returns null if the channel is not in the config, and autoMirror is false
 *
 */
export const channelHandler = async (
    message: MessageCreate,
): Promise<string | null> => {
    let mirrorChannel = getChannel(message.d.channel_id);

    // if the channel is not in the config, and autoMirror is true, we need to create a new channel
    if (!mirrorChannel && config.autoMirror) {
        // Get the name of the channel to mirror from the guild cache
        const targetChannelName = getGuild(
            config.target_guild_id,
        )?.channels.find(channel => channel.id === message.d.channel_id)?.name;

        if (!targetChannelName) {
            Log.error('Could not find channel name');
            return null;
        }

        const newChannel = await createChannel(
            targetChannelName,
            config.mirror_guild_id,
        );

        if (!newChannel) {
            Log.error('Could not create channel');
            return null;
        }
        Log.info(`Created channel ${targetChannelName} in mirror guild`);
        mirrorChannel = {
            target_channel_id: message.d.channel_id,
            mirror_channel_id: newChannel,
            mirror_webhook: '',
        };
        config.target_channels.push(mirrorChannel);
        SaveConfigToFile();
        return newChannel;
    } else if (mirrorChannel) {
        return mirrorChannel.mirror_channel_id;
    }

    return null;
};
