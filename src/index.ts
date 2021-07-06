import { TelegramClient } from 'telegram'
import { StoreSession } from 'telegram/sessions'
import prompts from 'prompts'
import { bootstrapPlugins } from './plugins'

const apiId = 65534
const apiHash = "e3e522e32853d0767df7b2113d5e2497"
const session = new StoreSession('fenneco') // fill this later with the value from session.save()

;(async () => {
  console.log('Starting Fenneco...')

  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  })

  await client.start({
    phoneNumber: async () => await (await prompts({ type: 'text', name: 'phone', message: 'Phone number:' })).phone,
    password: async () => await (await prompts({ type: 'text', name: 'pass', message: 'Password:' })).pass,
    phoneCode : async () => await (await prompts({ type: 'text', name: 'code', message: 'Code:' })).code,
    onError: (err) => console.log(err),
  })

  console.log("Connected to Telegram")
  await bootstrapPlugins(client)
})()
