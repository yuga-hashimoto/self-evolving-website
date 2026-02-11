"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Coin {
    symbol: string;
    price: number;
    change: number; // percentage change
}

export default function CryptoTicker() {
    const [coins, setCoins] = useState<Coin[]>([
        { symbol: "MIMO", price: 0.0042, change: 5.2 },
        { symbol: "GROK", price: 12.50, change: -1.8 },
        { symbol: "JULES", price: 420.69, change: 12.4 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCoins(prevCoins => prevCoins.map(coin => {
                const volatility = 0.005; // 0.5% max change per tick
                const change = (Math.random() * volatility * 2) - volatility;
                const newPrice = Math.max(0.0001, coin.price * (1 + change));
                return {
                    ...coin,
                    price: newPrice,
                    change: (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5 // Mock 24h change
                };
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-4 px-4 py-1.5 bg-black/60 border border-purple-500/20 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-sm">
            {coins.map((coin) => (
                <div key={coin.symbol} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-purple-400 tracking-wider">{coin.symbol}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-gray-200">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </span>
                        {coin.change >= 0 ? (
                            <TrendingUp size={12} className="text-green-400" />
                        ) : (
                            <TrendingDown size={12} className="text-red-400" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
