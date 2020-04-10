/**
 * Returns the actual name from a user object with a given user ID from Slack
 * @param {string} id Slack User ID
 * @returns {*} Slack User Name
 */

exports.getName = (id, userList = []) => {
  let user = userList.find(u => u.id === id);
  return user ? user.name : '';
};