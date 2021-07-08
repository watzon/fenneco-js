import { TelegramClient } from "telegram"
import { NewMessageEvent } from "telegram/events"
import { Plugin, PluginBase } from "../../decorators/Plugin"
import { Command } from "../../decorators/Command"
import { performance } from 'perf_hooks'
import { BotBase } from "../../decorators/Bot"

@Plugin({
    name: 'Ping',
    description: 'Ping the server and time how long the request took',
})
export class Ping {
    @Command({
        name: 'ping',
        outgoing: true,
    })
    public async ping(client: TelegramClient, event: NewMessageEvent) {
        const start = performance.now()
        const msg = await event.message.reply({ message: 'PONG!' })
        if (msg) {
            const end = performance.now()
            const time = (end - start).toFixed(2)
            await msg.edit({ text: `PONG! ${time}ms` })
        }
    }
}
