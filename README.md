# Covid discord bot

<a href="https://discord.gg/9nNegjx"><img src="https://discordapp.com/api/guilds/241578593937915905/embed.png" alt="Discord server" /></a>

Discord bot that sends periodically updates about COVID-19.

### Commands

Comand format:

```markdown
!covid <country>
```

example: `!covid USA` , `!covid italy`

Other available commands:

```markdown
!covid help
```

```markdown
!covid global
```

```markdown
!covid leadboard
```

### Config `.env` environment variables

Create a `.env` file in the root of the project with the following env variables:

```
BOT_TOKEN=
CHANNEL_ID=
```

check `env.template` as an example.

### Hints

- You need to create a `./images` folder on the root directory to store the periodically requested images.

- You can modify the cron jobs at your preference.