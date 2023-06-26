import { newMessage } from '../../Events';
import Log from '../../Utils/Logging';
import { WebsocketMessage } from '../../Types/WebsocketMessage';
import { setGuilds, updateGuildsChannelCreate } from '../Cache/Guilds';
import { setRoles } from '../Cache/Roles';

/*
 * Message handler for websocket messages
 *
 * @param {WebsocketMessage} message - Websocket message
 * @returns {Promise<void>}
 */
class MessageHandler {
    public static async handle(message: WebsocketMessage): Promise<void> {
        switch (message.t) {
            case 'READY':
                Log.ready(
                    message.d.user.username,
                    message.d.sessions[0].status,
                    message.d.resume_gateway_url,
                );

                // Set guilds and roles cacje
                setGuilds(message.d.guilds);
                setRoles(message.d.merged_members);
                break;
            case 'MESSAGE_CREATE':
                // Emit new message event
                newMessage.emit('message', message);
                break;
            case 'CHANNEL_CREATE':
                // Update guilds cache with new channel
                updateGuildsChannelCreate(message.d);
                break;
        }
    }
}

export default MessageHandler;
