import { random, sample } from 'underscore'
import { Plugin, PluginBase, Command, CommandParams } from 'cracker'

@Plugin({
    name: 'Mock',
    description: 'Mocks the selected text like the [spongebob meme](https://knowyourmeme.com/memes/mocking-spongebob).',
})
export class Mock extends PluginBase {
    @Command({
        name: 'mock',
        outgoing: true,
    })
    public async Mock({ event }: CommandParams) {
        const replyText = []
        const replyMessage = await event.message.getReplyMessage().catch(() => null)
        const text: string = replyMessage?.text || event.message.patternMatch?.[1]

        if (!text) {
            return await event.message.edit({ text: 'gIvE sOMEtHInG tO MoCk!' })
        }

        for (const char of text) {
            if (/[a-zA-Z]/.test(char) && sample([true, false])) {
                const toApp = /[a-z]/.test(char) ? char.toUpperCase() : char.toLowerCase()
                replyText.push(toApp)
            } else {
                replyText.push(char)
            }
        }

        return await event.message.edit({ text: replyText.join('') })
    }
}
