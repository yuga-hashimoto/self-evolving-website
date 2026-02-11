'use client';

import React, { useEffect, useReducer } from 'react';
import { useTranslations } from 'next-intl';

interface Upgrade {
  name: string;
  description: string;
  baseCost: number;
  owned: number;
  effect: number;
  type: 'click' | 'passive';
}

const INITIAL_UPGRADES: Upgrade[] = [
  { name: 'Auto Clicker', description: 'Taps for you every second', baseCost: 10, owned: 0, effect: 1, type: 'passive' },
  { name: 'Strong Click', description: 'Each tap gives +1 coin', baseCost: 50, owned: 0, effect: 1, type: 'click' },
  { name: 'Mega Clicker', description: 'More passive income', baseCost: 100, owned: 0, effect: 5, type: 'passive' },
  { name: 'Super Click', description: 'Each tap gives +5 coins', baseCost: 500, owned: 0, effect: 5, type: 'click' },
];

interface GameState {
  coins: number;
  prestige: number;
  totalEarned: number;
  upgrades: Upgrade[];
}

type GameAction =
  | { type: 'LOAD_SAVE'; payload: GameState }
  | { type: 'TAP'; payload: { clickPower: number } }
  | { type: 'AUTO_INCOME'; payload: { amount: number } }
  | { type: 'BUY_UPGRADE'; payload: { index: number; cost: number } }
  | { type: 'PRESTIGE' };

const initialState: GameState = {
  coins: 0,
  prestige: 0,
  totalEarned: 0,
  upgrades: INITIAL_UPGRADES,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_SAVE':
      return { ...action.payload };
    case 'TAP':
      const tapGain = action.payload.clickPower;
      return {
        ...state,
        coins: state.coins + tapGain,
        totalEarned: state.totalEarned + tapGain,
      };
    case 'AUTO_INCOME':
      return {
        ...state,
        coins: state.coins + action.payload.amount,
        totalEarned: state.totalEarned + action.payload.amount,
      };
    case 'BUY_UPGRADE':
      const newUpgrades = state.upgrades.map((u, i) =>
        i === action.payload.index ? { ...u, owned: u.owned + 1 } : u
      );
      return {
        ...state,
        coins: state.coins - action.payload.cost,
        upgrades: newUpgrades,
      };
    case 'PRESTIGE':
      return {
        ...state,
        coins: 0,
        upgrades: INITIAL_UPGRADES,
        totalEarned: 0,
        prestige: state.prestige + 1,
      };
    default:
      return state;
  }
}

export default function TapEmpireGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const t = useTranslations('playground');

  // Calculate derived values
  const multiplier = Math.pow(2, state.prestige);
  const passive = state.upgrades
    .filter(u => u.type === 'passive')
    .reduce((sum, u) => sum + u.effect * u.owned, 0);
  const perSecond = passive * multiplier;
  const click = state.upgrades
    .filter(u => u.type === 'click')
    .reduce((sum, u) => sum + u.effect * u.owned, 0) + 1;
  const clickPower = click * multiplier;

  // Load from localStorage
  useEffect(() => {
    const savedCoins = localStorage.getItem('tapEmpireCoins');
    const savedPrestige = localStorage.getItem('tapEmpirePrestige');
    const savedTotal = localStorage.getItem('tapEmpireTotalEarned');
    const savedUpgrades = localStorage.getItem('tapEmpireUpgrades');
    const loadedState: GameState = {
      coins: savedCoins ? parseInt(savedCoins) : 0,
      prestige: savedPrestige ? parseInt(savedPrestige) : 0,
      totalEarned: savedTotal ? parseInt(savedTotal) : 0,
      upgrades: savedUpgrades ? JSON.parse(savedUpgrades) : INITIAL_UPGRADES,
    };
    dispatch({ type: 'LOAD_SAVE', payload: loadedState });
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tapEmpireCoins', state.coins.toString());
    localStorage.setItem('tapEmpirePrestige', state.prestige.toString());
    localStorage.setItem('tapEmpireTotalEarned', state.totalEarned.toString());
    localStorage.setItem('tapEmpireUpgrades', JSON.stringify(state.upgrades));
  }, [state]);

  // Auto income every second
  useEffect(() => {
    if (perSecond > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'AUTO_INCOME', payload: { amount: perSecond } });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [perSecond]);

  const handleTap = () => {
    dispatch({ type: 'TAP', payload: { clickPower } });
  };

  const buyUpgrade = (index: number) => {
    const upgrade = state.upgrades[index];
    const cost = calculateCost(upgrade);
    if (state.coins >= cost) {
      dispatch({ type: 'BUY_UPGRADE', payload: { index, cost } });
    }
  };

  const calculateCost = (upgrade: Upgrade) => {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned)); // Exponential cost
  };

  const handlePrestige = () => {
    if (state.totalEarned >= 1000 * Math.pow(2, state.prestige)) {
      dispatch({ type: 'PRESTIGE' });
    }
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">{t('ai2.tapEmpire') || 'Tap Empire'}</h2>

      <div className="text-center mb-6">
        <p className="text-3xl font-bold text-yellow-500">{Math.floor(state.coins).toLocaleString()}</p>
        <p className="text-sm text-gray-400">Coins</p>
        <p className="text-sm text-green-400">+{perSecond}/sec</p>
      </div>

      <button
        onClick={handleTap}
        className="w-32 h-32 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 active:bg-yellow-300 transition-colors flex items-center justify-center text-4xl mb-6 touch-manipulation"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      >
        💰
      </button>

      <div className="w-full mb-4">
        <h3 className="text-xl font-semibold mb-2">Upgrades</h3>
        {state.upgrades.map((upgrade, index) => {
          const cost = calculateCost(upgrade);
          return (
            <button
              key={upgrade.name}
              onClick={() => buyUpgrade(index)}
              disabled={state.coins < cost}
              className="w-full mb-2 p-3 bg-gray-800 rounded flex justify-between items-center disabled:opacity-50 hover:bg-gray-700 transition-colors touch-manipulation"
              style={{ minHeight: '44px', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="text-left">
                <div className="font-semibold">{upgrade.name} ({upgrade.owned})</div>
                <div className="text-sm text-gray-300">{upgrade.description}</div>
              </div>
              <div className="font-bold text-green-400">{cost.toLocaleString()}</div>
            </button>
          );
        })}
      </div>

      <div className="text-center mb-4">
        <p>Prestige: {state.prestige}</p>
        <p>Multiplier: x{multiplier}</p>
        <p>Total Earned: {state.totalEarned.toLocaleString()}</p>
        <button
          onClick={handlePrestige}
          disabled={state.totalEarned < 1000 * Math.pow(2, state.prestige)}
          className="mt-2 px-4 py-2 bg-purple-600 rounded disabled:opacity-50 hover:bg-purple-500"
          style={{ minHeight: '44px' }}
        >
          Prestige ({Math.floor(1000 * Math.pow(2, state.prestige))})
        </button>
      </div>
    </div>
  );
}