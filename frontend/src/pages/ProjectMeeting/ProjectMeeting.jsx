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

    // Fix: keep the call in a local variable inside the effect + an active flag,
    //  so leave() is guaranteed to run on unmount, even if unmount happens mid‑join.
    let active = true;
    let myCall = null;

    const initCall = async () => {
      try {
        myCall = videoClient.call("default", `project-${projectId}`);
        await myCall.join({ create: true });

        // Unmounted while joining (StrictMode / fast navigation)? Leave immediately.
        if (!active) {
          myCall.leave().catch(() => {});
          return;
        }
        setCall(myCall);
      } catch (error) {
        console.error("Failed to join the call:", error);
      }
    };

    initCall();

    // GUARANTEED cleanup: local var + flag => leave() ALWAYS runs on unmount
    return () => {
      active = false;
      if (myCall) myCall.leave().catch(() => {});
    };
  }, [videoClient, projectId]);

  if (!videoClient || !call) return <Loading />;

  return (
    // Full-viewport overlay: escapes dashboard padding/sidebar,
    // gives the SDK exact dimensions on every screen size.
    <div className="fixed inset-0 z-50 flex flex-col bg-black overflow-hidden">
      {/* Meeting Header (fixed height) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-container shrink-0">
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

      {/* Video area: fills the remaining viewport exactly */}
      <div className="flex-1 min-h-0">
        <StreamTheme className="h-full w-full">
          <StreamCall call={call}>
            <SpeakerLayout participantsBarPosition="bottom" />
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
