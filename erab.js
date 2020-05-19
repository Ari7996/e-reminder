const fs = require('fs');
const Discord = require('discord.js');
const { prefix, EPIC_RPG_ID, ICHIGO_ID, channelID, channelSelfPingID, roleFish, roleCatch, roleChop, roleArena, roleMiniBoss, roleLegendaryBoss, roleSeasonalEvent, roleCD0, roleCD1, roleCD2, roleCD3 } = require('./config.json');
const { token } = require('./token.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();
const stopEvent = '```diff\n-TOO LATE, THE EVENT ENDED.\n-TOO LATE, THE EVENT ENDED.\n-TOO LATE, THE EVENT ENDED.\n-TOO LATE, THE EVENT ENDED.\n-TOO LATE, THE EVENT ENDED.\n-TOO LATE, THE EVENT ENDED.\n-TOO LATE, THE EVENT ENDED.```';
/* const stopEvent = new Discord.MessageEmbed()
	.setImage('https://cdn.discordapp.com/attachments/675548334567456819/689198632897216512/stop.png')
	.setColor('#ff0000');
*/

client.once('ready', () => {
	console.log('Ready!');
	console.log('Started at: ' + (new Date).toString());
	// client.user.setActivity('erab help', { type: 'WATCHING' });
	try{console.log(client.guilds);}
	catch{console.log;}
	// 694932616268480582
	client.channels.fetch(channelSelfPingID).then(channelSelfPing=>{
		client.channels.fetch(channelID)
			.then(channel => {
				const channelMsg = `🤖 I just restarted, i forgot your cooldowns if i was tracking them. \nGo to ${channelSelfPing.toString()} if you want to enable my functionalities.\nPlease DM <@${ICHIGO_ID}> to report a bug or make a suggestion (send me the message link if you can), thank you 😀`;
				channel.send(channelMsg);
			/* const messageCatch = new Discord.Message(channel);
			messageCatch.fetch('693152279641063514').then(console.log).catch(console.error);
			// channel.fetchMessages({ around: '693152279641063514', limit: 1 });
			*/
			}).catch(console.error);
	},
	).catch(console.error);

});

function getCDR(roles) {
	if(roles.has(roleCD1)) {return roleCD1duration;}
	else if(roles.has(roleCD2)) {return roleCD2duration;}
	else if(roles.has(roleCD3)) {return roleCD3duration;}
	return eventCDR;
}
// const reminder = new Map();

const reminderHunt = new Set();
const reminderAdventure = new Set();
const reminderBuy = new Set();
const reminderTraining = new Set();
const reminderQuest = new Set();
const reminderWork = new Set();
const reminderGuild = new Set();

const eventCDR = 1;
const roleCD1duration = 0.9 * eventCDR;
const roleCD2duration = 0.8 * eventCDR;
const roleCD3duration = 0.65 * eventCDR;

const oneSecond = 1000;
const lag = oneSecond * 3;

const oneMinute = 60 * oneSecond;
const fiveMinutes = oneMinute * 5;
const fifteenMinutes = oneMinute * 15;

const oneHour = oneMinute * 60;
const twoHours = oneHour * 2;
const threeHours = oneHour * 3;
const sixHours = oneHour * 6;

const Boss = RegExp(/^\*\*A LEGENDARY/);
const BunnyBoss = RegExp(/^\*\*A BUNNY BOSS/);
// const BossWin = RegExp(/THE LEGENDARY /);
const BossLose = RegExp(/The legendary/);

const Chop = RegExp(/^\*\*AN EPIC/);
const Catch = RegExp(/^\*\*IT'S RAINING COINS/);
const Fish = RegExp(/^\*\*A MEGALODON/);

const Arena = RegExp(/arena$/);
const Miniboss = RegExp(/^Help /);

const eventEnd = RegExp(/Everyone/);

const CatchEggs = RegExp(/^\*\*EGGS ARE FALLING/);

/*
:zero: ◆》 IF YOU AREN'T DONOR
:one: ◆》 -35% CD (For donors with -35% cooldown reduction)
:two: ◆》 -20% CD (For donors with -20% cooldown reduction)
:three: ◆》 -10% CD (For donors with -10% cooldown reduction)
:x: ◆》 TO CLOSE THIS WINDOW
*/

client.on('message', message => {

	// EPIC RPG
	if(message.author.bot) {
		if (message.author.id === EPIC_RPG_ID) {
		/*
				const filter = response => {return response.content.toLowerCase() === 'fish';};
				message.channel.send('<@&689185077162541059> Caught a fish !').then(() => {
					message.channel.awaitMessages(filter, { max: 30, time: 5000 })
						.then(collected => {
							const Usernames = [];
							collected.forEach((a) => { Usernames.push(a.author.username);});
							message.channel.send(`Winner${collected.size ? '' : 's'} : ${Usernames} ! Everyone got ${collected.size * Math.round(1 + Math.random() * 3)} fish.`);
						})
						.catch((collected) => {
							console.log(collected);
							message.channel.send('Nobody got fishes. (Next time type FISH)');
						});
				});
				*/
			/*
A MEGALODON HAS SPAWNED IN THE RIVER :shark: - WEIGHT: 263 POUNDS
Type FISH to collect some normie fish, more FISHES means more normie fish!
Normie fish per player: 71 ~ 142
Players: 18 */
			/* AN EPIC TREE HAS JUST GROWN :woodenlog: - HEIGHT: 109
Type CHOP to collect some wooden logs, more CHOPS means more wooden logs!
Wooden logs per player: 53 ~ 106
Players: 18 */
			/* IT'S RAINING COINS :coin:
Type CATCH (once) to collect some coins, more players means more coins to everyone!
Coins per player: 32,290 ~ 96,870
Players: 13

 */
			if (typeof message.embeds[0] !== 'undefined'
			&& typeof message.embeds[0].fields[0] !== 'undefined'
			&& typeof message.embeds[0].fields[0].name !== 'undefined') {
				const name = message.embeds[0].fields[0].name;
				if (Fish.test(name)) {
					message.channel.send(`type FISH ! <@&${roleFish}>`);
				}
				else if (Catch.test(name)) {
					message.channel.send(`type CATCH ! <@&${roleCatch}>`);
				}
				else if (Chop.test(name)) {
					message.channel.send(`type CHOP ! <@&${roleChop}>`);
				}
				else if (Arena.test(name)) {
					message.channel.send(`Arena ! <@&${roleArena}>`);
				}
				else if (Miniboss.test(name)) {
					message.channel.send(`Miniboss ! <@&${roleMiniBoss}>`);
				}
				else if (Boss.test(name)) {
					message.channel.send(`LEGENDARY BOSS ! <@&${roleLegendaryBoss}>`);
				}
				else if (BunnyBoss.test(name)) {
					message.channel.send(`BUNNY BOSS ! <@&${roleSeasonalEvent}>`);
				}
				else if (CatchEggs.test(name)) {
					message.channel.send(`type CATCH ! (eggs) <@&${roleSeasonalEvent}>`);
				}

				else if (BossLose.test(name)) {
					message.react('🇫');
					message.channel.send(stopEvent);
					message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false })
						.then(
							setTimeout(()=>{
								message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
							}, 3 * oneSecond))
						.catch(console.error);
				}
				else if (eventEnd.test(name)) {
					message.channel.send(stopEvent);
					message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false })
						.then(
							setTimeout(()=>{
								message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
							}, 3 * oneSecond))
						.catch(console.error);
					/* const oldRateLimitPerUser = message.channel.rateLimitPerUser;
				try{message.channel.setRateLimitPerUser(10);}
				catch(error) {console.log(error);}
				setTimeout(()=>{
					try{message.channel.setRateLimitPerUser(oldRateLimitPerUser);}
					catch(error) {console.error(error);}
				}, 10000); */
				}
			}

		}
		return;
	}
	const msg = message.content.toLowerCase();

	if(msg.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply('I can\'t execute that command inside DMs!');
		}

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * oneSecond;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / oneSecond;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}
	else if(msg.startsWith('rpg ')
	&& message.channel.type === 'text'
	&& (message.member.roles.cache.has(roleCD0) || message.member.roles.cache.has(roleCD1) || message.member.roles.cache.has(roleCD2) || message.member.roles.cache.has(roleCD3))) {
		// https://discordapp.com/channels/639818527058165770/639838539781111831/694156646498304091 epic guard
		const ascended = msg.indexOf(' ascended ') !== -1;
		const messageRPG = msg
			.replace(/^rpg (ascended )?/, '');
		switch (messageRPG) {
		case 'hunt':
		case 'hunt t':
		case 'hunt together':
		case 'hunt h':
		case 'hunt h t':
		case 'hunt h together':
		case 'hunt hardmode':
		case 'hunt hardmode t':
		case 'hunt hardmode together':
			if (!reminderHunt.has(message.author.id)) {
				reminderHunt.add(message.author.id);
				setTimeout(() => {
					reminderHunt.delete(message.author.id);
					message.channel.send(`RPG **${ascended ? 'ASCENDED ' + messageRPG.toUpperCase() : messageRPG.toUpperCase()}** <@${message.author.id}> !`);
				}, oneMinute * getCDR(message.member.roles.cache) + lag);
			}
			break;

		case 'adventure':
		case 'adventure h':
		case 'adventure hardmode':
		case 'adv':
		case 'adv h':
		case 'adv hardmode':
			if (!reminderAdventure.has(message.author.id)) {
				reminderAdventure.add(message.author.id);
				setTimeout(() => {
					reminderAdventure.delete(message.author.id);
					message.channel.send(`RPG **${ascended ? 'ASCENDED ' + messageRPG.toUpperCase() : messageRPG.toUpperCase()}** <@${message.author.id}>`);
				}, oneHour * getCDR(message.member.roles.cache) + lag);
			}
			break;

		case 'buy edgy lootbox':
		case 'buy ed lb':
			if (!reminderBuy.has(message.author.id)) {
				reminderBuy.add(message.author.id);
				setTimeout(() => {
					reminderBuy.delete(message.author.id);
					message.channel.send(`RPG BUY **EDGY LOOTBOX** <@${message.author.id}>`);
				}, threeHours + lag);
			}
			break;

		case 'training':
		case 'tr':
			if (!reminderTraining.has(message.author.id)) {
				reminderTraining.add(message.author.id);
				setTimeout(() => {
					reminderTraining.delete(message.author.id);
					message.channel.send(`RPG **TRAINING** <@${message.author.id}>`);
				}, fifteenMinutes * getCDR(message.member.roles.cache) + lag);
			}
			break;

		case 'quest':
		case 'epic quest':
			if (!reminderQuest.has(message.author.id)) {
				reminderQuest.add(message.author.id);
				setTimeout(() => {
					reminderQuest.delete(message.author.id);
					message.channel.send(`RPG **${messageRPG.toUpperCase()}** <@${message.author.id}>`);
				}, sixHours * getCDR(message.member.roles.cache) + lag);
			}
			break;

		case 'chop':
		case 'axe':
		case 'bowsaw':
		case 'chainsaw':
			// no fallthrough
		case 'fish':
		case 'net':
		case 'boat':
		case 'bigboat':
			// no fallthrough
		case 'pickup':
		case 'ladder':
		case 'tractor':
		case 'greenhouse':
			// no fallthrough
		case 'mine':
		case 'pickaxe':
		case 'drill':
		case 'dynamite':
			if (!reminderWork.has(message.author.id)) {
				reminderWork.add(message.author.id);
				setTimeout(() => {
					reminderWork.delete(message.author.id);
					message.channel.send(`RPG **${ascended ? 'ASCENDED ' + messageRPG.toUpperCase() : messageRPG.toUpperCase()}** <@${message.author.id}>`);
				}, fiveMinutes * getCDR(message.member.roles.cache) + lag);
			}
			break;
		case 'guild raid':
		case 'guild upgrade':
			if (!reminderGuild.has(message.author.id)) {
				reminderGuild.add(message.author.id);
				setTimeout(() => {
					reminderGuild.delete(message.author.id);
					message.channel.send(`RPG **GUILD RAID || GUILD UPGRADE** command is ready, <@${message.author.id}> !`);
				}, twoHours + lag);
			}
			break;
		default:
			/*
				switch (message.content.substring(4)) {
				case 'rd':
				case 'ready':
				case 'cd':
				case 'cooldown':
				case 'h':
				case 'help':
				case 'p':
				case 'profile':
				case 'i':
				case 'inv':
				case 'open':
					break;

				default:
					message.reply(`Command detected: ${message.content} but no reminder timer associated with it.`);
					break;
				}
				*/
			break;
		}
	}
});

client.login(token);
/*
const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

channel.send(exampleEmbed);
*/