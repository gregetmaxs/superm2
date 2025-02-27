const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
	name: "mix", //the command name for the Slash Command
	description: "Plays a defined Mix", //the command description for Slash Command Overview
	cooldown: 2,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]

	options: [{
		"StringChoices": {
			name: "what_mix",
			description: "What Mix do you want?",
			required: true,
			choices: [
				/*
blues, oldgaming, pop, remixes, rock, strange-fruits-gaming
      */
				["Blues Mix", "blues"],
				["Charts Mix", "charts"],
				["Chill Mix", "chill"],
				["Default Mix", "default"],
				["Heavymetal Mix", "heavymetal"],
				["Gaming Mix", "gaming"],
				["Jazz Mix", "jazz"],
				["Metal Mix", "metal"],
				["Magic-Release Mix", "magic-release"],
				["NCS Mix", "ncs"],
				["No Copyright Mix", "nocopyright"],
				["Old Gaming Mix", "oldgaming"],
				["Pop Mix", "pop"],
				["Remixes Mix", "remixes"],
				["Rock Mix", "rock"],
				["Strange-Fruits Mix", "strange-fruits-gaming"],
			]
		}
	}, ],
	run: async (client, interaction) => {
		try {
			//console.log(interaction, StringOption)

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
			} = interaction;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return interaction.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],
				ephemeral: true
			})
			if (channel.userLimit != 0 && channel.full)
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`:x: Your Voice Channel is full, I can't join!`)
					],
					ephemeral: true
				});
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`:x: I am already connected somewhere else`)
					],
					ephemeral: true
				});
			}
			let link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
			let args = [interaction.options.getString("what_mix")]
			if (args[0]) {
				//ncs | no copyrighted music
				if (args[0].toLowerCase().startsWith("n")) link = "https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD";
				//pop
				if (args[0].toLowerCase().startsWith("p")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
				//default
				if (args[0].toLowerCase().startsWith("d")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
				//remixes from Magic Release
				if (args[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2"
				//rock
				if (args[0].toLowerCase().startsWith("ro")) link = "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U";
				//oldgaming
				if (args[0].toLowerCase().startsWith("o")) link = "https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav"
				//gaming
				if (args[0].toLowerCase().startsWith("g")) link = "https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6";
				//Charts
				if (args[0].toLowerCase().startsWith("cha")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl"
				//Chill
				if (args[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6";
        //Custom1
				if (args[0].toLowerCase().startsWith("custom1")) link = "https://open.spotify.com/playlist/3Uut9FFUqAQ62HoIN6IXfn?si=2R_Xb8HgS5ipBJDCTKbApw&dl_branch=1";
				//Jazz
				if (args[0].toLowerCase().startsWith("j")) link = "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt";
				//blues
				if (args[0].toLowerCase().startsWith("b")) link = "https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk";
				//magic-release
				if (args[0].toLowerCase().startsWith("ma")) link = "https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P"
				//metal
				if (args[0].toLowerCase().startsWith("me")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
        //dc
        if (args[0].toLowerCase().startsWith("dc")) link = "https://youtube.com/playlist?list=PLoJ0Iju4AUElOInL3iam_tREqA5BvMr5h";
				//heavy metal
				if (args[0].toLowerCase().startsWith("h")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
			} //update it without a response!
			await interaction.reply({
				content: `${client.allEmojis.loading} Loading the **'${args[0] ? args[0] : "Default"}' Music Mix**`,
				ephemeral: true
			});
			try {
				let queue = client.distube.getQueue(guildId)
				let options = {
					member: member,
				}
				if (!queue) options.textChannel = guild.channels.cache.get(channelId)
				await client.distube.playVoiceChannel(channel, link, options)
				//Edit the reply
				interaction.editReply({
					content: `${queue?.songs?.length > 0 ? "👍 Loaded" : "🎶 Now Playing"}: the **'${args[0] ? args[0] : "Default"}'**`,
					ephemeral: true
				});
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				interaction.editReply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],
					ephemeral: true
				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}