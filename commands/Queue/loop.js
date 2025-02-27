const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
module.exports = {
	name: "loop", //the command name for the Slash Command

	category: "Queue",
	aliases: ["repeat", "repeatmode", "l"],
	usage: "loop <song/queue/off>",

	description: "Enable/Disable the Song- / Queue-Loop", //the command description for Slash Command Overview
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			//things u can directly access in an interaction!
			const {
				member,
				channelId,
				guildId,
				applicationId,
				commandName,
				deferred,
				replied,
				ephemeral,
				options,
				id,
				createdTimestamp
			} = message;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now!**`)
					],

				})
				if (check_if_dj(client, member, newQueue.songs[0])) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **You are not a DJ and not the Song Requester!**`)
							.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
						],
					});
				}
				if (!args[0]) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Please add valid Options!**`)
							.setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}loop <song/queue/off>\``)
						],
					});
				}
				let loop = args[0]
				if (!["off", "song", "queue"].includes(args[0]).toLowerCase()) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Please add valid Options!**`)
							.setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}loop <song/queue/off>\``)
						],
					});
				}
				if (loop.toLowerCase() == "off") loop = 0;
				if (loop.toLowerCase() == "song") loop = 1;
				if (loop.toLowerCase() == "queue") loop = 2;
				await newQueue.setRepeatMode(loop);
				if (newQueue.repeatMode == 0) {
					message.reply({
						content: `${client.allEmojis.x} **Disabled the Loop Mode!**\n> 💢 **Action by**: \`${member.user.tag}\``
					})
				} else if (newQueue.repeatMode == 1) {
					message.reply({
						content: `🔁 **Enabled the __Song__-Loop** ||(Disabled the **Queue-Loop**)||\n> 💢 **Action by**: \`${member.user.tag}\``
					})
				} else {
					message.reply({
						content: `🔂 **Enabled the __Queue__-Loop!** ||(Disabled the **Song-Loop**)||\n> 💢 **Action by**: \`${member.user.tag}\``
					})
				}
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],

				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}