const { getTwilioClient } = require("../helpers/getTwilioClient");
const { logFinalAction, logInitialAction, logInterimAction } = require("../helpers/logs");

const getRequiredSids = (requestBody) => {
    let flexInteractionSid, flexInteractionChannelSid, conversationSid;

    //If this has come from studio with a string of attributes
    if (requestBody.sendToFlexAttributes) {
        flexInteractionSid = requestBody.sendToFlexAttributes.flexInteractionSid;
        flexInteractionChannelSid = requestBody.sendToFlexAttributes.flexInteractionChannelSid;
        conversationSid = requestBody.sendToFlexAttributes.conversationSid;
    }

    //override any specifically passed sids
    if (requestBody.flexInteractionSid) {
        flexInteractionSid = request.body?.flexInteractionSid;
    }
    if (requestBody.flexInteractionChannelSid) {
        flexInteractionChannelSid = request.body?.flexInteractionChannelSid;
    }
    if (requestBody.conversationSid) {
        conversationSid = request.body?.conversationSid;
    }

    return { flexInteractionChannelSid, flexInteractionSid, conversationSid };
};

const updateCloseSessionAttributesController = async (request, response) => {
    logInitialAction("updating conversation attributes");

    //get all of the SID's we need to close the interaction
    const { flexInteractionSid, flexInteractionChannelSid, conversationSid } = getRequiredSids(request.body);

    logInterimAction(
        `updating conversation:${conversationSid} with interaction:${flexInteractionSid} and channel:${flexInteractionChannelSid}`
    );

    try {
        //get the conversation attributes before updating
        const conversation = await getTwilioClient().conversations.conversations(conversationSid).fetch();

        //merge current attributes with new ones
        const currentAttributes = JSON.parse(conversation.attributes);
        const newAttributes = {
            ...currentAttributes,
            flexInteractionSid: flexInteractionSid,
            flexInteractionChannelSid: flexInteractionChannelSid
        };

        //update the conversation attributes
        const updatedConversation = await getTwilioClient().conversations
            .conversations(conversationSid)
            .update({ attributes: JSON.stringify(newAttributes) });

        response.send({
            updatedConversation
        });
    } catch (error) {
        return response.status(500).send(`Couldn't close the interaction: ${error?.message}`);
    }

    logFinalAction("Conversation attributes updated");
};

module.exports = { updateCloseSessionAttributesController };
