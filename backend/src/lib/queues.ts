import { Queue } from "bullmq";
import { queueConnection } from "./queueConnection.js";

// Define job payloads for type safety
export type StreamChannelCreateJob = {
  projectId: string;
  projectName: string;
  creatorId: string;
  creatorName: string;
  creatorRole: string;
};

export type StreamChannelUpdateJob = { projectId: string; name: string };

export type StreamChannelDeleteJob = { projectId: string };

export type StreamMemberAddJob = {
  projectId: string;
  userId: string;
  userName: string;
  userRole: string;
  addedById: string;
};

export type StreamMemberRemoveJob = {
  projectId: string;
  userId: string;
  userName: string;
  requesterId: string;
};

export type StreamAnnounceJob = {
  projectId: string;
  text: string;
  senderId: string;
};

export type ImageKitDeleteJob = { fileName: string };

// The actual data structure enqueued
export type SyncJobPayload =
  | { name: "stream.channel.create"; data: StreamChannelCreateJob }
  | { name: "stream.channel.update"; data: StreamChannelUpdateJob }
  | { name: "stream.channel.delete"; data: StreamChannelDeleteJob }
  | { name: "stream.member.add"; data: StreamMemberAddJob }
  | { name: "stream.member.remove"; data: StreamMemberRemoveJob }
  | { name: "stream.announce"; data: StreamAnnounceJob }
  | { name: "imagekit.delete"; data: ImageKitDeleteJob };

export const syncQueue = new Queue<SyncJobPayload>("sync", {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000, // 2s, 4s, 8s, 16s, 32s
    },
    removeOnComplete: { count: 1000 }, // Keep last 1000 completed
    removeOnFail: { count: 5000 }, //  Keep last 5000 failed
  },
});
