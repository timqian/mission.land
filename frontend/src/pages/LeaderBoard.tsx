import { Link } from "react-router-dom";
import { Footer, GithubAvatar, Nav, Sheet, authorLabel } from "../components/chrome";
import { hall, roman, userPath } from "../lib/data";
import type { HallEntry } from "../lib/data";
import { formatNumber, useI18n, withLang } from "../lib/i18n";
import { useSound } from "../lib/sound";

function ChampionRow({ entry, rank }: { entry: HallEntry; rank: number }) {
  const { tick } = useSound();
  const { t, lang } = useI18n();
  const medal =
    rank === 1
      ? "var(--color-medal-gold)"
      : rank === 2
        ? "var(--color-medal-silver)"
        : rank === 3
          ? "var(--color-medal-bronze)"
          : "transparent";
  const numeralColor =
    rank === 1 ? "#c9a227" : rank === 2 ? "#8a8a90" : rank === 3 ? "#b0763a" : "#6a5230";
  return (
    <Link
      to={withLang(userPath(entry.author), lang)}
      onMouseEnter={tick}
      className={
        entry.isAgent
          ? "grid grid-cols-[56px_52px_1fr_150px_130px] items-center gap-3.5 border border-dashed border-crimson bg-lore px-4 py-2.5 max-md:grid-cols-[40px_44px_1fr_90px]"
          : "qrow grid grid-cols-[56px_52px_1fr_150px_130px] items-center gap-3.5 px-4 py-2.5 max-md:grid-cols-[40px_44px_1fr_90px]"
      }
      style={
        rank <= 3 && !entry.isAgent
          ? {
              borderLeft: `5px solid ${medal}`,
              background:
                rank === 1 ? "linear-gradient(90deg,#f7edcf,#f2e4bd)" : undefined,
              boxShadow: rank === 1 ? "1px 2px 0 rgba(90,60,30,.18)" : undefined,
            }
          : undefined
      }
    >
      <div
        className="text-center font-display"
        style={{ fontSize: rank === 1 ? 26 : rank <= 3 ? 24 : 20, color: numeralColor }}
      >
        {roman(rank)}
      </div>
      <GithubAvatar author={entry.author} size={44} border={rank === 1 ? "#c9a227" : "#b89a63"} />
      <div>
        <div className="text-[22px] font-semibold text-ink">
          {authorLabel(entry.author)}
          {entry.isAgent && (
            <span className="ml-2 rounded-[3px] border border-crimson px-[5px] align-[2px] text-[13px] text-crimson">
              {t.automaton}
            </span>
          )}
        </div>
        <div className="text-[15px] italic text-ink-soft">{entry.note}</div>
      </div>
      <div className="text-center max-md:hidden">
        <div className="text-[15px] text-ink-muted">{t.records}</div>
        <div className="font-display text-[22px] text-ink">{entry.records}</div>
      </div>
      <div className="text-right text-[18px] font-bold text-gold max-md:col-start-4">
        {formatNumber(entry.xp, lang)} {t.xp}
      </div>
    </Link>
  );
}

export default function LeaderBoard() {
  const { t } = useI18n();

  return (
    <div className="bg-tavern min-h-screen">
      <div className="mx-auto max-w-[1120px] p-[26px] max-md:p-3">
        <div className="mb-[22px]">
          <Nav />
        </div>
        <Sheet>
          {/* hall of champions */}
          <div className="pt-1">
            <div className="mb-5 text-center">
              <h2 className="m-0 font-display text-[28px] font-black text-ink max-md:text-[22px]">
                {t.adventurersWhoClaimed}
              </h2>
            </div>
            <div className="mx-auto flex max-w-[820px] flex-col gap-2.5">
              {hall.length === 0 ? (
                <div className="py-6 text-center text-[19px] italic text-ink-soft">
                  {t.hallEmpty}
                </div>
              ) : (
                hall.map((entry, i) => (
                  <ChampionRow key={entry.author} entry={entry} rank={i + 1} />
                ))
              )}
            </div>
            <div className="mt-4 text-center text-[17px] italic text-ink-soft">
              {t.hallNote}
            </div>
          </div>
        </Sheet>
        <Footer />
      </div>
    </div>
  );
}
