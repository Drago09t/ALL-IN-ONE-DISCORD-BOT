const { Command } = require("@src/structures");
const { MessageEmbed, Message, CommandInteraction } = require("discord.js");
const { MESSAGES, EMBED_COLORS } = require("@root/config.js");
const { getJson } = require("@utils/httpUtils");

const animals = ["cat", "dog", "panda", "fox", "red_panda", "koala", "bird", "raccoon", "kangaroo"];
const BASE_URL = "https://some-random-api.ml/animal";

module.exports = class AnimalCommand extends Command {
  constructor(client) {
    super(client, {
      name: "animal",
      description: "shows a random animal image",
      cooldown: 5,
      category: "FUN",
      botPermissions: ["EMBED_LINKS"],
      command: {
        enabled: true,
        usage: "<type>",
        minArgsCount: 1,
      },
      slashCommand: {
        enabled: true,
        options: [
          {
            name: "name",
            description: "animal type",
            type: "STRING",
            required: true,
            choices: animals.map((animal) => ({ name: animal, value: animal })),
          },
        ],
      },
    });
  }

  /**
   * @param {Message} message
   * @param {string[]} args
   */
  async messageRun(message, args) {
    const choice = args[0];
    if (!animals.includes(choice)) {
      return message.safeReply(`Invalid animal selected. Available animals:\n${animals.join(", ")}`);
    }
    const response = await getAnimal(message.author, choice);
    return message.safeReply(response);
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async interactionRun(interaction) {
    const choice = interaction.options.getString("name");
    const response = await getAnimal(interaction.user, choice);
    await interaction.followUp(response);
  }
};

async function getAnimal(user, choice) {
  const response = await getJson(`${BASE_URL}/${choice}`);
  if (!response.success) return MESSAGES.API_ERROR;

  const imageUrl = response.data?.image;
  const embed = new MessageEmbed()
    .setColor(EMBED_COLORS.TRANSPARENT)
    .setImage(imageUrl)
    .setFooter({ text: `Requested by ${user.tag}` });

  return { embeds: [embed] };
}
