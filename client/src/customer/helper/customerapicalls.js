const { API } = require("../../backend");

//Get All Complaints
export const getUserComplaint = (userId, token)=>{
    return fetch(`${API}complaint/all/${userId}`,{
        method: 'GET',
        headers:{
            Authorization: token,
            Accept: 'application/json'
        }
    })
    .then(res =>{
        return res.json()
    })
    .catch(e=>console.log(e))
}

//Post a complaint
export const postComplaint = (userId, token, description)=>{
    return fetch(`${API}complaint/create/${userId}`,{
        method: 'POST',
        headers:{
            Authorization: token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(description)
    })
    .then(res =>{
        return res.json()
    })
    .catch(e=>console.log(e))
}

//update customer
export const updateCustomer = (userId, token, user)=>{
    return fetch(`${API}user/${userId}`,{
        method: 'PUT',
        headers:{
            Authorization: token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(res =>{
        return res.json()
    })
    .catch(e=>console.log(e))
}

//Get All Lcos
export const getAllLco = ()=>{
    return fetch(`${API}user/lco/all`,{
        method: 'GET'
    })
    .then(res =>{
        return res.json()
    })
    .catch(e=>console.log(e))
}

//Get LCO by ID
export const getLco = (userId, token)=>{
    return fetch(`${API}user/${userId}`,{
        method: 'GET',
        headers:{
            Authorization: token,
            Accept: 'application/json'
        }
    })
    .then(res =>{
        return res.json()
    })
    .catch(e=>console.log(e))
}
