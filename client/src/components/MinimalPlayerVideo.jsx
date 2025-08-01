export default function MinimalVideoPlayer({ src }) {
  return (
    <video
      src={src}
      controls
      className="w-full rounded-2xl shadow-sm"
      style={{ outline: "none" }}
    >
      Seu navegador não suporta vídeos.
    </video>
  )
}
