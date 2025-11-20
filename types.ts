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
  commentsCount?: number;
  timestamp: string;
  createdAt: number;
  isSafe: boolean;
  assetData?: VideoAsset;
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

export interface Creator {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  marketCap: number;
  price: number;
  change24h: number;
  isVerified: boolean;
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
  updateProfile: (data: { name?: string; handle?: string; avatar?: string }) => void;
  setProfile: (name: string, handle: string) => void;
  verifyBiometrics: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextType>({
  username: "Guest",
  handle: "@guest",
  avatar: "",
  isBiometricVerified: false,
  updateProfile: () => {},
  setProfile: () => {},
  verifyBiometrics: async () => {},
});

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'gold';
}

export interface ToastContextType {
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
}

export const ToastContext = React.createContext<ToastContextType>({
  addToast: () => {},
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