const { MessageActionRow, MessageButton } = require("discord.js");
const { permlevel, getTodayString } = require('../modules/functions.js');
const { claims, balances } = require('../modules/tables.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();

  // Get arguments provided by user to command
  const amount = interaction.options.getInteger('amount');
  const reason = interaction.options.getString('for');
  const authorId = interaction.user.id;
  const authorName = interaction.user.username;

  // Post the claim in the "claims" channel for admins to approve or deny
  const claimChannel = client.channels.cache.find(channel => channel.name == 'claims');
  const buttons = new MessageActionRow()
    .addComponents([
      new MessageButton()
        .setCustomId('approve')
        .setLabel('Approve')
        .setStyle('SUCCESS'),
      new MessageButton()
        .setCustomId('deny')
        .setLabel('Deny')
        .setStyle('DANGER')
    ])
  const claimMessage = await claimChannel.send({content:`${interaction.user.username} requested ${amount} CC for ${reason}`, components: [buttons]});

  // Filter to make sure person clicking button is mod
  const adminFilter = i => permlevel(i) >= 3;

  // Create rection collector and listen for button presses
  const collector = claimMessage.createMessageComponentCollector({ filter: adminFilter, time: 1*1000*10 });

  // After mod decision, disable buttons and update DB
  collector.on('collect', async i => {
    let decision = i.customId;

    if (decision === 'approve') {
      await claimMessage.delete();
      await claimChannel.send(`${i.user.username} has approved request with reason: "${reason}"`);
      await interaction.deleteReply();

      // since approved, update user balance
      let balance = balances.ensure(authorId, 0);
      balance = balance + amount;
      balances.set(authorId, balance)
    } else if (decision === 'deny') {
      await claimMessage.delete();
      await claimChannel.send(`${i.user.username} has denied request with reason: "${reason}"`);
      await interaction.deleteReply();
    }

    // Update DB
    // claims storage will have the date as the main key
    const key = getTodayString();
    
    // Create proposal record and add to claims Enmap
    if (claims.has(key)) {
      let today_claims = claims.get(key);
      const numeric_indexes = Array.from(Object.keys(today_claims)).map((num) => Number(num));
      // get largest existing proposal ID for today's date
      const current_count = Math.max(...numeric_indexes);
      let counter = current_count + 1;
      claim_record = {
        [counter]: {
          'amount': amount,
          'reason': reason,
          'userId': authorId,
          'userName': authorName,
          'decision': decision
        }
      };
      today_claims = Object.assign(today_claims, claim_record);
      claims.set(key, today_claims);
    } else {
      today_claims = {
        0: {
          'amount': amount,
          'reason': reason,
          'userId': authorId,
          'userName': authorName,
          'decision': decision
        }
      };
      claims.set(key, today_claims);
    }
    console.log(claims);
    console.log(balances);

    // stop collector
    collector.stop();
  })

  // If no one responded on time inform user
  collector.on('end', async i => {
    // TODO
    collector.stop();
  })
};

exports.commandData = {
  name: "claim",
  description: "Claim CC tokens from the DAO. Provide details on reasoning.",
  options: [
      {
          name: "amount",
          description: "Amount of tokens you are claiming.",
          type: 4 ,
          required: true
      },
      {
          name: "for",
          description: "Provide a reason for your claim.",
          type: 3,
          required: true
      }
  ],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};