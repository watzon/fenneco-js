import { Bot } from 'cracker'
import { StoreSession } from 'telegram/sessions'
import * as Utils from './plugins/utils'
import * as Fun from './plugins/fun'

try {
  require('dotenv').config()
} catch (e: any) { }

@Bot({
  apiId: Number(process.env.API_ID!),
  apiHash: process.env.API_HASH!,
  session: new StoreSession('fenneco'),
  plugins: [...Object.values(Utils), ...Object.values(Fun)],
  parseMode: 'html',
})
export class Fenneco { }