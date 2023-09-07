import { EventEmitter } from 'stream';
import Websocket from 'ws';
import { config } from '../../Config';
import { WebsocketMessage } from '../../Types/WebsocketMessage';
import Log from '../../Utils/Logging';
import MessageHandler from './MessageHandler';

/*
 * Websocket manager class for handling connection to discord gateway
 * @class
 */
class WebsocketManager {
    private ws: Websocket;
    public messageEvent: EventEmitter;

    constructor() {
        // Create new event emitter for websocket messages
        this.messageEvent = new EventEmitter();
    }

    /*
     * Connect to discord gateway
     *
     * @returns {void}
     */
    public connect(): void {
        this.ws = new Websocket(config.gateway);

        this.ws.on('open', () => {
            this.initialize();
        });

        this.ws.on('message', data => {
            const message = JSON.parse(data.toString()) as WebsocketMessage;
            MessageHandler.handle(message);

            if (message.t) {
                this.messageEvent.emit(message.t, message);
            }
        });

        this.ws.on('close', () => {
            Log.error('Websocket closed');

            // Reconnect after 5 seconds
            setTimeout(() => {
                this.connect();
            }, 5000);
        });

        this.ws.on('error', error => {
            Log.error('Websocket error:' + error);

            setTimeout(() => {
                this.connect();
            });
        });
    }

    /*
     * Send data to discord gateway
     *
     * @param {object} data - Data to send
     * @returns {void}
     */
    private send = (data: object): void => {
        if (this.ws.readyState !== Websocket.OPEN) return;
        this.ws.send(JSON.stringify(data));
    };

    /*
     * Initialize connection to discord gateway
     *
     * TODO: Add more customizable options for identify message, instead of hardcoding it
     *
     * @returns {void}
     */
    private initialize(): void {
        const identifyMessage = {
            op: 2,
            d: {
                token: config.target_user_token,
                capabilities: 4093,
                properties: {
                    os: 'Mac OS X',
                    browser: 'Chrome',
                    device: '',
                    system_locale: 'en-US',
                    browser_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                    browser_version: '109.0.0.0',
                    os_version: '10.15.7',
                    referrer: '',
                    referring_domain: '',
                    referrer_current: '',
                    referring_domain_current: '',
                    release_channel: 'stable',
                    client_build_number: 171842,
                    client_event_source: null,
                },
                presence: {
                    status: config.target_user_status,
                    since: 0,
                    activities: [],
                    afk: false,
                },
                compress: false,
                client_state: {
                    guild_versions: {},
                    highest_last_message_id: '0',
                    read_state_version: 0,
                    user_guild_settings_version: -1,
                    user_settings_version: -1,
                    private_channels_version: '0',
                    api_code_version: 0,
                },
            },
        };

        this.send(identifyMessage);
        setInterval(() => this.heartbeat(), 3000);
    }

    /*
     * Send heartbeat message to discord gateway
     *
     * @returns {void}
     */
    private heartbeat(): void {
        const heartbeatMessage = {
            op: 1,
            d: Date.now(),
        };
        this.send(heartbeatMessage);
    }
}

export default WebsocketManager;
