import { Plugin, PluginBase } from "../../decorators/Plugin"
import { Command } from "../../decorators/Command"
import { performance } from 'perf_hooks'

@Plugin({
    name: 'Ping',
    description: 'Ping the server and time how long the request took',
})
export class Ping extends PluginBase {
    @Command({
        name: 'ping',
        outgoing: true,
    })
    public async ping({client, event}) {
        const start = performance.now()
        const msg = await event.message.reply({ message: 'PONG!' })
        if (msg) {
            const end = performance.now()
            const time = (end - start).toFixed(2)
            await msg.edit({ text: `PONG! ${time}ms` })
        }
    }
}
