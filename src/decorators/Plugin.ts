import { inherits } from "util"
import { TelegramClient } from "telegram"
import { NewMessage, NewMessageEvent } from "telegram/events"
import { EventBuilder, EventCommon } from "telegram/events/common"
import { makeDecorator, Type, TypeDecorator } from "."
import { CommandMeta } from "./Command"
import { OnMessageMeta } from "./OnMessage"
import { BotBase } from "./Bot"

export interface PluginDecorator {
    (obj?: PluginMeta): TypeDecorator

    new(obj?: PluginMeta): TypeDecorator
}

export interface PluginMeta {
    name?: string
    description?: string
    author?: string
}

export class PluginBase {
    private eventHandlers: Map<string, [CallableFunction, EventBuilder?]> = new Map()
    private bot: BotBase
    private client: TelegramClient

    constructor(bot: BotBase) {
        this.bot = bot
        this.client = bot.client
    }

    public __register__() {

    }

    public __unregister__() {

    }

    public async __onCommand__(functionName: string, meta: CommandMeta) {
        let {name, aliases, outgoing, prefix, ...rest}: CommandMeta = meta
        
        aliases = aliases ? aliases : []
        aliases.unshift(name)

        outgoing = outgoing === undefined ? false : outgoing

        const pattern = new RegExp(`^\\${prefix || '.'}${aliases.join('|')}(:?\s+(.*))?`)
        const event = new NewMessage({ pattern, outgoing, ...rest })
        const callback = (event: NewMessageEvent) => {
            const text = event.message.patternMatch?.[1]
            this[functionName]({event, text})
        }

        this.client.addEventHandler(callback, event)
        this.eventHandlers.set(functionName, [callback, event])
    }

    public async __onMessage__(client: TelegramClient) {
        // for (const [func, meta] of PluginBase.__messageListeners__) {
        //     let {pattern, ...rest} = meta
        //     pattern = typeof meta.pattern === 'string' ? new RegExp(meta.pattern) : meta.pattern

        //     const newMessage = new NewMessage({ pattern, ...rest })
        //     client.addEventHandler((event: NewMessageEvent) => {
        //         func({client, event})
        //     }, newMessage)
        // }
    }

    // private __parseArguments__(args: [CommandArgument], pattern: string) {
    //     const pieces = pattern.split(' ')
        
    //     let parsedArgs = {}
    //     let messageParts: string[] = []

    //     for (const arg of args) {
    //         switch (arg.type) {
    //             case 'string':
    //                 // const index = pieces.indexOf()
    //             case 'number':
    //             case 'boolean':
    //         }
    //     }

    //     return [args, messageParts.join(' ')]
    // }
}

export const Plugin: PluginDecorator = makeDecorator(
    'Plugin', (p: PluginMeta = {}) => {}, undefined, undefined,
    (type: Type<any>, meta: PluginMeta) => {
        const superClass = class type extends PluginBase {
            constructor(bot: BotBase) {
                super(bot)
            }
        }

        return superClass
    }
)
