import './decorators/typeExtensions'
import { StoreSession } from 'telegram/sessions'
import { Bot } from './decorators/Bot'
import { About, Eval, Ping, UserInfo } from './plugins/utils'
import { CopyPasta, Mock } from './plugins/fun'

try {
  require('dotenv').config()
} catch (e: any) {
  console.log(e)
}

@Bot({
  apiId: Number(process.env.API_ID!),
  apiHash: process.env.API_HASH!,
  session: new StoreSession('fenneco'),
  plugins: [Ping, CopyPasta, Mock, UserInfo, Eval, About],
  parseMode: 'html',
})
export class Fenneco {
  
}