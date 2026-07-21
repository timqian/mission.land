import { Link, Navigate, useParams } from "react-router-dom";
import { Footer, GithubAvatar, Nav, Sheet, authorLabel } from "../components/chrome";
import { hall, leaderboardPath, proposersHall, roman, solversHall, userPath } from "../lib/data";
import type { BoardKey, HallEntry } from "../lib/data";
import { formatNumber, useI18n, withLang } from "../lib/i18n";
import { useSound } from "../lib/sound";

function ChampionRow({
  entry,
  rank,
  countLabel,
}: {
  entry: HallEntry;
  rank: number;
  countLabel: string;
}) {
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
          ? "grid grid-cols-[56px_52px_1fr_150px_130px] items-center gap-3.5 border border-dashed border-crimson bg-lore px-4 py-2.5 max-md:grid-cols-[34px_40px_minmax(0,1fr)_auto] max-md:gap-2 max-md:px-2.5"
          : "qrow grid grid-cols-[56px_52px_1fr_150px_130px] items-center gap-3.5 px-4 py-2.5 max-md:grid-cols-[34px_40px_minmax(0,1fr)_auto] max-md:gap-2 max-md:px-2.5"
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
        className={`text-center font-display max-md:text-[15px] ${
          rank === 1 ? "text-[26px]" : rank <= 3 ? "text-[24px]" : "text-[20px]"
        }`}
        style={{ color: numeralColor }}
      >
        {roman(rank)}
      </div>
      <GithubAvatar author={entry.author} size={40} border={rank === 1 ? "#c9a227" : "#b89a63"} />
      <div className="min-w-0">
        <div className="truncate text-[22px] font-semibold text-ink max-md:text-[16px]">
          {authorLabel(entry.author)}
          {entry.isAgent && (
            <span className="ml-2 rounded-[3px] border border-crimson px-[5px] align-[2px] text-[13px] text-crimson max-md:text-[11px]">
              {t.automaton}
            </span>
          )}
        </div>
        <div className="truncate text-[15px] italic text-ink-soft max-md:text-[13px]">
          {entry.note}
        </div>
      </div>
      <div className="text-center max-md:hidden">
        <div className="text-[15px] text-ink-muted">{countLabel}</div>
        <div className="font-display text-[22px] text-ink">{entry.records}</div>
      </div>
      <div className="whitespace-nowrap text-right text-[18px] font-bold text-gold max-md:col-start-4 max-md:text-[14px]">
        {formatNumber(entry.xp, lang)} {t.xp}
      </div>
    </Link>
  );
}

export default function LeaderBoard() {
  const { t, lang } = useI18n();
  const { tick, chime } = useSound();
  const { board: boardParam } = useParams();

  // The board is driven by the URL so each view is a shareable link. An
  // unknown sub-path redirects to the clean default rather than 404-ing.
  if (boardParam && boardParam !== "solvers" && boardParam !== "proposers") {
    return <Navigate to={withLang("/leaderboard", lang)} replace />;
  }
  const board: BoardKey = (boardParam as BoardKey) ?? "overall";

  const boards: Record<
    BoardKey,
    { tab: string; title: string; note: string; entries: HallEntry[]; countLabel: string }
  > = {
    overall: {
      tab: t.tabOverall,
      title: t.adventurersWhoClaimed,
      note: t.hallNote,
      entries: hall,
      countLabel: t.records,
    },
    solvers: {
      tab: t.tabSolvers,
      title: t.solversBoard,
      note: t.solversBoardNote,
      entries: solversHall,
      countLabel: t.records,
    },
    proposers: {
      tab: t.tabProposers,
      title: t.proposersBoard,
      note: t.proposersBoardNote,
      entries: proposersHall,
      countLabel: t.proposedColumn,
    },
  };
  const active = boards[board];
  const order: BoardKey[] = ["overall", "solvers", "proposers"];

  return (
    <div className="bg-tavern min-h-screen">
      <div className="mx-auto max-w-[1120px] p-[26px] max-md:p-3">
        <div className="mb-[22px]">
          <Nav />
        </div>
        <Sheet>
          {/* board switcher — top right; each tab is a shareable URL */}
          <div className="mb-6 flex justify-end max-md:justify-center">
            <div className="inline-flex divide-x divide-cardline overflow-hidden rounded border border-cardline">
              {order.map((key) => (
                <Link
                  key={key}
                  to={withLang(leaderboardPath(key), lang)}
                  onMouseEnter={tick}
                  onClick={chime}
                  aria-current={board === key ? "page" : undefined}
                  className={`cursor-pointer px-4 py-2 font-display text-[14px] tracking-[1px] transition-colors max-md:px-2.5 max-md:text-[12px] max-md:tracking-normal ${
                    board === key
                      ? "bg-crimson text-[#f7edcf]"
                      : "bg-card text-ink-muted hover:bg-card-hover"
                  }`}
                >
                  {boards[key].tab}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-5 text-center">
            <h2 className="m-0 font-display text-[28px] font-black text-ink max-md:text-[22px]">
              {active.title}
            </h2>
          </div>
          <div className="mx-auto flex max-w-[820px] flex-col gap-2.5">
            {active.entries.length === 0 ? (
              <div className="py-6 text-center text-[19px] italic text-ink-soft">{t.hallEmpty}</div>
            ) : (
              active.entries.map((entry, i) => (
                <ChampionRow
                  key={entry.author}
                  entry={entry}
                  rank={i + 1}
                  countLabel={active.countLabel}
                />
              ))
            )}
          </div>
          <div className="mt-4 text-center text-[17px] italic text-ink-soft">{active.note}</div>
        </Sheet>
        <Footer />
      </div>
    </div>
  );
}
