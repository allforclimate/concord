const { proposals } = require('../modules/tables.js');
const { getTodayString, canVote } = require('../modules/functions.js');
const logger = require('../modules/Logger.js');
require('dotenv').config();

// REMOVE AFTER TESTING PROPOSAL STORAGE
proposals.clear();
exports.run = async (client, message, args, level) => {
    let allowedToVote = await canVote(message.author.id);
    if (!allowedToVote) {
        authorMention = message.author.toString();
        message.reply(
            `Sorry ${authorMention}, you can't create a DAO proposal unless you have enough ` +
            `tokens. Visit our website to buy some tokens.`)
        .then(() => logger.log(`User ${message.author.id} tried to create a proposal, but didn't have enough tokens.`))
        .catch((e) => logger.error(e));
    } else {
        try {
            const proposal_text = args.join(" ");
            const proposal_message = await message.channel.send(proposal_text);

            const filter = (reactions, user) => ['👍', '👎'].includes(reactions.emoji.name);
            const collector = proposal_message.createReactionCollector({ filter, time: 1*1000*10}); // 1000ms = 1 sec

            collector.on('collect', (reaction, user) => {
                if (!canVote(user.id)) {
                    reaction.count -= 1;
                    logger.warn(`User ${user.id} tried to vote, but didn't have enough tokens.`);
                } else {
                    logger.log(`Collected ${reaction.emoji.name} from ${user.username}`);
                }
            });

            collector.on('end', async collected => {
                let yesVoters = {};
                let noVoters = {};

                try {
                    yes_voters = await collected.get('👍').users.fetch();
                    yes_vote_count = yes_voters.size;
                    for (const voter of yes_voters.entries()) {
                        yesVoters[voter[0]] = voter[1].username;
                    };
                } catch(e) {
                    if (e instanceof TypeError) {
                        yes_vote_count = 0;
                        yesVoters = {};
                    }
                }

                try {
            no_voters = await collected.get('👎').users.fetch();
            no_vote_count = no_voters.size;
            for (const voter of no_voters.entries()) {
                noVoters[voter[0]] = voter[1];
            };
            } catch(e) {
            if (e instanceof TypeError) {
                no_vote_count = 0;
                noVoters = {};
            }
            }

            // proposals storage will have the date as the main key
            key = getTodayString();
        
            // Create proposal record and add to proposals Enmap
            if (proposals.has(key)) {
                today_proposals = proposals.get(key);
                numeric_indexes = Array.from(Object.keys(today_proposals)).map((num) => Number(num));
                // get largest existing proposal ID for today's date
                current_count = Math.max(...numeric_indexes);
                counter = current_count + 1;
                proposal_record = {
                    [counter]: {
                    'proposal': proposal_text,
                    'yesCount': yes_vote_count,
                    'noCount': no_vote_count,
                    'yesVoters': yesVoters,
                    'noVoters': noVoters
                    }
            };
                today_proposals = Object.assign(today_proposals, proposal_record);
            } else {
                today_proposals = {
                    0: {
                    'proposal': proposal_text,
                    'yesCount': yes_vote_count,
                    'noCount': no_vote_count,
                    'yesVoters': yesVoters,
                    'noVoters': noVoters
                    }
                };
            }
            proposals.set(key, today_proposals);
            console.log(proposals);
        });
        } catch (error) {
            console.log(error);
        }
    }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "propose",
  category: "Miscellaneous",
  description: "Create a proposal for the community to vote on.",
  usage: "propose"
};
