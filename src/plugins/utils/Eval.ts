import safeEval from 'safe-eval'
import { inspect } from 'util'
import { Plugin, PluginBase } from "../../decorators/Plugin"
import { Arg, Command, CommandParams } from "../../decorators/Command"
import { Api } from 'telegram/tl'

@Plugin({
    name: 'Eval',
    description: 'Evaluate the given JavaScript code',
})
export class Eval extends PluginBase {
    @Command({
        name: 'eval',
        aliases: ['exec'],
        outgoing: true,
    })
    public async eval({ bot, client, event, text }: CommandParams, @Arg('async', { type: Boolean }) _async: boolean) {
        const code = _async
        ? `(async () => {
               ${text.trim()}
           })()`
        : text.trim()

        try {
            const result = await safeEval(code, {
                bot, client, event, require
            })

            const response = result ? inspect(result, true, 4, false) : 'No result'
            
            if (response.length > 4000) {
                await client.sendFile(event.message.chat, {
                    replyTo: event.message.id,
                    file: Buffer.from(response),
                    attributes: [
                        new Api.DocumentAttributeFilename({ fileName: 'result.txt' })
                    ]
                })
            } else {
                await event.message.reply({ message: `<pre><code>\n${response}\n</code></pre>` })
            }
        } catch (e) {
            await event.message.reply({ message: `<pre><code>\n${e}\n</code></pre>` })
        }
    }
}
