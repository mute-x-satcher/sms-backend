const {isClientReady} = require('../whatsapp-web/client')

const whatsappClientMiddleware = async (req,res,next) => {

    try {
        const clientState = isClientReady()
        console.log(`state: ${clientState}`)
        if(clientState){
            console.log("ready")
            next()
        }else{
            console.log("not ready")
           return res.status(500).json({msg: 'WhatsApp client is initiating, kindly retry after some time'})
        
        }


    } catch (error) {
        console.log(`whatssappClientMiddleware Error: ${error}`)
    }


}

module.exports = whatsappClientMiddleware