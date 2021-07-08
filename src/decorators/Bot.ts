import prompts from 'prompts';
import { inherits } from 'util'
import { TelegramClient } from 'telegram';
import { TelegramClientParams } from 'telegram/client/telegramBaseClient';
import { Session, StringSession } from 'telegram/sessions';
import { makeDecorator, Type, TypeDecorator } from '.';
import { PluginBase } from './Plugin';

export interface BotDecorator {
    (obj: BotMeta): TypeDecorator;

    new(obj: BotMeta): TypeDecorator;
}

export interface BotMeta {
    apiId: number
    apiHash: string
    clientParams?: TelegramClientParams
    session?: Session | string
    plugins?: any[]
    autostart?: boolean
}

export interface Authenticatable {
    phoneNumber?: () => string
    password?: () => string
    phoneCode?: () => number
    onError?: (error: Error) => void | Promise<boolean>
}

export class BotBase {
    public client: TelegramClient

    public plugins: Map<typeof PluginBase, PluginBase>

    constructor(client: TelegramClient) {
        this.client = client
        this.plugins = new Map()
    }

    addPlugin(plugin: typeof PluginBase) {
        const plug = new plugin(this)
        plug.__register__()
        this.plugins.set(plugin, plug)
    }

    removePlugin(plugin: typeof PluginBase) {
        const plug = this.plugins.get(plugin)
        plug.__unregister__()
        this.plugins.delete(plugin)
    }

    async start() {
        console.log('Starting bot server...')

        await this.client.start({
            phoneNumber: this.phoneNumber,
            password: this.password,
            phoneCode: this.phoneCode,
            onError: this.onError,
        })

        console.log("Connected to Telegram!")
    }

    async stop() {
        await this.client.disconnect()
    }

    async phoneNumber() {
        return await (await prompts({ type: 'text', name: 'phone', message: 'Phone number:' })).phone
    }
    
    async password() {
        return await (await prompts({ type: 'text', name: 'pass', message: 'Password:' })).pass
    }
    
    async phoneCode() {
        return await (await prompts({ type: 'text', name: 'code', message: 'Code:' })).code
    }
    
    async onError(err: Error) {
        console.error(err)
        return true
    }
}

export const Bot: BotDecorator = makeDecorator(
    'Bot',
    (meta: BotMeta) => ({
        session: !meta.session || typeof meta.session === 'string'
                 ? new StringSession(meta.session as string)
                 : meta.session,
        plugins: meta.plugins || [],
        autostart: meta.autostart,
        ...meta
    }),
    undefined, undefined,
    async (type: Type<any>, meta: BotMeta) => {
        const superClass = class type extends BotBase {
            constructor(client: TelegramClient) {
                super(client)
            }
        }
        
        
        const client = new TelegramClient(meta.session as Session, meta.apiId, meta.apiHash, meta.clientParams || {})
        const bot = new superClass(client)

        for (const plugin of meta.plugins as Array<typeof PluginBase>) {
            bot.addPlugin(plugin)
        }

        if (meta.autostart || meta.autostart === undefined) {
            await bot.start()
        }

        // await bootstrapPlugins(client)

        return superClass
    }
)
