import { EntityLike } from "telegram/define";
import { makePropDecorator, Type } from ".";
import { OnMessageMeta } from "./OnMessage";
import { RegisteredPlugin } from "./Plugin";

export interface CommandDecorator {
    (obj: CommandMeta): any

    new(obj: CommandMeta): CommandMeta;
}

export interface CommandMeta extends Omit<OnMessageMeta, 'pattern'> {
    name: string
    aliases?: string[]
    prefix?: string
    args?: [CommandArgument]
}

export interface CommandArgument {
    type: 'string' | 'number' | 'boolean'
    name: string
    required?: boolean | ((args: Record<'string', any>[]) => boolean),
    default?: any | (() => any)
}

export const Command: CommandDecorator = makePropDecorator(
    'Command', undefined, undefined,
    (target: Type<any>, name: string, meta: CommandMeta) => {
        // @ts-ignore: Unreachable code error
        RegisteredPlugin.__commands__.push([target[name], meta])
    }
)