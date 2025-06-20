const {getClient} = require('../whatsapp-web/client')

const checkGroup = async (req,res,next) => {
 try {
        const client = getClient()
        let { groupName } = req.body;

        console.log(req.body)
        
        if (!groupName) return res.status(400).json({ msg: 'Group name required' });

        const chats = await client.getChats();
        const group = chats.find(chat =>
            chat.isGroup && chat.name.toLowerCase().trim() === groupName.toLowerCase().trim()
        );

       
        if(!group) return res.status(404).json({msg: 'This Whatsapp group not found'})

        console.log('entered group name:',groupName)    
        const groupId = group.id._serialized
        groupName = group.name
        console.log('updated:',groupName)
        req.groupInfo = {groupId,groupName}
        next()

    } catch (error) {
        console.error('Whatsapp Group Validation Error:', error);
        return res.status(500).json({ msg: 'Whatsapp group not found' });
    }
}

module.exports = checkGroup