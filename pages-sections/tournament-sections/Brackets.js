import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { makeStyles } from "@mui/styles";
import styles from "/styles/jss/nextjs-material-kit/sections/bracketsStyle.js";
import { useTheme } from "@mui/material";
import cleanText from "../../utils/cleanText";

const useStyles = makeStyles(styles);

const bracketStyles = {
  "win": {
    color: "#34343",
    backgroundColor: "#69F37E"
  },
  "loss": {
    color: "white",
    backgroundColor: "#FF0000"
  },
  "unreported": {
    color: "#34343",
    backgroundColor: "#F2E5E5"
  }
}

function Match(props) {
  const { match, matchIndex, roundIndex, onBracketSelect, factions, playersToLookup } = props;
  const { seed, score, disputed, participants, touched } = match;
  if (score == null) {
    return null;
  }
  const { t } = useTranslation();
  const classes = useStyles();

  if (playersToLookup != null) {
    const doesNameMatch = participants.flatMap(participantGroup => 
      participantGroup // iterate through all participants in the group
    ).find((participant) => (
      playersToLookup.some(searchStr => {
        return participant.name.toLowerCase().includes(searchStr.toLowerCase());
      })
    ));
  
    if (!doesNameMatch) {
      return null;
    }
  }

  const renderParticipants = (index) => {
    const scores = score[index];
    const isReported = scores != null && scores.reduce((a, b) => a+b, 0) > 0;
    const higherScore = Math.max(scores?.[0], scores?.[1]);
    return participants[index].map((participant, i) => {
      const { name, removed } = participant;
      const hasHigherScore = scores != null && higherScore === scores[i];
      const bracketStyle = isReported ? (
        hasHigherScore ? bracketStyles.win : bracketStyles.loss
      ) : bracketStyles.unreported;
      const onClick = () => {
        onBracketSelect(
          roundIndex,
          matchIndex,
          index,
        )
      }
      const participantReported = participant.score?.reduce((a, b) => a+b, 0) > 0;
      const hasUnfinalReport = !isReported && participantReported;
      return (
        <div onClick={onClick} style={bracketStyle} className={classes.participant}>
          <div style={{ textDecoration: removed ? "line-through" : "none" }}>
            {cleanText(name)} {hasUnfinalReport ? "🟢" : ""}
          </div>
          <span className={classes.score}>
            {scores?.[i] || 0}
          </span>
        </div>
      )
    })
  }
  
  function getFactions() {
    const player1FactionId = participants[0][0].factionId;
    const player2FactionId = participants[0][1].factionId;
    const faction1 = factions.find((f) => f.key === player1FactionId);
    const faction2 = factions.find((f) => f.key === player2FactionId);
    return `${faction1?.name ?? "none"} vs ${faction2?.name ?? "none"}`;
  }

  return (
    <div className={classes.matchRoot}>
      {(participants.length > 1) && (
        <h4>{getFactions()}</h4>
      )}
      <div className={classes.matchItem}>
        <div className={classes.seed}>
          {seed}
        </div>
        <div className={classes.participants}>
          {participants.map((_, i) => (
            <div>
              {renderParticipants(i)}
            </div>
          ))}
        </div>
      </div>
      <small>
        {disputed?.[0] && t("disputed_note")}
        {touched?.[0] && t("touched_note")}
      </small>
    </div>
  )
}

function Brackets(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    isTeamTournament,
    factions,
    bracket, onBracketSelect, currentRoundNumber, totalRounds, e
  } = props;
  const [playersToLookup, setPlayersToLookup] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    if (e == null) {
      return;
    }
    onSearch(e);
  }, [e]);

  const onSearch = (e) => {
    const targetValue = e.target.value;
    if (targetValue == null || targetValue === '') {
      return setPlayersToLookup(null);
    }
    const searchStrings = targetValue.split("&");
    setPlayersToLookup(searchStrings);
  }
  if (bracket == null) {
    return null;
  }
  return(
    <div
      className="scroller"
      style={{
        direction: isTeamTournament ? "ltr" : "rtl",
        overflowX: "scroll",
        backgroundColor: isDark ? "#252a31" : "#F6F5F5"
      }}
    >
      <p style={{ textAlign: "center", direction: "ltr" }}>
        {`${currentRoundNumber} / ${totalRounds} ${t("rounds")}`}
      </p>
      <div className={classes.rounds} style={{ minWidth: bracket.length * (isTeamTournament ? 900 : 350) }}>
        {bracket.map((roundObj, roundIndex) => {
          const { round, matches } = roundObj;
          return (
            <section className={classes.round}>
              <h3 className={classes.roundLabel}>
                {t('round_label', { round })}
              </h3>
              {
                matches.map((match, matchIndex) => (
                  <Match
                    match={match}
                    matchIndex={matchIndex}
                    roundIndex={roundIndex}
                    isTeamTournament={isTeamTournament}
                    onBracketSelect={onBracketSelect}
                    playersToLookup={playersToLookup}
                    factions={factions}
                  />
                ))
              }
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default Brackets;
