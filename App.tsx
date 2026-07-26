
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/ui/Layout';
import { Step, UserData, INITIAL_USER_DATA, PlayerProfile, INITIAL_PLAYER_PROFILE } from './types';
import { GameService } from './services/GameService';

// Screens
import BootSequence from './screens/BootSequence';
import GameLobby from './screens/GameLobby';
import DungeonRun, { Encounter } from './screens/DungeonRun';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.BOOT);
  const [history, setHistory] = useState<Step[]>([]);
  
  // Staging Data (Onboarding)
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  
  // Real Backend Data
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(INITIAL_PLAYER_PROFILE);

  const [selectedExercise, setSelectedExercise] = useState<string>('PUSH-UPS');

  // Check for existing save on boot
  useEffect(() => {
    const initGame = async () => {
      const saved = await GameService.loadGame();
      if (saved) {
        setPlayerProfile(saved);
      }
    };
    initGame();
  }, []);

  const updateData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const nextStep = (step: Step) => {
    setHistory(prev => [...prev, currentStep]);
    setCurrentStep(step);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prev = newHistory.pop();
    setHistory(newHistory);
    if (prev) setCurrentStep(prev);
  };

  // --- BACKEND ACTIONS ---

  const handleCreateAccount = async () => {
    const newProfile = await GameService.createAccount(userData);
    setPlayerProfile(newProfile);
    nextStep(Step.GAME_LOBBY);
  };

  const handleDungeonComplete = async (data: { reps: number, name: string }) => {
    const updatedProfile = await GameService.completeDungeon(playerProfile, {
      reps: data.reps,
      damageDealt: data.reps * 10,
      difficulty: 1,
      dungeonName: data.name
    });
    setPlayerProfile(updatedProfile);
    setCurrentStep(Step.GAME_LOBBY);
  };

  const handleEggHatchComplete = (data: { reps: number, name: string }) => {
      // Award the mystery prize
      const newItem = {
          id: `shadow_dagger_${Date.now()}`,
          name: "Shadow Dagger",
          type: "WEAPON" as const,
          rarity: "RARE" as const,
          icon: "colorize",
          obtainedAt: new Date().toISOString(),
          value: 0
      };
      
      // Update local profile state (won't save permanently until full account creation, but works for session)
      setPlayerProfile(prev => ({
          ...prev,
          inventory: [...prev.inventory, newItem]
      }));

      alert("MYSTERY UNLOCKED: Shadow Dagger added to inventory.");
      setCurrentStep(Step.SHADOW_BIND); // Return to flow
  };

  const handleBootComplete = () => {
      // Logic: Skip all onboarding and go straight to the Game Lobby
      if (!playerProfile.shadowName || playerProfile.shadowName === '') {
         setPlayerProfile(prev => ({ ...prev, shadowName: 'Hunter' }));
      }
      setCurrentStep(Step.GAME_LOBBY);
  };

  // Determine if back button should be shown
  const canGoBack = history.length > 0 && 
    ![Step.BOOT, Step.THE_GATE, Step.GAME_LOBBY, Step.DUNGEON_RUN, Step.EGG_BATTLE].includes(currentStep);

  // EGG ENCOUNTER DEFINITION
  const EGG_ENCOUNTER: Encounter = {
      id: 999,
      type: 'BOSS',
      name: 'MYSTERY EGG',
      totalSets: 1,
      repsPerSet: 105, // 105 reps * 10 dmg = 1050 HP (approx 67 Crits)
      damage: 0, 
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png', // Fallback
      shadowColor: '#FFFFFF'
  };

  const renderScreen = () => {
    switch (currentStep) {
      case Step.BOOT: return <BootSequence onComplete={handleBootComplete} onSkip={() => setCurrentStep(Step.GAME_LOBBY)} />;
      
      // Shadow Bind with Hatch Logic - Kept for Egg Battle support if needed
      case Step.EGG_BATTLE: return <DungeonRun profile={playerProfile} onComplete={handleEggHatchComplete} encounterOverride={EGG_ENCOUNTER} exercise={selectedExercise} />;
      
      // Main Game Loop using Real Data
      case Step.GAME_LOBBY: return <GameLobby profile={playerProfile} onNavigate={nextStep} onUpdateProfile={setPlayerProfile} onSelectExercise={setSelectedExercise} />;
      case Step.DUNGEON_RUN: return <DungeonRun profile={playerProfile} onComplete={handleDungeonComplete} exercise={selectedExercise} />;
      
      default: return <BootSequence onComplete={handleBootComplete} />;
    }
  };

  return (
    <Layout 
      step={currentStep} 
      showHud={![Step.BOOT, Step.THE_GATE, Step.PLEDGE, Step.FOUNDERS_NOTE, Step.PAYMENT_GATEWAY, Step.FINAL_GATE, Step.GAME_LOBBY, Step.DUNGEON_RUN, Step.EGG_BATTLE].includes(currentStep)}
      onBack={canGoBack ? goBack : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="h-full w-full flex-1"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
