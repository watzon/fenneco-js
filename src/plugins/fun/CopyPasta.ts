import { random, sample } from 'underscore'
import { Plugin, PluginBase, Command, CommandParams } from 'cracker'

const EMOJIS = [
    '😂', '👌', '😂', '✌', '💞', '👍', '👌', '💯', '🎶', '👀', '😂', '👓', '👏', '👐', '🍕',
    '💥', '🍴', '💦', '💦', '🍑', '🍆', '😩', '😏', '👉👌', '👀', '👅', '😩', '🚰'
]

@Plugin({
    name: 'CopyPasta',
    description: '😩memify😩THe👐GIVen🚰🅱️ext😩',
})
export class CopyPasta extends PluginBase {
    @Command({
        name: 'cp',
        aliases: ['copypasta'],
        outgoing: true,
    })
    public async copypasta({ event }: CommandParams) {
        const replyMessage = await event.message.getReplyMessage()
        const message = replyMessage || event.message
        const text = message.text

        let reply = sample(EMOJIS)
        const bIndex = random(text.length - 1)

        for (const [i, char] of text.split('').entries()) {
            if (char === ' ') {
                reply += sample(EMOJIS)
            } else if (EMOJIS.includes(char)) {
                reply += char
                reply += sample(EMOJIS)
            } else if (i === bIndex) {
                reply += '🅱️'
            } else {
                if (sample([true, false])) {
                    reply += char.toUpperCase()
                } else {
                    reply += char.toLowerCase()
                }
            }
        }

        reply += sample(EMOJIS)
        await event.message.edit({ text: reply })
    }
}
