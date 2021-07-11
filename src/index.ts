import prompts from 'prompts'
import { TelegramClient } from 'telegram'
import { StoreSession } from 'telegram/sessions'
import { Bot } from './decorators/Bot'
import { Ping } from './plugins/utils'

try {
  require('dotenv').config()
} catch (e: any) {
  console.log(e)
}

@Bot({
  apiId: Number(process.env.API_ID!),
  apiHash: process.env.API_HASH!,
  session: new StoreSession('fenneco'),
  plugins: [Ping],
})
export class Fenneco {
  
}