import { TaskManager } from "@/features/tasks/components/TaskManager";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-sky-500/30">
      {/* Soft Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-40 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-100 blur-[100px] rounded-full mix-blend-multiply" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-5 md:py-10">
        <div className="max-w-3xl mx-auto mb-5 text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Task{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              Master
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Tổ chức công việc của bạn, giữ năng suất, hoàn thành nhanh chóng
          </p>
        </div>

        <TaskManager />
      </main>
    </div>
  );
}
