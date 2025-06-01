const getClient = require('../whatsapp-web/client')

const checkGroup = async (req,res,next) => {
 try {
        const client = getClient()
        const { groupName } = req.body;

        console.log(req.body)
        
        if (!groupName) return res.status(400).json({ msg: 'Group name required' });

        const chats = await client.getChats();
        const group = chats.find(chat =>
            chat.isGroup && chat.name.toLowerCase().trim() === groupName.toLowerCase().trim()
        );

        if(!group) return res.status(404).json({msg: 'This Whatsapp group not found'})

        const groupId = group.id._serialized

        req.groupInfo = {groupId,groupName}
        next()

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ msg: 'Group not found' });
    }
}

module.exports = checkGroup