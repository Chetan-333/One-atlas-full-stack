import { pickFields, humanize, sampleValue } from "./fieldHelpers";

const STATUS_STYLES = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  closed: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700/60 dark:text-zinc-300",
};

function StatusPill({ value }) {
  const style = STATUS_STYLES[String(value).toLowerCase()] || STATUS_STYLES.closed;
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${style}`}>{value}</span>;
}

function BlockHeader({ label, meta }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-700">
      <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">{label}</span>
      {meta && <span className="text-[10px] text-zinc-400">{meta}</span>}
    </div>
  );
}

function NavbarBlock() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 dark:bg-black rounded-xl text-white text-xs mb-4">
      <span className="font-semibold">App</span>
      <div className="flex gap-4 text-zinc-300">
        <span>Dashboard</span>
        <span>Settings</span>
        <span>Logout</span>
      </div>
    </div>
  );
}

function TableBlock({ entity }) {
  const fields = pickFields(entity);
  const rows = [0, 1, 2];

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-4">
      <BlockHeader label="Table" meta={`${rows.length} of 128`} />
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-zinc-50/60 dark:bg-zinc-900/30">
            {fields.map((f) => (
              <th key={f.name} className="text-left px-3.5 py-2 font-medium text-zinc-500 dark:text-zinc-400">
                {humanize(f.name)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r}
              className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
            >
              {fields.map((f) => {
                const val = sampleValue(f, r);
                return (
                  <td key={f.name} className="px-3.5 py-2.5 text-zinc-600 dark:text-zinc-300">
                    {f.name.toLowerCase() === "status" ? <StatusPill value={val} /> : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormBlock({ entity }) {
  const fields = pickFields(entity);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-4">
      <BlockHeader label="Form" />
      <div className="p-4 grid sm:grid-cols-2 gap-3.5">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="text-[11px] text-zinc-400">{humanize(f.name)}</label>
            <div className="h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/40 mt-1 px-2.5 flex items-center text-xs text-zinc-400">
              {sampleValue(f, 0)}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <button className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3.5 py-2 transition-colors">
          Save {entity?.name || "Record"}
        </button>
      </div>
    </div>
  );
}

function ButtonBlock() {
  return (
    <button className="text-xs bg-zinc-900 dark:bg-emerald-600 text-white rounded-lg px-3 py-1.5 mb-4">
      Action
    </button>
  );
}

function ChartBlock() {
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-4">
      <BlockHeader label="Chart" />
      <div className="flex items-end gap-2 h-20 p-4">
        {[40, 70, 30, 90, 55].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 bg-emerald-400/70 dark:bg-emerald-500/60 rounded-t"
          />
        ))}
      </div>
    </div>
  );
}

function StatsBlock() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {["Total", "Active", "Pending"].map((s, i) => (
        <div key={s} className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-zinc-900 dark:text-white">{[128, 94, 12][i]}</div>
          <div className="text-[11px] text-zinc-400">{s}</div>
        </div>
      ))}
    </div>
  );
}

function SidebarBlock() {
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 mb-4 text-xs text-zinc-500 dark:text-zinc-400">
      Sidebar · Dashboard, Users, Settings
    </div>
  );
}

function MessageBlock() {
  return (
    <div className="text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-3 mb-4">
      Status message will appear here
    </div>
  );
}

function GenericBlock({ name }) {
  return (
    <div className="text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-3 mb-4">
      {name}
    </div>
  );
}

export function renderComponent(name, entity) {
  const c = String(name).toLowerCase();

  if (c.includes("navbar")) return <NavbarBlock key={name} />;
  if (c.includes("table") || c.includes("list") || c.includes("contact"))
    return <TableBlock key={name} entity={entity} />;
  if (c.includes("form") || c.includes("input")) return <FormBlock key={name} entity={entity} />;
  if (c.includes("chart") || c.includes("analytics") || c.includes("stats"))
    return c.includes("stats") ? <StatsBlock key={name} /> : <ChartBlock key={name} />;
  if (c.includes("button")) return <ButtonBlock key={name} />;
  if (c.includes("sidebar")) return <SidebarBlock key={name} />;
  if (c.includes("message") || c.includes("result")) return <MessageBlock key={name} />;

  return <GenericBlock key={name} name={name} />;
}
