import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  MessageList,
  MessageComposer,
  Window,
  WithComponents,
  useChatContext,
} from "stream-chat-react";

import { useStream } from "../../context/StreamContext";
import { useDashboardContext } from "../../context/DashboardContext";
import Loading from "../../components/Loading";

// Exit button rendered inside the ChannelHeader start area
const ExitChatButton = () => {
  const navigate = useNavigate();
  const { setActiveChannel } = useChatContext();

  const handleExit = () => {
    setActiveChannel(undefined);
    navigate("/dashboard/chat");
  };

  return (
    <button
      onClick={handleExit}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 mr-2.5 rounded-lg text-xs font-semibold text-on-surface bg-surface-bright hover:bg-border/70 border border-border transition-colors cursor-pointer shrink-0 shadow-2xs"
      title="Exit chat and return to conversations list"
      aria-label="Exit chat and return to conversations list"
    >
      <span className="material-symbols-outlined text-base">arrow_back</span>
      <span>Exit Chat</span>
    </button>
  );
};

// Custom empty state when no channels are available for the user
const CustomChannelListEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[280px] p-8 text-center">
    <div className="w-14 h-14 rounded-2xl bg-surface-bright flex items-center justify-center text-text-muted mb-4 border border-border shadow-2xs">
      <span className="material-symbols-outlined text-3xl">chat_bubble_outline</span>
    </div>
    <h3 className="font-section-heading text-base font-semibold text-on-surface mb-1">
      No conversations yet
    </h3>
    <p className="font-body text-xs text-text-muted max-w-sm">
      You are not assigned to any project conversations yet. Once you join or create a project, its team chat will appear here.
    </p>
  </div>
);

// Inner chat content that consumes ChatContext, Route params, and handles view switching
const ChatContent = ({ filters, sort, options, chatClient }) => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { channel, setActiveChannel } = useChatContext();

  const isChannelLoading = Boolean(channelId && (!channel || channel.id !== channelId));

  // If a channelId is in URL, ensure that channel is watched and active
  useEffect(() => {
    if (!chatClient || !channelId) return;
    if (channel && channel.id === channelId) return;

    let isMounted = true;

    const loadChannel = async () => {
      try {
        const c = chatClient.channel("messaging", channelId);
        await c.watch();
        if (isMounted) {
          setActiveChannel(c);
        }
      } catch (err) {
        console.error("Failed to load channel:", err);
        if (isMounted) {
          navigate("/dashboard/chat");
        }
      }
    };

    loadChannel();

    return () => {
      isMounted = false;
    };
  }, [channelId, chatClient, channel, navigate, setActiveChannel]);

  // When on /dashboard/chat with no channelId, ensure activeChannel is cleared
  useEffect(() => {
    if (!channelId && channel) {
      setActiveChannel(undefined);
    }
  }, [channelId, channel, setActiveChannel]);

  // When a channel is clicked from the list, update URL to /dashboard/chat/:channelId
  useEffect(() => {
    if (channel?.id && channel.id !== channelId) {
      navigate(`/dashboard/chat/${channel.id}`);
    }
  }, [channel?.id, channelId, navigate]);

  const isConversationOpen = Boolean(channelId || channel);

  return (
    <div className="h-full w-full">
      {/* 1. ALL CONVERSATIONS LIST VIEW */}
      <div
        className={`h-full flex flex-col bg-surface rounded-xl border border-border shadow-xs overflow-hidden chat-list-full-view ${
          isConversationOpen ? "hidden" : "flex"
        }`}
      >
        {/* Header for Conversation List */}
        <div className="px-5 py-4 border-b border-border bg-surface-container flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">forum</span>
            </div>
            <div>
              <h2 className="font-section-heading text-lg font-bold text-on-surface">
                Conversations
              </h2>
              <p className="font-body text-xs text-text-muted">
                Select a project chat to view messages and collaborate
              </p>
            </div>
          </div>
        </div>

        {/* Channels List — kept mounted in DOM to maintain WebSocket events and scroll position */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            setActiveChannelOnMount={false}
            EmptyStateIndicator={CustomChannelListEmptyState}
          />
        </div>
      </div>

      {/* 2. SPECIFIC CONVERSATION VIEW */}
      {isConversationOpen && (
        <div className="h-full flex flex-col bg-surface rounded-xl border border-border shadow-xs overflow-hidden chat-conversation-view">
          {isChannelLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loading />
            </div>
          ) : channel ? (
            <WithComponents overrides={{ HeaderStartContent: ExitChatButton }}>
              <Channel channel={channel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageComposer />
                </Window>
              </Channel>
            </WithComponents>
          ) : null}
        </div>
      )}
    </div>
  );
};

const Chatting = () => {
  const { chatClient } = useStream();
  const { user } = useDashboardContext();

  // The provider connects asynchronously — show loader until ready
  if (!chatClient || !user) return <Loading />;

  // Only show channels (projects) the user is a member of
  const filters = { type: "messaging", members: { $in: [user.id] } };
  const sort = [{ last_message_at: -1 }];
  const options = { limit: 20 };

  return (
    // Fixed height so MessageList scrolls internally instead of the page
    <div className="h-[calc(100vh-10.5rem)] md:h-[calc(100vh-5rem)]">
      <Chat client={chatClient} theme="messaging light">
        <ChatContent
          filters={filters}
          sort={sort}
          options={options}
          chatClient={chatClient}
        />
      </Chat>
    </div>
  );
};

export default Chatting;
