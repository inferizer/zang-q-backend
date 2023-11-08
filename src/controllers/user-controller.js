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