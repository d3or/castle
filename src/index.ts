import WebsocketManager from './Discord/Websocket/WebsocketManager';
import { LoadConfigFromFile } from './Config';
import { initServer } from './Utils/InitServer';

//  * Initialize the websocket connection and starts mirroring
//  *
//  * @returns {void}
//  */
const main = async (): Promise<void> => {
    await LoadConfigFromFile();
    const websocketManager = new WebsocketManager();
    websocketManager.connect();
    websocketManager.messageEvent.on('READY', () => initServer());
};

main();

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});
