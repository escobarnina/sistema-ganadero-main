export default function LoadingSpinner({ fullScreen = false, message = '' }) {
  const inner = (
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-green-600" />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {inner}
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-16">
      {inner}
    </div>
  )
}
