<div align="center">
  <img src="https://cdn.discordapp.com/attachments/1015688789210959943/1072017161696055376/image.png" alt="Castle Logo" height="200">
  <h1>Castle</h1>
  <strong>🔌 
    A tool to mirror messages in a discord server to another discord server in realtime.
  </strong>
</div>

<br />

<div align="center">
  <a href="https://twitter.com/deor">
    <img src="https://img.shields.io/twitter/follow/deor?label=deor&style=flat&logo=twitter&color=1DA1F2" alt="Twitter">
  </a>
</div>

## 🔥 Features

-   Automatically clones channels and categories in a mirror server
-   Creates webhooks in mirror server
-   Mirrors messages, embeds, attachments, reactions, and webhooks in realtime
-   Handles permission overwrites for channels and categories
-   Lightweight and fast, with very little external dependencies
-   Minimal configuration required

## 📦 What's inside?

Castle uses its own selfbot methods to communicate with discord. No external dependencies are needed except for node-fetch, which is used when sending outward requests to discord.

## Configuration

```
config.json
```

```json
{
    "gateway": "wss://gateway.discord.gg/?v=9&encoding=json",
    "target_user_token": "",
    "mirror_user_token": "",
    "target_user_status": "online",
    "target_guild_id": "",
    "mirror_guild_id": "",
    "autoMirror": true,
    "target_channels": [
        {
            "target_channel_id": "",
            "mirror_channel_id": "",
            "mirror_webhook": ""
        }
    ],
    "categories": {}
}
```

| Key                  | Value                                         | Description                                                                                       |
| -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `gateway`            | `wss://gateway.discord.gg/?v=9&encoding=json` | Discord Gateway URL, do not change unless you know what you're doing                              |
| `target_user_token`  |                                               | Discord token of the user inside the target server to mirror messages from                        |
| `mirror_user_token`  |                                               | Discord token of the user inside the mirror server that will be mirroring messages                |
| `target_user_status` | online                                        | Status of the target user to mirror messages from, can be `online`, `idle`, `dnd`, or `invisible` |
| `target_guild_id`    |                                               | ID of the target server to mirror messages from                                                   |
| `mirror_guild_id`    |                                               | ID of the mirror server to mirror messages to                                                     |
| `autoMirror`         | true                                          | Automatically create channels, categories, and webhooks in the mirror server                      |
| `target_channels`    |                                               | Array of channel IDs to mirror messages from. Leave empty if `autoMirror` is set to `true`        |
| `categories`         |                                               | Key-value pairs of category IDs in the target server, and the category IDs in the mirror server   |

## ⚙️ Run it yourself

### Clone the repository

```bash
git clone https://github.com/d3or/castle.git && cd castle
```

### Install dependencies

```bash
yarn install
```

### Build

```bash
yarn build
```

### Configure the bot

```bash
cp config.example.json config.json

# Edit the config.json file with your own configuration
```

### Start

```bash
yarn start
```

## TODO

-   [ ] Add support for cloning discord roles so that they can be used in the mirror server when they are mentioned in the target server.
-   [ ] Add support for mirroring messages from multiple servers to a single server (or multiple servers) at the same time.
-   [ ] Add support for using normal discord bots instead of selfbots
-   [ ] Add support for reactions on messages
-   [ ] Add support for editing messages
