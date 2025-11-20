import React from 'react';

export interface VideoAsset {
  ticker: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  holders: number;
  volume24h?: number;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  text: string;
  imageUrl?: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  commentsCount?: number; // Added count
  timestamp: string; // e.g. "20m ago"
  createdAt: number; // timestamp in ms for countdown logic
  isSafe: boolean; // Anti-rug verification badge
  assetData?: VideoAsset; // Financial data for the video token
  challengeTag?: string;
}

export interface Holding {
  ticker: string;
  amount: number;
  avgEntry: number;
  currentPrice: number;
  pnlPercent: number;
  thumbnail: string;
}

export interface SecurityReport {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  liquidityLocked: boolean;
  mintAuthorityRenounced: boolean;
  topHoldersPercentage: number;
  analysis: string;
}

export interface WalletContextType {
  connected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const WalletContext = React.createContext<WalletContextType>({
  connected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
});

export interface UserContextType {
  username: string;
  handle: string;
  avatar: string;
  isBiometricVerified: boolean;
  setProfile: (name: string, handle: string) => void;
  verifyBiometrics: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextType>({
  username: "Guest",
  handle: "@guest",
  avatar: "",
  isBiometricVerified: false,
  setProfile: () => {},
  verifyBiometrics: async () => {},
});

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio?: AIStudio;
  }
}