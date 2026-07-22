import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Footer, GithubAvatar, Nav, Sheet, authorLabel } from "../components/chrome";
import { RecordModal } from "../components/RecordModal";
import { formatNumber, formatDateI18n, useI18n, withLang } from "../lib/i18n";
import { missionByNum, recordStatus, userProfile, witnessTheorems } from "../lib/data";
import type { UserRecord } from "../lib/data";
import { useSound } from "../lib/sound";

function TagRow({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 text-[15px]">
      <span className="text-ink-soft">{label}:</span>
      {values.map((v) => (
        <span key={v} className="rounded-[3px] border border-cardline bg-card px-2 py-0.5 text-ink-body">
          {v}
        </span>
      ))}
    </div>
  );
}

export default function UserProfile() {
  const { handle } = useParams();
  const author = decodeURIComponent(handle ?? "");
  const { t, lang } = useI18n();
  const { tick } = useSound();
  const [openRecord, setOpenRecord] = useState<UserRecord | null>(null);

  if (!author) return <Navigate to="/" replace />;

  const profile = userProfile(author);

  return (
    <div className="bg-tavern-deep min-h-screen">
      <div className="mx-auto max-w-[1120px] px-5 pb-[60px] pt-6 text-[#3a2c1a] max-md:px-3">
        <div className="mb-5">
          <Nav back />
        </div>
        <Sheet>
          {/* profile header */}
          <div className="mb-[26px] flex items-center justify-between gap-4 border-b-2 border-divider pb-[22px]">
            <div className="flex items-center gap-4">
              <GithubAvatar author={author} size={64} border="#b89a63" />
              <div>
                <div className="mb-1 font-display text-[13px] tracking-[4px] text-ink-soft">
                  {t.adventurerLabel}
                </div>
                <h1 className="font-display text-[32px] font-black leading-tight text-ink max-md:text-[24px]">
                  {authorLabel(author)}
                </h1>
              </div>
            </div>
              <a
                href={`https://github.com/${author}`}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={tick}
                className="shrink-0 text-[15px] text-crimson underline underline-offset-2"
              >
                GitHub ↗
              </a>
          </div>

          {!profile ? (
            <div className="py-8 text-center text-[18px] italic text-ink-soft">
              {t.userNoRecords}
            </div>
          ) : (
            <>
              {/* stats */}
              <div className="mb-7 grid grid-cols-2 gap-[26px] max-md:grid-cols-1">
                <div className="qcard flex items-center justify-between px-6 py-[18px]">
                  <span className="text-[18px] text-ink-muted">{t.records}</span>
                  <b className="font-display text-[36px] font-black text-ink">
                    {profile.records.length}
                  </b>
                </div>
                <div className="qcard flex items-center justify-between px-6 py-[18px]">
                  <span className="text-[18px] text-ink-muted">{t.xp}</span>
                  <b className="font-display text-[36px] font-black text-gold">
                    {formatNumber(profile.totalXp, lang)}
                  </b>
                </div>
              </div>

              {(profile.agentsUsed.length > 0 ||
                profile.modelsUsed.length > 0 ||
                profile.skillsUsed.length > 0) && (
                <div className="mb-7 border-l-[5px] border-divider bg-lore px-[22px] py-[16px]">
                  <TagRow label={t.userAgentsUsed} values={profile.agentsUsed} />
                  <TagRow label={t.userModelsUsed} values={profile.modelsUsed} />
                  <TagRow label={t.userSkillsUsed} values={profile.skillsUsed} />
                </div>
              )}

              {/* proposed missions */}
              {profile.proposedMissions.length > 0 && (
                <div className="mb-7">
                  <div className="mb-3.5 font-display text-[16px] tracking-[3px] text-ink-soft">
                    {t.userProposedHeading}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.proposedMissions.map((num) => {
                      const m = missionByNum(num);
                      if (!m) return null;
                      return (
                        <Link
                          key={num}
                          to={withLang(`/m/${num}`, lang)}
                          onMouseEnter={tick}
                          className="rounded-[3px] border border-cardline bg-card px-2.5 py-1 text-[15px] text-crimson underline underline-offset-2"
                        >
                          {m.name[lang]}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* record log */}
              <div>
                <div className="mb-3.5 font-display text-[16px] tracking-[3px] text-ink-soft">
                  {t.userRecordsHeading}
                </div>
                <div className="flex flex-col gap-2">
                  {profile.records.map((r) => {
                    const m = missionByNum(r.missionNum);
                    const theorems = witnessTheorems(r.witness);
                    const status = recordStatus(r);
                    const solved = status === "proved" || status === "refuted" || status === "formalized";
                    return (
                      <div
                        key={`${r.missionNum}-${r.score}-${r.date}`}
                        onMouseEnter={tick}
                        onClick={() => setOpenRecord(r)}
                        className="qrow qrow-slide grid cursor-pointer grid-cols-[70px_1fr_130px] items-center gap-3.5 px-4 py-[9px] max-md:grid-cols-[56px_1fr]"
                      >
                        {status ? (
                          <span
                            className={`font-display text-[15px] font-black leading-tight ${
                              solved ? "text-quest-green" : "text-ink-soft"
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
                          <span className="font-display text-[26px] font-black text-ink">
                            {r.score}
                          </span>
                        )}
                        <span className="text-[19px] text-ink-body">
                          {m ? (
                            <Link
                              to={withLang(`/m/${m.num}`, lang)}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={tick}
                              className="text-crimson underline underline-offset-2"
                            >
                              {m.name[lang]}
                            </Link>
                          ) : (
                            r.missionNum
                          )}
                          {theorems && theorems.length > 0 && (
                            <span className="ml-2 text-[14px] text-ink-soft">
                              · {t.recordProves.toLowerCase()}: {theorems.join(", ")}
                            </span>
                          )}
                          {r.agent && (
                            <span className="ml-2 text-[14px] text-ink-soft">· {r.agent}</span>
                          )}
                        </span>
                        <span className="text-right text-[16px] text-ink-soft max-md:hidden">
                          {formatDateI18n(r.date, lang)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </Sheet>
        <Footer />
      </div>
      {openRecord && (
        <RecordModal
          record={openRecord}
          missionName={missionByNum(openRecord.missionNum)?.name[lang]}
          onClose={() => setOpenRecord(null)}
        />
      )}
    </div>
  );
}
