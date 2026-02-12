"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { X } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  amount,
}: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && amount > 0) {
      const timeoutId = setTimeout(() => {
        setClientSecret("");
        setError(null);

        fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((err) => {
                throw new Error(err.error || "Failed to fetch");
              });
            }
            return res.json();
          })
          .then((data) => setClientSecret(data.clientSecret))
          .catch((err) => {
            console.error("Error creating payment intent:", err);
            setError(err.message || "Failed to initialize payment.");
          });
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, amount]);

  if (!isOpen) return null;

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#a855f7',
      colorBackground: '#1f2937',
      colorText: '#ffffff',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-6 animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Complete Payment</h2>
            <p className="text-gray-400">
                You are paying <span className="text-white font-bold">${(amount / 100).toFixed(2)}</span> for Premium Membership.
            </p>
        </div>

        {error ? (
             <div className="text-red-500 text-center py-4 bg-red-500/10 rounded-lg">
                 <p className="font-bold">Error</p>
                 <p>{error}</p>
                 <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">Close</button>
             </div>
        ) : (
            <>
                {clientSecret && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                )}
                {!clientSecret && (
                    <div className="flex justify-center items-center py-12">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
