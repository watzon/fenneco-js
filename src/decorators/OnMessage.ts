import { EntityLike } from "telegram/define";
import { makePropDecorator, Type } from ".";
import { RegisteredPlugin } from "./Plugin";

export interface OnMessageDecorator {
    (obj: OnMessageMeta): any

    new(obj: OnMessageMeta): OnMessageMeta;
}

export interface OnMessageMeta {
    chats?: EntityLike[];
    func?: CallableFunction;
    incoming?: boolean;
    outgoing?: boolean;
    fromUsers?: EntityLike[];
    forwards?: boolean;
    pattern?: string | RegExp;
    blacklistChats?: boolean;
}

export const OnMessage: OnMessageDecorator = makePropDecorator(
    'OnMessage', undefined, undefined,
    (type: Type<any>, name: string, meta: OnMessageMeta) => {
        // @ts-ignore: Unreachable code error
        RegisteredPlugin.__messageListeners__.push([type[name], meta])
    }
)