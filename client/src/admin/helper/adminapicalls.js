const { API } = require("../../backend");

//Get All Complaints
export const getUserComplaint = (userId, token) => {
  return fetch(`${API}complaint/all/${userId}`, {
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

//Get Technician
export const getTechnicain = (userId, token) => {
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

//Get All Technician
export const getAllTechnicain = (userId, token) => {
  return fetch(`${API}user/all/${userId}`, {
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

//Get User
export const getUser = (userId, token) => {
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

//Update a complaint
export const updateComplaint = (complaintId, userId, token, complaint) => {
  return fetch(`${API}complaint/update/${complaintId}/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(complaint),
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => console.log(e));
};

//update Admin
export const updateAdmin = (userId, token, user) => {
  return fetch(`${API}user/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => console.log(e));
};

//Delete User
export const deleteUser = (userId, token) => {
  return fetch(`${API}user/${userId}`, {
    method: "DELETE",
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
