import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { projectsQuery } from "./loader";
import ProjectsSearchFilter from "../../components/ProjectsSearchFilter";
import ProjectsContainer from "../../components/ProjectsContainer";
import PaginationBtnContainer from "../../components/PaginationBtnContainer";
import Loading from "../../components/Loading";
import { useStream } from "../../context/StreamContext";
import { useDashboardContext } from "../../context/DashboardContext";
import { useEffect, useState } from "react";

const Projects = () => {
  const [searchParams] = useSearchParams();
  const { chatClient } = useStream();
  const { user } = useDashboardContext();
  const [unreadMap, setUnreadMap] = useState();

  // Extract params from URL to pass to the API
  const params = {
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
    limit: 4, // 4 items per page
  };

  const { data, isError, isLoading } = useQuery(projectsQuery(params));

  const projects = data?.projects || [];

  const pagination = data?.pagination || { currentPage: 1, totalPages: 1 };

  /* ============ PHASE 4: LIVE UNREAD BADGES ============
     The connected Stream client already receives every chat event
     over WebSocket, so we just read countUnread() per channel and
     refresh whenever a message arrives / gets read. No webhooks. 
     
     Why don't we need webhooks or a backend here?
     Because the browser (React) and the chat server (Stream) already communicate with each other live.
     The express backend and the database (Prisma) play no role in this process, saving you a significant amount of code and effort.
  */

  useEffect(() => {
    // Guard Clause
    if (!chatClient || !user) return;

    let active = true;

    const refresh = async () => {
      try {
        const channels = await chatClient.queryChannels(
          { type: "messaging", members: { $in: [user.id] } },
          [{ last_message_at: -1 }],
          { limit: 30 },
        );

        const map = {};
        channels.forEach((channel) => {
          const projectId = (channel.id || "").replace("project-", "");
          const count = channel.countUnread();
          if (projectId && count > 0) map[projectId] = count;
        });

        if (active) setUnreadMap(map);
      } catch {
        // Chat is an enhancement — never break the Projects page
      }
    };

    refresh();

    const events = [
      "message.new",
      "notification.message_new",
      "notification.mark_read",
      "notification.channel_deleted",
      "connection.changed",
    ];
    events.forEach((event) => chatClient.on(event, refresh));

    return () => {
      active = false;
      events.forEach((event) => chatClient.off(event, refresh));
    };
  }, [chatClient, user]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-danger">
        Failed to load projects.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-page-title text-2xl font-bold text-on-surface">
            Projects
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Select a project workspace to view tasks and collaborators
          </p>
        </div>
        <Link
          to="/dashboard/add-project"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Project
        </Link>
      </div>

      {/* Search & Sort Filters */}
      <ProjectsSearchFilter />

      {/* Projects Grid & Delete Modal (+ unread badges) */}
      <ProjectsContainer projects={projects} unreadMap={unreadMap} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <PaginationBtnContainer pagination={pagination} />
      )}
    </div>
  );
};

export default Projects;
