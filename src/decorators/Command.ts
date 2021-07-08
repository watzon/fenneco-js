import { EntityLike } from "telegram/define";
import { makePropDecorator, Type } from ".";
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
    (target: Type<any>, name: string, meta: CommandMeta) => {
        (target as any).__onCommand__(name, meta)
    }
)