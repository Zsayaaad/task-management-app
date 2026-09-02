import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  MessageList,
  MessageComposer,
  Window,
} from "stream-chat-react";

import { useStream } from "../../context/StreamContext";
import { useDashboardContext } from "../../context/DashboardContext";
import Loading from "../../components/Loading";

const Chatting = () => {
  const { chatClient } = useStream();
  const { user } = useDashboardContext();

  // The provider connects asynchronously — show your loader until ready
  if (!chatClient || !user) return <Loading />;

  // Only show channels (projects) the user is a member of
  const filters = { type: "messaging", members: { $in: [user.id] } };
  const sort = [{ last_message_at: -1 }];
  const options = { limit: 20 };

  return (
    // Fixed height so MessageList scrolls internally instead of the page
    <div className="h-[calc(100vh-10.5rem)] md:h-[calc(100vh-5rem)]">
      <Chat client={chatClient} theme="messaging dark">
        <ChannelList filters={filters} sort={sort} options={options} />
        <Channel
          EmptyPlaceholder={
            <div className="flex h-full items-center justify-center text-text-muted">
              Select a project chat to start collaborating
            </div>
          }
        >
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageComposer />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

export default Chatting;
