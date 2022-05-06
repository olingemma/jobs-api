const Job =require("../models/Job");
const {StatusCodes}= require("http-status-codes");
const {BadRequestError, NotFoundError}= require("../errors");

const getAllJobs= async (req,res)=>{
	const jobs = await Job.find({createdBy:req.user.userId}).sort("-createdAt");
	res.status(StatusCodes.OK).json({jobs,nbHits:jobs.length});
}

const getJob= async (req,res)=>{
	const jobId= req.params.id;
	const userId= req.user.userId;
	const job=await Job.findOne({createdBy:userId,_id:jobId});
	if(!job){
		throw new NotFoundError(`No job with id ${jobId}`)
	}
	res.status(StatusCodes.OK).json(job);
}

const createJob= async (req,res)=>{
	req.body.createdBy= req.user.userId
	const job = await Job.create(req.body);
	res.status(StatusCodes.CREATED).json({job});
}

const updateJob= async (req,res)=>{
	const jobId= req.params.id;
	const userId= req.user.userId;
	const {company,position}= req.body;
	if(company===""||position===""){
		throw new BadRequestError("Company or Positon fields cannot be empty")
	}
	const job = await Job.findOneAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true})

	res.status(StatusCodes.CREATED).json(job);

}

const deleteJob= async (req,res)=>{
	const jobId= req.params.id;
	const userId= req.user.userId;
	const deletedJob = await Job.findOneAndRemove({_id:jobId,createdBy:userId});
	if(!deletedJob){
		throw new NotFoundError(`No job with id ${jobId}`)
	}
	res.status(StatusCodes.OK).send();
	
}

module.exports= {getAllJobs, getJob,createJob,updateJob,deleteJob};
