const { Command } = require("@src/structures");
const { MessageEmbed, Message, CommandInteraction } = require("discord.js");
const { getUser } = require("@schemas/User");
const { EMBED_COLORS, ECONOMY } = require("@root/config.js");

module.exports = class BegCommand extends Command {
  constructor(client) {
    super(client, {
      name: "beg",
      description: "beg from someone",
      category: "ECONOMY",
      cooldown: 21600,
      botPermissions: ["EMBED_LINKS"],
      command: {
        enabled: true,
      },
      slashCommand: {
        enabled: true,
      },
    });
  }

  /**
   * @param {Message} message
   * @param {string[]} args
   */
  async messageRun(message) {
    const response = await beg(message.author);
    await message.safeReply(response);
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async interactionRun(interaction) {
    const response = await beg(interaction.user);
    await interaction.followUp(response);
  }
};

async function beg(user) {
  let users = [
    "PewDiePie",
    "T-Series",
    "Sans",
    "RLX",
    "Pro Gamer 711",
    "Zenitsu",
    "Jake Paul",
    "Kaneki Ken",
    "KSI",
    "Naruto",
    "Mr. Beast",
    "Ur Mom",
    "A Broke Person",
    "Giyu Tomiaka",
    "Bejing Embacy",
    "A Random Asian Mom",
    "Ur Step Sis",
    "Jin Mori",
    "Sakura (AKA Trash Can)",
    "Hammy The Hamster",
    "Kakashi Sensei",
    "Minato",
    "Tanjiro",
    "ZHC",
    "The IRS",
    "Joe Mama",
  ];

  let amount = Math.floor(Math.random() * `${ECONOMY.MAX_BEG_AMOUNT}` + `${ECONOMY.MIN_BEG_AMOUNT}`);
  const userDb = await getUser(user.id);
  userDb.coins += amount;
  await userDb.save();

  const embed = new MessageEmbed()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: `${user.username}`, iconURL: user.displayAvatarURL() })
    .setDescription(
      `**${users[Math.floor(Math.random() * users.length)]}** donated you **${amount}** ${ECONOMY.CURRENCY}\n` +
        `**Updated Balance:** **${userDb.coins}** ${ECONOMY.CURRENCY}`
    );

  return { embeds: [embed] };
}
