import { TelegramClient } from 'telegram'
import { NewMessage, NewMessageEvent } from 'telegram/events'
import { CommandMeta } from '../decorators/Command'
import { pluginRegistry } from '../decorators/Plugin'

require('./utils')

export async function bootstrapPlugins(client: TelegramClient) {
    for (const plugin of pluginRegistry) {
        plugin.__handleCommands__(client)
        plugin.__handleOnMessage__(client)
    }
}
