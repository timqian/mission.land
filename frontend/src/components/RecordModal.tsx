import { useEffect } from "react";
import type { MissionRecord } from "../lib/data";
import { recordStatus, witnessTheorems } from "../lib/data";
import { GithubAvatar, authorLabel } from "./chrome";
import { formatDateI18n, useI18n } from "../lib/i18n";

/** Proof-mission witnesses embed a Lean source string under `solution`;
 *  construction-mission witnesses are plain data. Render each appropriately. */
function extractSolution(witness: unknown): string | null {
  if (witness && typeof witness === "object" && "solution" in witness) {
    const s = (witness as { solution: unknown }).solution;
    return typeof s === "string" ? s : null;
  }
  return null;
}

export function RecordModal({
  record,
  missionName,
  onClose,
}: {
  record: MissionRecord;
  missionName?: string;
  onClose: () => void;
}) {
  const { t, lang } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const solution = extractSolution(record.witness);
  const theorems = witnessTheorems(record.witness);
  const status = recordStatus(record);
  const resolved = status === "proved" || status === "refuted" || status === "formalized";
  let witnessJson: string | null = null;
  if (!solution && record.witness !== undefined) {
    try {
      witnessJson = JSON.stringify(record.witness, null, 2);
    } catch {
      witnessJson = null;
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-5 pt-[8vh]"
      onClick={onClose}
    >
      <div
        className="qcard max-h-[80vh] w-full max-w-[720px] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <GithubAvatar author={record.author} size={40} border="#b89a63" />
            <div>
              <div className="text-[20px] font-semibold text-ink">{authorLabel(record.author)}</div>
              <div className="text-[14px] text-ink-soft">
                {missionName ? `${missionName} · ` : ""}
                {formatDateI18n(record.date, lang)}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer border-0 bg-transparent text-[26px] leading-none text-ink-soft hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-[14px]">
          {status ? (
            <span
              className={`rounded-[3px] border px-2 py-1 font-display ${
                resolved
                  ? "border-quest-green/50 bg-lore text-quest-green"
                  : "border-cardline bg-card text-ink-soft"
              }`}
            >
              {status === "proved"
                ? `✓ ${t.proofProved}`
                : status === "refuted"
                  ? `✓ ${t.proofRefuted}`
                  : status === "formalized"
                    ? `✓ ${t.proofFormalized}`
                    : t.proofSanity}
            </span>
          ) : (
            <span className="rounded-[3px] border border-cardline bg-card px-2 py-1 font-display">
              {t.recordScore}: <b>{record.score}</b>
            </span>
          )}
          {record.agent && (
            <span className="rounded-[3px] border border-cardline bg-card px-2 py-1">
              {t.recordAgent}: {record.agent}
            </span>
          )}
          {record.model && (
            <span className="rounded-[3px] border border-cardline bg-card px-2 py-1">
              {t.recordModel}: {record.model}
            </span>
          )}
          {theorems && theorems.length > 0 && (
            <span className="rounded-[3px] border border-crimson/40 bg-lore px-2 py-1 text-crimson">
              {t.recordProves}: {theorems.join(", ")}
            </span>
          )}
          {record.skills?.map((s) => (
            <span
              key={s}
              className="rounded-[3px] border border-crimson/40 bg-lore px-2 py-1 text-crimson"
            >
              {s}
            </span>
          ))}
        </div>

        {record.seed && status === "sanity" && (
          <p className="mb-4 text-[15px] italic text-ink-soft">{t.sanitySeed}</p>
        )}

        {solution ? (
          <>
            <div className="mb-1 text-[13px] tracking-[1px] text-ink-soft">{t.recordSolution}</div>
            <pre className="mb-3 max-h-[320px] overflow-auto whitespace-pre-wrap break-words rounded bg-darkbox p-3 font-mono text-[13px] leading-[1.5] text-[#d6c39a]">
              {solution}
            </pre>
          </>
        ) : witnessJson ? (
          <>
            <div className="mb-1 text-[13px] tracking-[1px] text-ink-soft">{t.recordWitness}</div>
            <pre className="mb-3 max-h-[320px] overflow-auto whitespace-pre-wrap break-words rounded bg-darkbox p-3 font-mono text-[13px] leading-[1.5] text-[#d6c39a]">
              {witnessJson}
            </pre>
          </>
        ) : null}

        {record.description && (
          <p className="mb-4 text-[16px] italic text-ink-body">{record.description}</p>
        )}

        {!record.seed && (
          <a
            href={record.prUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[14px] text-crimson underline underline-offset-2"
          >
            {t.recordViewPr} ↗
          </a>
        )}
      </div>
    </div>
  );
}
