import { Plugin, PluginBase, Command, CommandParams } from "cracker"
import { Bold, Code, KeyValueItem, Section } from "cracker/src/htmlBuilder"
import { version } from '../../../package.json'
import { execSync } from 'child_process'

@Plugin({
    name: 'About',
    description: 'Returns some basic information about your bot',
})
export class About extends PluginBase {
    @Command({
        name: 'about',
        outgoing: true,
    })
    public async about({ event, bot }: CommandParams) {
        const revision = execSync('git rev-parse --short HEAD').toString().trim()
        const changes = execSync('git diff-index HEAD --').toString().split('\n')

        const response = new Section([
            new Bold('Fenneco'),
            new KeyValueItem('version', new Code(version)),
            new KeyValueItem('git hash', new Code(revision)),
            new KeyValueItem('files changed', new Code(changes.length)),
            new KeyValueItem('loaded modules', new Code(bot.plugins.size)),
            new KeyValueItem('uptime', new Code(`${(bot.uptime * 0.001).toFixed(2)}s`)),
        ])

        await event.message.reply({ message: response.toHtml() })
    }
}
