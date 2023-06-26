import { config, SaveConfigToFile } from '../Config';
import { getGuild } from '../Discord/Cache/Guilds';
import { getRole } from '../Discord/Cache/Roles';
import { createChannel } from '../Discord/Channel/CreateChannel';
import { createWebhook } from '../Discord/Webhook/CreateWebhook';
import { startListening } from '../Events';
import Log from './Logging';

/*
 * This is used to intialize a new mirror server by cloning the text channels, voice channels, and categories from the target server
 * New channels are created in the mirror server, and webhooks are created for each channel and saved to the config
 * This is only used if autoMirror is true in the config
 */
export const initServer = async () => {
    Log.info('Initializing server');
    const guild = getGuild(config.target_guild_id);

    if (!guild) {
        Log.error('Could not find guild');
        return;
    }

    // find all channels in the guild that are not in the config

    const channelsToAdd = guild.channels.filter(
        channel =>
            !config.target_channels.find(
                configChannel => configChannel.target_channel_id === channel.id,
            ) && channel.type !== 15,
    );

    /* change items of type 5 (topic / announcement) to -1 and change it to 0 (text) later
     * change it to -1 right now so that it is not included in the sort below
     * this is because channels of type 5 requires special server setup to create
     */

    channelsToAdd.forEach(channel => {
        if (channel.type === 5) {
            // TODO: not the best way to do this, but it works for now
            channel.type = -1;
        }
    });

    // sort by channels so those with a higher type are created first, like categories
    channelsToAdd.sort((a, b) => b.type - a.type);

    // sort non-category channels by their position field
    // this is so that channels are created in the same order as they are in the target guild
    channelsToAdd.sort((a, b) => {
        const channelTypes = [0, -1, 2];
        if (channelTypes.includes(a.type) && channelTypes.includes(b.type)) {
            return a.position - b.position;
        } else {
            return 0;
        }
    });

    Log.info(`Found ${channelsToAdd.length} channels to add`);
    // create channels and webhooks for each channel
    for (const channel of channelsToAdd) {
        // check if the user is allowed to read the channel
        // TODO: fix this to be more efficient / less hacky and cleaner
        const canSeeChannel =
            channel.permission_overwrites.length === 0 || channel.type === -1
                ? true
                : channel.permission_overwrites.find(
                      permission =>
                          (getRole(permission.id) && permission.deny != 0) ||
                          (permission.id == config.target_guild_id &&
                              permission.allow != 0),
                  );
        if (!canSeeChannel) {
            Log.info(`Skipping channel ${channel.name} as user cannot see it`);
            continue;
        }

        // Convert topic channels (4, but its -1, see above) to text channels (type 0)
        if (channel.type === -1) {
            channel.type = 0;
        }

        const newChannel = await createChannel(
            channel.name,
            config.mirror_guild_id,
            channel.type,
            channel.parent_id && config.categories[channel.parent_id],
        );

        if (!newChannel) {
            Log.error('Could not create channel');
            continue;
        }

        // add category to config post-creation, with the target category id as the key and the mirror category id as the value, this is used later to create channels in the correct category
        if (channel.type === 4) {
            config.categories[channel.id] = newChannel;
        }

        let newWebhook;
        if (channel.type === 0) {
            newWebhook = await createWebhook(newChannel);
            if (!newWebhook) {
                Log.error('Could not create webhook');
                newWebhook = '';
            }
        }

        Log.info(`Created channel ${channel.name} in mirror guild`);

        // Add channel to config, including the mirror channel id and the webhook id
        config.target_channels.push({
            target_channel_id: channel.id,
            mirror_channel_id: newChannel,
            mirror_webhook: newWebhook,
        });

        // save config to file
        SaveConfigToFile();

        // wait a second to avoid rate limiting from discord
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // once the above is done, start listening for events
    startListening();
};
