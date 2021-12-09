
exports.majorityVote = async (yes_votes, no_votes, proposalMessage, proposal_text) => {
  const yes_vote_count = yes_votes.size;
  const no_vote_count = no_votes.size;
  let decision = '';

  // derive final decision of community based on majority vote
  // modify bot reply based on decision
  if (yes_vote_count !== no_vote_count) {
    if (yes_vote_count > no_vote_count) {
      decision = 'pass';
      await proposalMessage.edit({
        content: `Proposal: "${proposal_text}" has passed with ${yes_vote_count} in favor and ${no_vote_count} against.`,
        components: []
      });
    } else {
      decision = 'fail';
      await proposalMessage.edit({
        content: `Proposal: "${proposal_text}" has failed with ${yes_vote_count} in favor and ${no_vote_count} against.`,
        components: []
      });
    }
  } else {
    decision = 'tie';
    await proposalMessage.edit({
      content: `Proposal: "${proposal_text}" has failed with ${yes_vote_count} in favor and ${no_vote_count} against.`,
      components: []
    });
  }

  return [decision, yes_vote_count, no_vote_count];
}