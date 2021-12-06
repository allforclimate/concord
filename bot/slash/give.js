const { getTodayString } = require('../modules/functions.js');
const { transactions, balances } = require('../modules/tables.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });

  // Get arguments provided by user to command
  const amount = interaction.options.getInteger('amount');
  const recipient = interaction.options.getUser('to');
  const author = interaction.user;
  const recipientId = recipient.id;
  const recipientName = recipient.username;
  const authorId = author.id;
  const authorName = author.username;

  // Make sure user has enough tokens to award
  if (balances.ensure(authorId, 0) < amount) {
      await interaction.editReply(`Sorry ${authorName}, you don't have that many tokens!`);
  } else {
      // Update balances for both sender and recipient
      let senderBalance = balances.get(authorId);
      let recipientBalance = balances.ensure(recipientId, 0);

      senderBalance = senderBalance - amount;
      recipientBalance = recipientBalance + amount;

      balances.set(authorId, senderBalance);
      balances.set(recipientId, recipientBalance);

      // Update transactions DB
      const key = getTodayString();

      if (transactions.has(key)) {
        let today_transactions = transactions.get(key);
        const numeric_indexes = Array.from(Object.keys(today_transactions)).map((num) => Number(num));
        // get largest existing proposal ID for today's date
        const current_count = Math.max(...numeric_indexes);
        let counter = current_count + 1;
        transaction_record = {
          [counter]: {
            'amount': amount,
            'senderId': authorId,
            'senderName': authorName,
            'recipientId': recipientId,
            'recipientName': recipientName
          }
        };
        today_transactions = Object.assign(today_transactions, transaction_record);
        transactions.set(key, today_transactions);
      } else {
        today_transactions = {
          0: {
            'amount': amount,
            'senderId': authorId,
            'senderName': authorName,
            'recipientId': recipientId,
            'recipientName': recipientName
          }
        };
        transactions.set(key, today_transactions);
      }
      console.log(transactions);
      console.log(balances);

      // Update interaction to inform users of successful request
      await interaction.editReply(`${author} awarded ${amount} CC to ${recipient}`)
  };
};

exports.commandData = {
  name: "give",
  description: "Show appreciation by awarding a member some of your tokens.",
  options: [
      {
          name: "amount",
          description: "Amount of tokens you wish to send.",
          type: 4, // type 4 == int
          required: true
      },
      {
          name: "to",
          description: "User who will receive the amount.",
          type: 6, // type 6 == user
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