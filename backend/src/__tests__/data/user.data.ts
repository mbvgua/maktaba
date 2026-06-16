/*
 * constant users, tobe used in testing
 * have not strong typed them to IUser models?!?!
 */

export let newUser = {
  username: "merlin",
  email: "merlin@gmail.com",
  password: "@Merlin25",
  role: "student",
};

export let invalidNewuser = {
  username: "",
  email: "",
  password: "",
  role: "",
}

let existingUser = {
  username: "maximus",
  email: "maximus@gmail.com",
  password: "@Maximus25",
};

let nonExistingUser = {
  username: "minimus",
  email: "minimus@gmail.com",
  password: "@Minimus25",
};

let incorrectUserDetails = {
  username: "@percy",
  password: "percy1234",
};
