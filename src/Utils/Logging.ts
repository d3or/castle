import colors from 'colors';

/*
 * This is a simple logging class that will be used to log messages to the console.
 */
class Log {
    /*
     * Logs info messages to the console
     * @param message The message to log
     * @returns void
     */
    public static info(message: string): void {
        console.log(
            colors.yellow(`[${new Date().toString().split(' GMT')[0]}] `) +
                colors.green('[+] [INFO] ') +
                message,
        );
    }

    /*
     * Logs warning messages to the console
     * @param message The message to log
     * @returns void
     */
    public static error(message: string): void {
        console.log(
            colors.yellow(`[${new Date().toString().split(' GMT')[0]}] `) +
                colors.red('[+] [ERROR] ') +
                message,
        );
    }

    /*
     * Logs new message events to the console
     * @param message The message to log
     * @returns void
     */
    public static message_create(
        content: string,
        username: string,
        channel_id: string,
    ): void {
        console.log(
            colors.yellow(`[${new Date().toString().split(' GMT')[0]}] `) +
                colors.green('[+] [MESSAGE_CREATE] ') +
                colors.magenta(`[user: ${username}] `) +
                colors.blue(`[channel: ${channel_id}] `) +
                content,
        );
    }

    /*
     * Logs a new ready event to the console
     * @param username The username of the client
     * @param status The status of the client
     * @param gateway_url The gateway url of the client
     * @returns void
     */
    public static ready(
        username: string,
        status: string,
        gateway_url: string,
    ): void {
        console.log(
            colors.yellow(`[${new Date().toString().split(' GMT')[0]}] `) +
                colors.green('[+] [READY] ') +
                colors.cyan('Client connected to gateway: ') +
                colors.magenta(`${gateway_url} `),
        );

        console.log(
            colors.yellow(`[${new Date().toString().split(' GMT')[0]}] `) +
                colors.green('[+] [READY] ') +
                colors.cyan('Client logged in as ') +
                colors.magenta(`${username} `),
        );

        console.log(
            colors.yellow(`[${new Date().toString().split(' GMT')[0]}] `) +
                colors.green('[+] [READY] ') +
                colors.cyan('Client presence is set to ') +
                colors.magenta(`${status}`),
        );
    }
}

export default Log;
