const { getTwilioClient } = require("../helpers/getTwilioClient");
const { logFinalAction, logInitialAction, logInterimAction } = require("../helpers/logs");

const closeSessionController = async (request, response) => {
    logInitialAction("Closing Session");

    const conversationSid = request.body?.conversationSid;

    //get the conversation attributes required to close the interaction
    try {
        const result = await getTwilioClient()
            .conversations.v1.conversations(conversationSid)
            .fetch()

        let { flexInteractionSid, flexInteractionChannelSid } = JSON.parse(result.attributes);

        logInterimAction(`Flex interaction SID: ${flexInteractionSid}`);
        logInterimAction(`Flex interaction channel SID: ${flexInteractionChannelSid}`);

        // close the interaction (https://www.twilio.com/docs/flex/developer/conversations/interactions-api/channels-subresource#close-an-interaction-channel)
        const closedInteraction = await getTwilioClient()
            .flexApi.v1.interaction(flexInteractionSid)
            .channels(flexInteractionChannelSid)
            .update({ status: "closed" });

        response.send({
            closedInteraction
        });
    } catch (error) {
        return response.status(500).send(`Couldn't close the interaction: ${error?.message}`);
    }

    logFinalAction("Session closed");
};

module.exports = { closeSessionController };
