const prisma = require("../models/prisma") 
exports.getallShop = async (req,res,next) => {
const result = await prisma.shops.findMany({
    include:{
        Categories:{
            include:{
                type:{
                    select:{
                        name:true
                    }
                }
            }
        }
    },
    where:{
        isApprove:"approved"
    }
})

res.status(200).json({result})
}

exports.resevation = async (req, res, next) => {
    try {
    const { shopId , userId ,type, id,queueNumber,branchId} =  req.body

    const countResevation = await prisma.resevations.create({
      data : {
          id,
          shopId,
          queueNumber, 
          type  ,
          branchId,
          status : "pending",
          userId
      } ,
    })
    res.status(201).json({ countResevation })
  } catch (err) {
      console.log(err)
      next(err)
  }
  }
  
  
  exports.cancel_reservate = async (req, res, next) => {
    const { id } = req.params;
    try {
      const cancel = await prisma.resevations.delete({
        where: {
          id: +id
        }
      })
      res.status(201).json({ cancel })
    } catch (err) {
      next(err)
    }
  }

  
  exports.getAllApproveUserApplication = async (req, res, next) => {
    try {
    const result = await prisma.shops.findMany({
      where: {
        isApprove: 'approved'
      },
    })
    res.status(200).json({ result });
  } catch (err) {
    next(err)
  }
}
  ;

  

exports.getallCategory = async (req,res,next) => {
    const result = await prisma.categories.findMany({
        include:{
            Categories:{
                include:{
                    shops:{
                        select:{
                            shopPicture:true,
                            shopName:true
                        }

                    }
                }
            }
        }
    })
    res.status(200).json({result})
}
