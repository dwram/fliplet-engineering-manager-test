// Sample dataset (users.json)
const users = [
  { id: 1, name: "Alice", email: "alice@email.com" },
  { id: 2, name: "Bob", email: null },
  { id: 3, name: "Alice", email: "alice@email.com" },
];

// Mock API to fetch missing data
async function fetchUserData(id) {
  return { email: `user${id}@email.com` };
}

// Optimize this function:
async function processUsers(users) {
  const emailMap = new Map();
  let results = [];
  const length = users.length;

  for (let i = 0; i < length; i++) {
    const user = users[i];
    if (user.email) {

      if (!emailMap.has(user.email)) {
        emailMap.set(user.email, true);
        results.push({ ...user });
      }

    } else {
      const promise = fetchUserData(user.id).then(userData => {
        const email = userData.email;
        if (!emailMap.has(email)) {
          emailMap.set(email, true);
          return { ...user, email };
        }
      });
      results.push(promise);
    }
  }

  return await Promise.all(results);

}

/*
Assumptions:
email is the unique identifier for a user across apis
the api called returns an object with a key called email whose value represents the identifier
 */

module.exports = processUsers;