export function findEntity(dataSchema, entityName) {
  if (!dataSchema?.entities || !entityName) return null;
  return dataSchema.entities.find((e) => e.name === entityName) || null;
}

const HIDDEN_FIELDS = new Set(["id", "tenantid", "createdat", "updatedat", "deletedat"]);

const FALLBACK_FIELDS = [
  { name: "name", type: "string" },
  { name: "status", type: "string" },
];

// Boilerplate columns (id, tenantId, createdAt...) are always first in the
// schema but rarely what's worth previewing — prefer real business fields,
// and only fall back to boilerplate if that's genuinely all the entity has.
export function pickFields(entity) {
  if (!entity) return FALLBACK_FIELDS;

  const all = entity.fields.filter((f) => !f.isRelation);
  const meaningful = all.filter((f) => !HIDDEN_FIELDS.has(f.name.toLowerCase()));
  const chosen = meaningful.length > 0 ? meaningful : all;

  return chosen.length > 0 ? chosen.slice(0, 5) : FALLBACK_FIELDS;
}

export function humanize(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase());
}

const SAMPLE_SETS = {
  name: ["Ava Thompson", "Marcus Lee", "Priya Nair"],
  firstname: ["Ava", "Marcus", "Priya"],
  lastname: ["Thompson", "Lee", "Nair"],
  email: ["ava@example.com", "marcus@example.com", "priya@example.com"],
  phone: ["+1 555-0142", "+1 555-0198", "+1 555-0173"],
  status: ["Active", "Pending", "Closed"],
  address: ["221B Baker St", "44 Elm Ave", "9 Pine Ct"],
  street: ["221B Baker St", "44 Elm Ave", "9 Pine Ct"],
  city: ["Austin", "Denver", "Seattle"],
  state: ["TX", "CO", "WA"],
  price: ["$425,000", "$310,500", "$189,900"],
  amount: ["$1,250.00", "$430.00", "$980.00"],
  title: ["Follow-up call", "Site visit", "Contract review"],
  description: ["Initial outreach", "Needs review", "Awaiting signature"],
  notes: ["Called, left voicemail", "Interested in 3BR", "Sent proposal"],
};

export function sampleValue(field, index = 0) {
  const key = String(field.name || "").toLowerCase();
  if (SAMPLE_SETS[key]) return SAMPLE_SETS[key][index % SAMPLE_SETS[key].length];

  switch (field.type) {
    case "number":
      return [42, 17, 8][index % 3];
    case "boolean":
      return index % 2 === 0 ? "Yes" : "No";
    case "date":
      return ["Mar 12, 2026", "Feb 28, 2026", "Jan 15, 2026"][index % 3];
    case "datetime":
      return ["Mar 12, 2026 · 10:04 AM", "Feb 28, 2026 · 3:20 PM", "Jan 15, 2026 · 9:15 AM"][index % 3];
    case "enum":
      return ["Option A", "Option B", "Option C"][index % 3];
    default:
      return ["Sample text", "Example value", "Preview data"][index % 3];
  }
}
