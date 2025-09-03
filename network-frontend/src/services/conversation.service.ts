import { Attachment, MessageResponse } from "@/types/message";
import { AttachmentSummaryResponse, MessageSummaryResponse } from "@/types/conversation";

export const ConservationService = {
    mapToSummary(message: MessageResponse): MessageSummaryResponse {
        return {
            id: message.id,
            content: message.content ?? "",
            createdAt: message.createdAt,
            senderId: message.sender?.user?.id!,
            senderFullName: message.sender.user
                ? `${message.sender.user.firstName} ${message.sender.user.lastName}`
                : "Unknown",
            attachments: message.attachments.map((a: Attachment): AttachmentSummaryResponse => ({   
                type: a.type,
            })),
        };
    },
};
