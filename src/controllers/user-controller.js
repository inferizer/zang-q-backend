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
