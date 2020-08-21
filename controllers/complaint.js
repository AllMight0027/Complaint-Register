const Complaint = require('../models/Complaint');

//complaint param (middleware)
exports.getComplaintById = (req,res,next,id)=>{
    Complaint.findById(id)
        .then(complaint=>{
            if(!complaint) return res.status(400).json({status:'Failed',error:"Complaint id doesn't exists"})
            req.complaint = complaint
            next();
        })
        .catch(err=>console.log(err))
}

exports.getComplaint = (req,res)=>{
    res.status(200).json(req.complaint)
}

exports.postComplaint = (req,res)=>{
    // console.log(req.body)
    // req.body.complaint.customer=req.profile
    req.body.customer=req.profile._id
    const complaint = new Complaint(req.body)
    complaint.save()
        .then(complaint=>{
            if(!complaint){
                return res.json({error:'Failed to add complaint'})
            }
            res.status(200).json(complaint)
        })
        .catch(err=>console.log(err))
}

exports.getAllComplaints = (req,res)=>{
    Complaint.find()
        .then(complaints=>{
            if(complaints.length == 0) return res.status(200).json({status:'Success',error:"No Complaint exists"})
            //complaints.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

            res.json(complaints)
        })
        .catch(err=>console.log(err))
}

exports.updateComplaint = (req,res)=>{
    Complaint.findByIdAndUpdate(
        {_id: req.complaint._id},
        {$set: req.body},
        {new: true, useFindAndModify: false}
    )
        .then(complaint=>{
            res.status(200).json(complaint)
        })
        .catch(err=>console.log(err))
}

exports.deleteComplaint = (req,res)=>{
    Complaint.findByIdAndDelete({_id: req.complaint._id})
        .then(complaint=>{
            return res.status(200).json({status:'Success',message:"Complaint Deleted"})
        })
        .catch(err=>console.log(err))
}