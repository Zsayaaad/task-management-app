import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import { useStream } from "../../context/StreamContext";
import Loading from "../../components/Loading";

const ProjectMeeting = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { videoClient } = useStream();
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (!videoClient) return;

    const initCall = async () => {
      // 1. Create the call using the predictable ID (matches Chat!)
      const myCall = videoClient.call("default", `project-${projectId}`);

      // 2. Join or create the call (creates it if it doesn't exist)
      await myCall.join({ create: true });

      setCall(myCall);
    };

    initCall();

    // 3. Cleanup: Leave the call and turn off camera/mic when component unmounts
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
    };
  }, [videoClient, projectId]);

  if (!videoClient || !call) return <Loading />;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-background rounded-xl overflow-hidden border border-border">
      {/* Meeting Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface-container">
        <Link
          to={`/dashboard/projects/${projectId}/tasks`}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">Back to Tasks</span>
        </Link>
        <button
          onClick={() => navigate(`/dashboard/projects/${projectId}/tasks`)}
          className="px-4 py-1.5 bg-danger text-white text-sm rounded-lg hover:bg-danger/90"
        >
          Leave Meeting
        </button>
      </div>

      {/* Stream Video UI */}
      <div className="flex-1 relative bg-black">
        <StreamTheme className="h-full w-full">
          <StreamCall call={call}>
            <SpeakerLayout />
            <CallControls
              onLeave={() => navigate(`/dashboard/projects/${projectId}/tasks`)}
            />
          </StreamCall>
        </StreamTheme>
      </div>
    </div>
  );
};

export default ProjectMeeting;
