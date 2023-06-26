import { ChannelCreateData } from '../../Types/ChannelCreate';
import { Guild } from '../../Types/Guild';
import Log from '../../Utils/Logging';

/*
 * The guild cache
 */
export let Guilds: Guild[] = [];

/*
 * Get a guild from the cache
 *
 * @param guildId The guild id to get
 * @returns The guild if it exists, undefined if it doesn't
 */
export const getGuild = (guildId: string): Guild | undefined => {
    return Guilds.find(guild => guild.id === guildId);
};

/*
 * Add guilds to the cache
 *
 * @param guilds The guilds to add to the cache
 * @returns void
 */
export const setGuilds = (guilds: Guild[]): void => {
    Guilds = guilds;

    Log.info(`Added ${guilds.length} guilds to cache`);
};

/*
 * Update the guild cache when a channel is created
 *
 * @param channel The channel to add to the cache
 * @returns void
 */
export const updateGuildsChannelCreate = (channel: ChannelCreateData): void => {
    const guild = getGuild(channel.guild_id);

    if (guild) {
        const guildIndex = Guilds.findIndex(
            guild => guild.id === channel.guild_id,
        );

        guild.channels.push(channel);

        Guilds.splice(guildIndex, 1, guild);

        Log.info(`Added channel ${channel.name} to guild cache`);
    }
};
