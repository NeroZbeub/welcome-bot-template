const Discord = require('discord.js');
const client = new Discord.Client({
    ws: {
      intents: ['GUILDS', 'GUILD_MEMBERS']
    },
    partials: ['CHANNEL']
});
const { MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const path = require('path')
var channelWelcomeId = 'id of the channel here'

client.on('ready', () => {
    client.user.setStatus('Online')
    console.log(`Connecté en tant que ${client.user.tag}!`);
});

client.on('error', error => {
    console.error('Welcome Bot - Error:', error);
});

client.on('guildMemberAdd', async (member) => {
    const { guild } = member
    const channel = guild.channels.cache.get(channelWelcomeId)
    const canvas = Canvas.createCanvas(700, 416)
    const ctx = canvas.getContext('2d')
    const background = await Canvas.loadImage(path.join(__dirname, 'background.png'))
    let x = 0
    let y = 0

    ctx.drawImage(background, x, y)
    
    const pfp = await Canvas.loadImage(
        member.user.displayAvatarURL({
            format: 'png',
        })
    )

    x = canvas.width / 2 - pfp.width / 2
    y = 100
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + 71, y);
    ctx.lineTo(x + 56, y);
    ctx.quadraticCurveTo(x + 126, y, x + 126, y + 70);
    ctx.lineTo(x + 126, y + 55);
    ctx.quadraticCurveTo(x + 126, y + 125, x + 56, y + 125);
    ctx.lineTo(x + 71, y + 125);
    ctx.quadraticCurveTo(x + 1, y + 125, x + 1, y + 55);
    ctx.lineTo(x + 1, y + 70);
    ctx.quadraticCurveTo(x + 1, y, x + 71, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(pfp, x + 1, y, 125, 125);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(x + 63, y + 63, 62, 0, 60, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.closePath();
    
    ctx.fillStyle = '#FFFFFF'
    
    ctx.font = '40px Arial'
    let text = `Bienvenue ${member.user.tag}!`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 158 + pfp.height)
    
    ctx.font = '25px Arial'
    text = `Tu es le/la ${guild.memberCount}eme membre!`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 190 + pfp.height)
    
    const attachment = new MessageAttachment(canvas.toBuffer())
    channel.send(`Salut <@${member.id}> bienvenue sur **${guild.name}**`, attachment)
});

client.login('bot token here');
