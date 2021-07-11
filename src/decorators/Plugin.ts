import { TelegramClient } from "telegram"
import { makeDecorator, Type, TypeDecorator } from "."
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
    public static __callbacks__: Map<Function, ((bot: BotBase) => void)[]> = new Map()
    public bot: BotBase

    constructor(bot: BotBase) {
        this.bot = bot
    }

    public __register__() {
        for (const callback of PluginBase.__callbacks__.get(this.constructor)) {
            callback(this.bot)
        }
    }

    public static __register__(plugin: any, callback: any) {
        if (!PluginBase.__callbacks__.has(plugin)) {
            PluginBase.__callbacks__.set(plugin, [])
        }

        PluginBase.__callbacks__.get(plugin).push(callback)
    }

    public __unregister__() {

    }
}

export const Plugin: PluginDecorator = makeDecorator(
    'Plugin', (p: PluginMeta = {}) => {}, PluginBase, undefined,
    (type: Type<any>, meta: PluginMeta) => {}
)
