import { projectTasksQuery } from "./queries";

export const projectTasksLoader =
  (queryClient) =>
  async ({ params, request }) => {
    const { projectId } = params;
    const searchValues = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    await queryClient.ensureQueryData(
      projectTasksQuery(projectId, searchValues),
    );

    return { searchValues, projectId };
  };
