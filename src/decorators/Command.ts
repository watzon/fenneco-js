import { type } from "os";
import { TelegramClient } from "telegram";
import { EntityLike } from "telegram/define";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { makePropDecorator, Type } from ".";
import { BotBase } from "./Bot";
import { OnMessageMeta } from "./OnMessage";
import { PluginBase } from "./Plugin";

export interface CommandDecorator {
    (obj: CommandMeta): any

    new(obj: CommandMeta): CommandMeta;
}

export interface CommandMeta extends Omit<OnMessageMeta, 'pattern'> {
    name: string
    aliases?: string[]
    prefix?: string
}

export const Command: CommandDecorator = makePropDecorator(
    'Command', undefined, undefined,
    (target: PluginBase, func: string, meta: CommandMeta) => {
        let {name, aliases, outgoing, prefix, ...rest}: CommandMeta = meta
        
        aliases = aliases ? aliases : []
        aliases.unshift(name)

        outgoing = outgoing === undefined ? false : outgoing

        const pattern = new RegExp(`^\\${prefix || '.'}${aliases.join('|')}(:?\s+(.*))?`)
        const event = new NewMessage({ pattern, outgoing, ...rest })
        const callback = (bot: BotBase) => {
            const client = bot.client
            bot.client.addEventHandler((event: NewMessageEvent) => {
                const text = event.message.patternMatch?.[1]
                target[func]({bot, client, event, text})
            }, new NewMessage({ pattern, outgoing, ...rest }))
        }

        PluginBase.__register__(target.constructor, callback)
    }
)