import { Box } from "@twilio-paste/core/box";
import { Text } from "@twilio-paste/core/text";
import { Button } from "@twilio-paste/core/button";
import { useSelector } from "react-redux";

import { AppState } from "../store/definitions";
import { containerStyles, titleStyles } from "./styles/Header.styles";
import { sessionDataHandler } from "../sessionDataHandler";

export const Header = ({ customTitle }: { customTitle?: string }) => {
    const { conversation } = useSelector((state: AppState) => ({
        conversation: state.chat.conversation
    }));

    const endInteraction = async () => {
        if (conversation?.sid) {
            sessionDataHandler.closeSession(conversation?.sid)
        }
    };

    return (
        <Box as="header" {...containerStyles}>
            <Text as="h2" {...titleStyles}>
                {customTitle || "Live Chat"}
            </Text>
            {conversation?.state?.current === "active" && (
                <Button variant="secondary" size="rounded_small" onClick={endInteraction}>
                    End Chat
                </Button>
            )}
        </Box>
    );
};
