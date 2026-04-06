import "./styles/global.css";
import { C } from "./styles/theme.js";
import useGame from "./hooks/useGame.js";
import PremierReve from "./components/PremierReve.jsx";
import IntroScreen from "./components/IntroScreen.jsx";
import PeupleScreen from "./components/PeupleScreen.jsx";
import MetierScreen from "./components/MetierScreen.jsx";
import NomScreen from "./components/NomScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";

export default function App() {
  const game = useGame();

  if (game.screen === "loading") return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.dim, fontSize: 10, letterSpacing: 5 }} className="pulse">...</div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", color: C.text }}>

      {game.screen === "premier_reve" && (
        <PremierReve onNom={game.handlePremierNom} />
      )}

      {game.screen === "intro" && (
        <IntroScreen onCommencer={game.handleIntro} heroExistant={game.hero} />
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
          onQuit={() => game.setPendingDeath("abandon")}
          onCancelQuit={() => game.setPendingDeath(null)}
          onEndReve={game.handleEndReve}
          onNewDream={() => { game.setDeadHero(null); game.setProse(""); game.setScreen("intro"); }}
          onReset={game.reset}
        />
      )}
    </div>
  );
}
