import "./styles/global.css";
import { C } from "./styles/theme.js";
import useGame from "./hooks/useGame.js";
import IntroScreen from "./components/IntroScreen.jsx";
import PeupleScreen from "./components/PeupleScreen.jsx";
import MetierScreen from "./components/MetierScreen.jsx";
import NomScreen from "./components/NomScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import CodeScreen from "./components/CodeScreen.jsx";
import ReglesScreen from "./components/ReglesScreen.jsx";
import JournalScreen from "./components/JournalScreen.jsx";

export default function App() {
  const game = useGame();

  if (game.screen === "loading") return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.dim, fontSize: 10, letterSpacing: 5 }} className="pulse">...</div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", color: C.text }}>

      {game.screen === "code" && (
        <CodeScreen onCode={game.handleCode} />
      )}

      {game.screen === "regles" && (
        <ReglesScreen onContinue={() => game.setScreen("intro")} />
      )}

      {game.screen === "intro" && (
        <IntroScreen onCommencer={game.handleIntro} heroes={game.heroes} onSwitch={game.switchHero} />
      )}

      {game.screen === "creation_peuple" && (
        <PeupleScreen
          onChoix={game.choisirPeuple}
          onBack={() => game.setScreen("intro")}
          cles={game.worldRef.current.cles || {}}
        />
      )}

      {game.screen === "creation_metier" && game.pendingPeuple && (
        <MetierScreen
          peuple={game.pendingPeuple}
          onChoix={game.choisirMetier}
          onBack={() => game.setScreen("creation_peuple")}
          cles={game.worldRef.current.cles || {}}
        />
      )}

      {game.screen === "creation_nom" && game.pendingPeuple && game.pendingMetier !== undefined && (
        <NomScreen
          peuple={game.pendingPeuple}
          metier={game.pendingMetier}
          onConfirm={game.confirmerHero}
          onBack={() => game.setScreen("creation_metier")}
        />
      )}

      {game.screen === "journal" && (
        <JournalScreen journal={game.worldRef.current.journal} onBack={() => game.setScreen("jeu")} />
      )}

      {game.screen === "jeu" && (
        <GameScreen
          hero={game.hero}
          prose={game.prose}
          streaming={game.streaming}
          going={game.going}
          err={game.err}
          rateLimit={game.rateLimit}
          pendingDeath={game.pendingDeath}
          deadHero={game.deadHero}
          onPlay={game.playScene}
          onPause={game.pauseHero}
          onAbandon={() => game.setPendingDeath("abandon")}
          onCancelQuit={() => game.setPendingDeath(null)}
          onEndReve={game.handleEndReve}
          onNewDream={() => { game.setDeadHero(null); game.setProse(""); game.setScreen("intro"); }}
          onReset={game.reset}
          onJournal={() => game.setScreen("journal")}
        />
      )}
    </div>
  );
}
