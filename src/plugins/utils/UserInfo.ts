import dedent from 'dedent'
import { Plugin, PluginBase } from "../../decorators/Plugin"
import { Arg, Command, CommandParams } from "../../decorators/Command"
import { Message } from "telegram/tl/custom/message"
import { Api } from "telegram/tl"
import { Bold, Code, KeyValueItem, Mention, Section, SubSection } from '../../decorators/HTMLBuilder'

@Plugin({
    name: 'UserInfo',
    description: 'Return information about a given user',
})
export class UserInfo extends PluginBase {
    @Command({
        name: 'user',
        aliases: [ 'u' ],
        outgoing: true,
    })
    public async userInfo(
        { client, event, text }: CommandParams,
        @Arg('id', { type: Boolean }) id: boolean = false,
        @Arg('all', { type: Boolean }) all: boolean = false,
        @Arg('general', { type: Boolean }) general: boolean = true,
        @Arg('bot', { type: Boolean }) bot: boolean = false,
        @Arg('misc', { type: Boolean }) misc: boolean = false,
        @Arg('search', { type: Boolean }) search: boolean = false,
        @Arg('forward', { type: Boolean }) forward: boolean = true,
        @Arg('mention', { type: Boolean }) mention: boolean = false,
    ) {
        const { message } = event
        const replyMessage = await message.getReplyMessage().catch(() => null)
        let entity

        if (text && !isNaN(text as any)) entity = Number(text)
        else if (replyMessage) {
            const reply = replyMessage as Message
            const forwardHeader = reply.forward as unknown as Api.MessageFwdHeader
            if (forward && forwardHeader) {
                const fromId = forwardHeader.fromId
                if (fromId instanceof Api.PeerUser) {
                    entity = fromId.userId
                }
            } else {
                const sender = await reply.getSender()
                entity = sender.id
            }
        }

        if (!entity) {
            return await message.reply({ message: 'Failed to get information for user. They probably have forward privacy turned on.' })
        }

        const user: Api.User = await client.getEntity(entity)
        
        if (all) {
            general = true
            bot = true
            misc = true
        }
        
        const fullName = [user.firstName, user.lastName].join(' ').trim()
        const title = mention
        ? new Mention(fullName, user.id)
        : new Bold(fullName)
        
        if (id) {
            await message.reply({ message: new KeyValueItem(title, new Code(user.id)).toHtml() })
        } else {
            const response = new Section([ title ])

            if (general) {
                response.add(new SubSection([
                    new Bold('general'),
                    new KeyValueItem('id', new Code(user.id)),
                    new KeyValueItem('first name', new Code(user.firstName)),
                    new KeyValueItem('last name', new Code(user.lastName)),
                    new KeyValueItem('username', new Code(user.username)),
                    new KeyValueItem('mutual contact', new Code(user.mutualContact)),
                    new KeyValueItem('scam', new Code(user.scam)),
                ]))
            }
            
            if (bot) {
                response.add(new SubSection([
                    new Bold('bot'),
                    new KeyValueItem('bot', new Code(user.bot)),
                    new KeyValueItem('chat history', new Code(user.botChatHistory)),
                    new KeyValueItem('info version', new Code(user.botInfoVersion)),
                    new KeyValueItem('inline geo', new Code(user.botInlineGeo)),
                    new KeyValueItem('inline placeholder', new Code(user.botInlinePlaceholder)),
                    new KeyValueItem('nochats', new Code(user.botNochats)),
                ]))
            }
            
            if (misc) {
                response.add(new SubSection([
                    new Bold('misc'),
                    new KeyValueItem('restricted', new Code(user.restricted)),
                    new KeyValueItem('restricted reason', new Code(user.restrictionReason)),
                    new KeyValueItem('deleted', new Code(user.deleted)),
                    new KeyValueItem('verified', new Code(user.verified)),
                    new KeyValueItem('min', new Code(user.min)),
                    new KeyValueItem('lang code', new Code(user.langCode)),
                ]))
            }

            await message.reply({ message: response.toHtml() })
        }
    }
}
