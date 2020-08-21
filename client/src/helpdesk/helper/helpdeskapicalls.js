const { API } = require("../../backend");

//Get user by phone
export const getUserByPhone = (userId, token, phone) => {
  return fetch(`${API}user/helpdesk/${userId}`, {
    method: "POST",
    headers: {
      Authorization: token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(phone),
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => console.log(e));
};

//Get LCO by ID
export const getLco = (userId, token) => {
  return fetch(`${API}user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
      Accept: "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => console.log(e));
};
