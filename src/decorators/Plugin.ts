import { stringify } from "querystring";
import { TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { makeDecorator, Type, TypeDecorator } from ".";
import { CommandArgument, CommandMeta } from "./Command";
import { OnMessageMeta } from "./OnMessage";

export const pluginRegistry: RegisteredPlugin[] = []

export interface PluginDecorator {
    (obj?: PluginMeta): TypeDecorator;

    new(obj?: PluginMeta): Plugin;
}

export interface PluginMeta {
    name?: string
    description?: string
    author?: string
}

export class RegisteredPlugin {
    public static __commands__: [Function, CommandMeta][] = []
    public static __messageListeners__: [Function, OnMessageMeta][] = []

    private plugin: any
    private meta: PluginMeta

    constructor(plugin: any, meta: PluginMeta) {
        this.plugin = plugin
        this.meta = meta
    }

    public async __handleCommands__(client: TelegramClient) {
        for (const [func, meta] of RegisteredPlugin.__commands__) {
            let {name, aliases, outgoing, prefix, args, ...rest}: CommandMeta = meta
            
            aliases = aliases ? aliases : []
            aliases.unshift(name)

            outgoing = outgoing === undefined ? false : outgoing

            const pattern = new RegExp(`^\\${prefix || '.'}${aliases.join('|')}(:?\s+(.*))?`)
            const newMessage = new NewMessage({ pattern, outgoing, ...rest })
            client.addEventHandler((event: NewMessageEvent) => {
                const rest = event.message.patternMatch?.[1]
                const [passedArgs, text] = args && rest ? this.parseArguments(args, rest) : [null, null]
                func({client, event, args: passedArgs, text})
            }, newMessage)
        }
    }

    public async __handleOnMessage__(client: TelegramClient) {
        for (const [func, meta] of RegisteredPlugin.__messageListeners__) {
            let {pattern, ...rest} = meta
            pattern = typeof meta.pattern === 'string' ? new RegExp(meta.pattern) : meta.pattern

            const newMessage = new NewMessage({ pattern, ...rest })
            client.addEventHandler((event: NewMessageEvent) => {
                func({client, event})
            }, newMessage)
        }
    }

    private parseArguments(args: [CommandArgument], pattern: string) {
        const pieces = pattern.split(' ')
        
        let parsedArgs = {}
        let messageParts: string[] = []

        for (const arg of args) {
            switch (arg.type) {
                case 'string':
                    // const index = pieces.indexOf()
                case 'number':
                case 'boolean':
            }
        }

        return [args, messageParts.join(' ')]
    }
}

export const Plugin: PluginDecorator = makeDecorator(
    'Plugin', (p: PluginMeta = {}) => {}, undefined, undefined,
    (type: Type<any>, meta: PluginMeta) => {
        pluginRegistry.push(new RegisteredPlugin(new type(), meta))
    }
)
