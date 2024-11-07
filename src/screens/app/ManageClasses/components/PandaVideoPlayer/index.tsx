declare global {
  interface Window {
    PandaPlayer: any;
  }
}

interface PandaVideoPlayerProps {
  iframeSrc: string;
}

export const PandaVideoPlayer = ({ iframeSrc }: PandaVideoPlayerProps) => {
  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        id="panda-player"
        src={`${iframeSrc}&controlsColor=%23ffffff&color=%230267FF`}
        style={{
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
