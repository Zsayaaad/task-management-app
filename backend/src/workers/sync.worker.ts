import { Worker, Job } from "bullmq";
import { queueConnection } from "../lib/queueConnection.js";
import { SyncJobPayload } from "../lib/queues.js";
import { chatClient } from "../lib/stream.js";
import { imagekit } from "../lib/imagekit.js";

/**
 * The programming objective of this file is to prevent any blocking of the Main Thread in the project.
 * Instead of making the user wait for a response from a slow external API (such as Stream or ImageKit),
 * the request is placed in the queue and the server returns the response immediately,
 * and then this Worker takes care of the execution in the background.
 */

const processor = async (job: Job<SyncJobPayload>) => {
  const { name, data } = job.data;

  switch (name) {
    case "stream.channel.create": {
      const { projectId, projectName, creatorId, creatorName, creatorRole } =
        data;
      await chatClient.upsertUsers([
        {
          id: creatorId,
          name: creatorName,
          role: creatorRole === "ADMIN" ? "admin" : "user",
        },
      ]);
      const channel = chatClient.channel("messaging", `project-${projectId}`, {
        name: projectName,
        created_by_id: creatorId,
        members: [creatorId],
      });
      await channel.create();
      break;
    }

    case "stream.channel.update": {
      const channel = chatClient.channel(
        "messaging",
        `project-${data.projectId}`,
      );
      await channel.update({ name: data.name });
      break;
    }

    case "stream.channel.delete": {
      const channel = chatClient.channel(
        "messaging",
        `project-${data.projectId}`,
      );
      await channel.delete();
      break;
    }

    case "stream.member.add": {
      const { projectId, userId, userName, userRole, addedById } = data;
      await chatClient.upsertUsers([
        {
          id: userId,
          name: userName,
          role: userRole === "ADMIN" ? "admin" : "user",
        },
      ]);
      const channel = chatClient.channel("messaging", `project-${projectId}`);
      await channel.addMembers([userId]);
      await channel.sendMessage({
        text: `${userName} was added to the project.`,
        user_id: addedById,
        silent: true,
      });
      break;
    }

    case "stream.member.remove": {
      const { projectId, userId, userName, requesterId } = data;
      const channel = chatClient.channel("messaging", `project-${projectId}`);
      await channel.removeMembers([userId]);
      await channel.sendMessage({
        text: `${userName} was removed from the project`,
        user_id: requesterId,
        silent: true,
      });
      break;
    }

    case "stream.announce": {
      const { projectId, text, senderId } = data;
      const channel = chatClient.channel("messaging", `project-${projectId}`);
      await channel.sendMessage({ text, user_id: senderId, silent: true });
      break;
    }

    case "imagekit.delete": {
      // await imagekit.deleteFile(data.filePath);
      const files = await imagekit.listFiles({
        name: data.fileName,
      });
      if (files.length > 0 && "fileId" in files[0]) {
        await imagekit.deleteFile(files[0].fileId);
      }
      break;
    }

    default:
      console.warn(`Unknown job name: ${(job.data as any).name}`);
  }
};

export const syncWorker = new Worker<SyncJobPayload>("sync", processor, {
  connection: queueConnection,
  concurrency: 5, // Process up to 5 jobs in parallel
});

syncWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} (${job.data.name}) completed`);
});

syncWorker.on("failed", (job, err) => {
  console.error(
    `❌ Job ${job?.id} (${job?.data.name}) failed (attempt ${job?.attemptsMade}/${job?.opts.attempts}):`,
    err.message,
  );
});
