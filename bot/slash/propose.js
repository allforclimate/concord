const { proposals } = require('../modules/tables.js');
const { getTodayString, concordPropose, getContractBalance, isMember } = require('../modules/functions.js');
const { majorityVote } = require('../modules/voting.js');
const { MessageActionRow, MessageButton } = require("discord.js");
const { registeredUsers } = require('../modules/tables.js');
const { ethers } = require("ethers");

exports.run = async (client, interaction) => {
  await interaction.deferReply();
  const userId = interaction.user.id;
  const address = registeredUsers.get(userId) || 'unregistered';
  const can_propose = await isMember(address);

  if (can_propose) {
    try {

      const cBal = await getContractBalance();

      const proposal_text = interaction.options.getString('proposal');
      const voting_type = interaction.options.getString('voting type');
      const amount = interaction.options.getString('amount');

      if (amount <= ethers.utils.formatEther(cBal)) {

        // Post the claim in the "claims" channel for admins to approve or deny
        const proposalsChannel = client.channels.cache.find(channel => channel.name == 'proposals');
        const buttons = new MessageActionRow()
          .addComponents([
          new MessageButton()
            .setCustomId('yes')
            .setLabel('Yay')
            .setStyle('SUCCESS'),
          new MessageButton()
            .setCustomId('no')
            .setLabel('Nay')
            .setStyle('DANGER')
          ])
        
        const proposal_message_content = `${interaction.user.username} has requested ${amount} ETH for ${proposal_text}`;
        const proposalMessage = await proposalsChannel.send({
          content: proposal_message_content,
          components: [buttons]
        });

        const collector = proposalMessage.createMessageComponentCollector({ time: 1000*30 });

        // only register votes if isMember is true
        // isMember()

        // Keep record of votes so users can change their vote
        let yes_votes = new Set;
        let no_votes = new Set;
        let id_name_mapping = new Map;

        collector.on('collect', async i => {
          const decision = i.customId;
          const voterId = i.user.id;
          const voterName = i.user.username;
          const address = registeredUsers.get(voterId) || 'unregistered';
          const can_vote = await isMember(address);

          // Check if user is allowed to vote
          if (can_vote) {
            id_name_mapping.set(voterId, voterName);
            console.log(`Collected ${decision} from ${voterName}`);

            if (decision === 'yes') {
              yes_votes.add(voterId);
              
              // if previously voted no, remove the no vote
              if (no_votes.has(voterId)) {
                no_votes.delete(voterId);
              }
            } else {
              no_votes.add(voterId);
              
              // if previously voted no, remove the no vote
              if (yes_votes.has(voterId)) {
                yes_votes.delete(voterId);
              }
            }

            i.update({
              content: proposal_message_content + `\n Tally so far: \n ${yes_votes.size} yay | ${no_votes.size} nay`,
              components: [buttons]
            });
          } else {
            // if not registered and trying to vote, inform user of registration possibility
            const dm_channel = await i.user.createDM()
            dm_channel.send(`Oops! Looks like you tried to vote without registering. Please register first by calling /register.`)
          }
        });

        collector.on('end', async collected => {

          key = getTodayString();
          let decision, yes_vote_count, no_vote_count;

          // get decision based on voting type chosen
          switch (voting_type) {
            case 'majority':
              [decision, yes_vote_count, no_vote_count] = await majorityVote(yes_votes, no_votes, proposalMessage, proposal_text);
            
            default: // defaults to majority
              [decision, yes_vote_count, no_vote_count] = await majorityVote(yes_votes, no_votes, proposalMessage, proposal_text);
          }

          // Update ephemeral reply to user with conclusion of vote
          if (decision == 'pass') {
            await interaction.editReply(`Congrats! Your proposal has passed!`);
            const txHash = await concordPropose(interaction.user.id, amount, proposal_text);
            await interaction.editReply(`${interaction.user.username} has received ${amount} ETH from the treasury: https://rinkeby.etherscan.io/tx/${txHash}`);
          } else if (decision == 'fail') {
            await interaction.editReply(`Sorry, looks like the community doesn't agree with your proposal.`)
          } else {
            await interaction.editReply(`Sorry, looks like the proposal ended in a tie.`)
          }

          // Add voter username alongside the ID for better human inspection
          const yes_voters = Array(yes_votes).map((id) => {
            return [id, id_name_mapping.get(id)]
          });

          const no_voters = Array(no_votes).map((id) => {
            return [id, id_name_mapping.get(id)]
          });
          
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
                'decision': decision,
                'yesCount': yes_vote_count,
                'noCount': no_vote_count,
                'yesVoters': yes_voters,
                'noVoters': no_voters
              }
            };
            today_proposals = Object.assign(today_proposals, proposal_record);
          } else {
            today_proposals = {
              0: {
                'proposal': proposal_text,
                'decision': decision,
                'yesCount': yes_vote_count,
                'noCount': no_vote_count,
                'yesVoters': yes_voters,
                'noVoters': no_voters
              }
            };
          }
          proposals.set(key, today_proposals);
        });
        
      } else {
        await interaction.editReply(`Sorry, the community can't afford your proposal. We only have ${ethers.utils.formatEther(cBal)} ETH to spend.`)
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    interaction.deleteReply();
    const dm_channel = await interaction.user.createDM();
    dm_channel.send(`Oops! Looks like you tried to create a proposal without registering. Please register first by calling /register.`);
  }
};

exports.commandData = {
  name: "propose",
  description: "Create a proposal for the community to vote on.",
  options: [
    {
      name: "proposal",
      description: "What is your proposal?",
      type: 3, // type 3 == string
      required: true
    },
    {
      name: "amount",
      description: "If proposal carries a budget requirement, provide required budget.",
      type: 3, // type 4 == int
      required: true
    },
    {
      name: "voting",
      description: "Which type of voting mechanism should be used?",
      type: 3,
      required: false,
      choices: [
        {
          name: 'majority',
          value: 'majority'
        }
      ]
    }
  ],
  defaultPermission: true,
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};