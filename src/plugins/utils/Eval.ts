import safeEval from 'safe-eval'
import { inspect } from 'util'
import { Plugin, PluginBase, Command, CommandParams, Arg } from "cracker"
import { Api } from 'telegram/tl'
import { BasicString, Bold, Code, Section } from '../../../../cracker.js/src/htmlBuilder'

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
    public async eval(
        { bot, client, event, text }: CommandParams,
        @Arg('async', { type: Boolean }) _async: boolean = false,
        @Arg('return', { type: Boolean }) _return: boolean = true) {
        
        const originalCode = text.trim()
        if (_return) {
            const pieces = text.split('\n')
            let lastLine = pieces.pop()
            if (!lastLine.startsWith('return') && /^[a-zA-Z0-9_$]/.test(lastLine)) {
                lastLine = `return ${lastLine}`
            }
            pieces.push(lastLine)
            text = pieces.join('\n')
        }

        const code = _async
        ? `(async () => {
                ${text}
            })()`
        : `(() => {
            ${text}
        })()`

        try {
            let result = await safeEval(code, {
                bot, client, event, require
            })

            result = result ? inspect(result, true, 4, false) : 'No result'
            
            if (result.length > 4000) {
                const response = new Section([
                    new Bold('Code:'),
                    new Code(originalCode),
                ], { indent: 0, title: false, spacing: 1 })

                await client.sendFile(event.message.chat, {
                    replyTo: event.message.id,
                    file: Buffer.from(result),
                    attributes: [
                        new Api.DocumentAttributeFilename({ fileName: 'result.txt' })
                    ],
                    caption: response.toHtml(),
                })
            } else {
                const response = new Section([
                    new Bold('Code:'),
                    new Code(originalCode),
                    new BasicString('\n'),
                    new Bold('Result'),
                    new Code(result),
                ], { indent: 0, title: false, spacing: 1 })
                await event.message.respond({ message: response.toHtml() })
            }
        } catch (e) {
            const response = new Section([
                new Bold('Code:'),
                new Code(originalCode),
                new BasicString('\n'),
                new Bold('Error'),
                new Code(e.toString()),
            ], { indent: 0, title: false, spacing: 1 })

            await event.message.respond({ message: response.toHtml() })
        }
    }
}
