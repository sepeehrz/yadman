"use client";

import { useState } from "react";
import { useLifeHub } from "@/store/LifeHubContext";
import { faNum } from "@/lib/format";
import type { TaskReminder } from "@/lib/types";

const CATEGORY_FA: Record<TaskReminder["category"], string> = {
  work: "کاری",
  health: "سلامت",
  home: "خانه",
  auto: "خودرو",
  finance: "مالی",
};

export function TasksScreen() {
  const {
    tasks,
    checklists,
    toggleTask,
    toggleChecklistItem,
    resetChecklist,
    setQuickAddOpen,
    showToast,
    addTask,
  } = useLifeHub();

  const [mainTab, setMainTab] = useState<"reminders" | "checklists">("reminders");
  const [subFilter, setSubFilter] =
    useState<"all" | "urgent" | "work" | "health" | "recurring">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [smartSuggestionAdded, setSmartSuggestionAdded] = useState(false);
  const [expandedPacks, setExpandedPacks] = useState<Record<string, boolean>>({
    "camping-pack": true,
    "groceries-pack": false,
    "travel-pack": false,
  });

  const filteredTasks = tasks.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
    }
    if (subFilter === "urgent") return t.priority === "high";
    if (subFilter === "work") return t.category === "work";
    if (subFilter === "health") return t.category === "health";
    if (subFilter === "recurring") return !!t.recurring;
    return true;
  });

  const todayTasks = filteredTasks.filter((t) => t.dueDateCategory === "today");
  const tomorrowTasks = filteredTasks.filter((t) => t.dueDateCategory === "tomorrow");
  const upcomingTasks = filteredTasks.filter((t) => t.dueDateCategory === "upcoming");

  const pendingCount = tasks.filter((t) => !t.done).length;

  const handleAddSuggestion = () => {
    const newTask: TaskReminder = {
      id: `task-suggested-${Date.now()}`,
      title: "تمدید معاینه فنی خودرو",
      dueTime: "۱۵ آبان، ساعت ۱۷:۰۰",
      dueDateCategory: "upcoming",
      priority: "high",
      category: "auto",
      location: "پرتال آنلاین",
      done: false,
    };
    addTask(newTask);
    setSmartSuggestionAdded(true);
    showToast("«تمدید معاینه فنی خودرو» به یادآورها اضافه شد!");
  };

  const toggleExpand = (packId: string) => {
    setExpandedPacks((prev) => ({ ...prev, [packId]: !prev[packId] }));
  };

  const taskCard = (task: TaskReminder, badge: React.ReactNode) => (
    <div
      key={task.id}
      className={`bg-white rounded-2xl p-4 shadow-xs border relative overflow-hidden transition-all duration-300 ${
        task.done ? "opacity-60 bg-[#f8f9ff]" : "border-[#e2e8f0]/80"
      }`}
    >
      <div
        className={`absolute right-0 top-0 bottom-0 w-1.5 ${
          task.priority === "high" ? "bg-[#ba1a1a]" : "bg-[#4f46e5]"
        }`}
      />
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          aria-label="تغییر وضعیت انجام"
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            task.done
              ? "bg-[#006e4b] text-white"
              : "bg-[#eff4ff] text-transparent hover:bg-[#e5eeff] border border-[#c7c4d8]"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">check</span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            {badge}
            <span
              className={`text-[11px] font-semibold flex items-center gap-1 ${
                task.priority === "high" ? "text-[#ba1a1a]" : "text-[#545f73]"
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">schedule</span> {task.dueTime}
            </span>
          </div>

          <p
            className={`text-sm sm:text-base font-bold text-[#0b1c30] mt-1 transition-all ${
              task.done ? "line-through text-[#545f73]" : ""
            }`}
          >
            {task.title}
          </p>

          {(task.source || task.location) && (
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#545f73]">
              {task.source && (
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">apartment</span> {task.source}
                </span>
              )}
              {task.location && (
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>{" "}
                  {task.location}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-28 space-y-4">
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#3525cd] font-bold">بهره‌وری و لجستیک</span>
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#0b1c30] tracking-tight">
              کارها و لیست‌ها
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d5e0f8] text-[#111c2d]">
            {faNum(pendingCount)} فعال
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 flex items-center h-12 bg-white rounded-xl px-3.5 shadow-xs border border-[#e2e8f0]/80">
            <span className="material-symbols-outlined text-[#545f73] text-[20px] ml-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جست‌وجوی کارها، اقلام، برچسب‌ها..."
              className="w-full bg-transparent text-sm text-[#0b1c30] placeholder:text-[#545f73] focus:outline-none font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-xs text-[#545f73] hover:text-[#0b1c30]">
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => showToast("ترجیحات فیلتر: مرتب‌سازی بر اساس موعد و فوریت")}
            aria-label="فیلترها"
            className="w-12 h-12 flex items-center justify-center bg-white text-[#464555] rounded-xl shadow-xs border border-[#e2e8f0]/80 hover:bg-[#eff4ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </div>

      <div className="p-1 bg-[#e5eeff] rounded-xl grid grid-cols-2">
        <button
          onClick={() => setMainTab("reminders")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
            mainTab === "reminders" ? "bg-white text-[#3525cd] shadow-xs font-bold" : "text-[#545f73] hover:text-[#0b1c30]"
          }`}
        >
          <span>یادآورها</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              mainTab === "reminders" ? "bg-[#e2dfff] text-[#0f0069] font-bold" : "bg-[#dce9ff] text-[#545f73]"
            }`}
          >
            {faNum(tasks.length)}
          </span>
        </button>
        <button
          onClick={() => setMainTab("checklists")}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
            mainTab === "checklists" ? "bg-white text-[#3525cd] shadow-xs font-bold" : "text-[#545f73] hover:text-[#0b1c30]"
          }`}
        >
          <span>چک‌لیست‌ها</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              mainTab === "checklists" ? "bg-[#e2dfff] text-[#0f0069] font-bold" : "bg-[#dce9ff] text-[#545f73]"
            }`}
          >
            {faNum(checklists.length)}
          </span>
        </button>
      </div>

      {mainTab === "reminders" && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {(
              [
                { id: "all", label: `همه (${faNum(tasks.length)})` },
                { id: "work", label: "💼 کاری" },
                { id: "health", label: "🩺 سلامت" },
                { id: "recurring", label: "🔄 تکرارشونده" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  subFilter === f.id
                    ? "bg-[#4f46e5] text-white shadow-xs font-bold"
                    : "bg-[#eff4ff] text-[#464555] hover:bg-[#e5eeff]"
                }`}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => setSubFilter("urgent")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                subFilter === "urgent"
                  ? "bg-[#ffdad6] text-[#93000a] font-bold shadow-xs"
                  : "bg-[#eff4ff] text-[#464555] hover:bg-[#e5eeff]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse" />
              فوری ({faNum(tasks.filter((t) => t.priority === "high").length)})
            </button>
          </div>

          {todayTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  <h2 className="text-sm font-bold text-[#0b1c30]">موعد امروز</h2>
                </div>
                <span className="text-xs text-[#545f73] font-medium">
                  {faNum(todayTasks.filter((t) => !t.done).length)} در انتظار
                </span>
              </div>
              {todayTasks.map((task) =>
                taskCard(
                  task,
                  task.priority === "high" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                      <span className="w-1 h-1 rounded-full bg-[#ba1a1a]" /> اولویت بالا
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6ffbbe]/30 text-[#005338]">
                        {CATEGORY_FA[task.category]}
                      </span>
                      {task.recurring && (
                        <span className="inline-flex items-center gap-0.5 text-[#545f73] text-[10px] font-medium">
                          <span className="material-symbols-outlined text-[12px]">sync</span> {task.recurring}
                        </span>
                      )}
                    </div>
                  ),
                ),
              )}
            </div>
          )}

          {tomorrowTasks.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#545f73]" />
                  <h2 className="text-sm font-bold text-[#0b1c30]">فردا</h2>
                </div>
                <span className="text-xs text-[#545f73] font-medium">۴ آبان</span>
              </div>
              {tomorrowTasks.map((task) =>
                taskCard(
                  task,
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#0b1c30]">
                    خانه و نگهداری
                  </span>,
                ),
              )}
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4f46e5]" />
                  <h2 className="text-sm font-bold text-[#0b1c30]">آینده</h2>
                </div>
              </div>
              {upcomingTasks.map((task) =>
                taskCard(
                  task,
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#0b1c30]">
                    {CATEGORY_FA[task.category]}
                  </span>,
                ),
              )}
            </div>
          )}

          {!smartSuggestionAdded && (
            <div className="bg-[#eff4ff] rounded-2xl p-4 flex items-center gap-3 border border-[#dce9ff]">
              <div className="w-10 h-10 rounded-xl bg-[#6ffbbe] flex items-center justify-center text-[#002113] flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0b1c30]">پیشنهاد هوشمند</p>
                <p className="text-xs text-[#545f73] truncate">تمدید معاینه فنی تا ۱۲ روز دیگر موعد دارد.</p>
              </div>
              <button
                onClick={handleAddSuggestion}
                className="px-3.5 py-1.5 rounded-lg bg-white text-xs font-bold text-[#3525cd] shadow-xs hover:bg-[#dce9ff] active:scale-95 transition-all"
              >
                افزودن
              </button>
            </div>
          )}
        </div>
      )}

      {mainTab === "checklists" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0b1c30]">بسته‌های آماده</h2>
              <p className="text-xs text-[#545f73]">قالب‌های تکرارشونده سبک زندگی و سفر</p>
            </div>
            <button
              onClick={() => {
                resetChecklist("camping-pack");
                showToast("همه بسته‌ها برای چرخه جدید ریست شد!");
              }}
              className="flex items-center gap-1 text-xs text-[#3525cd] font-bold py-1.5 px-3 rounded-lg hover:bg-[#eff4ff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>ریست همه</span>
            </button>
          </div>

          {checklists.map((pack) => {
            const completedCount = pack.items.filter((i) => i.completed).length;
            const totalCount = pack.items.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isExpanded = expandedPacks[pack.id] ?? false;

            return (
              <div key={pack.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e2e8f0]/80 overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <div onClick={() => toggleExpand(pack.id)} className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px]">{pack.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-[#0b1c30] truncate">{pack.title}</h3>
                      <p className="text-xs text-[#545f73] mt-0.5">
                        {faNum(completedCount)} از {faNum(totalCount)} قلم ({faNum(percent)}٪)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pack.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006e4b] text-white">
                        فعال
                      </span>
                    )}
                    <button
                      onClick={() => toggleExpand(pack.id)}
                      className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#545f73]"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isExpanded ? "expand_less" : "expand_more"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="w-full bg-[#e5eeff] h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#4f46e5] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {isExpanded && (
                  <div className="flex flex-col space-y-2 mt-3 pt-2 border-t border-[#f1f5f9]">
                    {pack.items.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                          item.completed ? "bg-[#eff4ff]" : "bg-white hover:bg-[#eff4ff]/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(pack.id, item.id)}
                          className="w-5 h-5 rounded accent-[#4f46e5] cursor-pointer"
                        />
                        <span
                          className={`text-xs sm:text-sm flex-1 transition-all ${
                            item.completed ? "line-through text-[#545f73]" : "text-[#0b1c30] font-medium"
                          }`}
                        >
                          {item.text}
                        </span>
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            item.completed ? "text-[#006e4b]" : "text-[#c7c4d8]"
                          }`}
                        >
                          {item.completed ? "verified" : "radio_button_unchecked"}
                        </span>
                      </label>
                    ))}

                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#f1f5f9]">
                      <button
                        onClick={() => {
                          resetChecklist(pack.id);
                          showToast(`«${pack.title}» برای چرخه بعدی ریست شد`);
                        }}
                        className="flex items-center gap-1.5 text-xs text-[#545f73] hover:text-[#3525cd] font-semibold py-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">cached</span>
                        <span>ریست برای چرخه بعدی</span>
                      </button>
                      <button
                        onClick={() => setQuickAddOpen(true)}
                        className="text-xs font-bold text-[#3525cd] hover:underline"
                      >
                        + افزودن قلم
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-3 pb-2 flex justify-center">
        <button
          onClick={() => setQuickAddOpen(true)}
          className="flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#4f46e5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#4f46e5]/25 hover:bg-[#3525cd] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>مورد یا یادآور جدید</span>
        </button>
      </div>
    </div>
  );
}
