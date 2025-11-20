
import React, { useState } from 'react';
import { ScrollText, Target, Users, Shield, Zap, Mail, ChevronRight, Code, Database, Coins, Copy, Check } from 'lucide-react';

const RUST_CONTRACT_CODE = `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, Burn};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod kinectic {
    use super::*;

    // 1. INITIALIZE: Configura la curva para un nuevo video
    pub fn initialize(ctx: Context<Initialize>, video_id: String) -> Result<()> {
        let curve = &mut ctx.accounts.bonding_curve;
        curve.authority = ctx.accounts.user.key();
        curve.video_id = video_id;
        curve.total_supply = 0;
        curve.reserve_balance = 0; // SOL guardado
        curve.bump = *ctx.bumps.get("bonding_curve").unwrap();
        Ok(())
    }

    // 2. BUY: El usuario envía SOL, recibe Tokens
    pub fn buy(ctx: Context<Buy>, amount_in_sol: u64) -> Result<()> {
        // A. Calcular tokens basado en la curva (P = 0.00005 * S^2)
        let curve = &mut ctx.accounts.bonding_curve;
        let tokens_to_mint = calculate_tokens_out(amount_in_sol, curve.total_supply);

        // B. Transferir SOL del usuario a la Bóveda (Vault)
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault.key(),
            amount_in_sol,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;

        // C. Acuñar (Mint) tokens al usuario
        let seeds = &[
            b"bonding_curve",
            curve.video_id.as_bytes(),
            &[curve.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: curve.to_account_info(),
            },
            signer,
        );
        token::mint_to(cpi_ctx, tokens_to_mint)?;

        // D. Actualizar estado
        curve.total_supply += tokens_to_mint;
        curve.reserve_balance += amount_in_sol;

        Ok(())
    }

    // 3. SELL: Usuario quema Tokens, recibe SOL
    pub fn sell(ctx: Context<Sell>, amount_tokens: u64) -> Result<()> {
        let curve = &mut ctx.accounts.bonding_curve;
        
        // A. Calcular cuánto SOL devolver
        let sol_to_return = calculate_sol_out(amount_tokens, curve.total_supply);

        // B. Quemar tokens del usuario
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            }
        );
        token::burn(cpi_ctx, amount_tokens)?;

        // C. Enviar SOL de la bóveda al usuario
        **ctx.accounts.vault.try_borrow_mut_lamports()? -= sol_to_return;
        **ctx.accounts.user.try_borrow_mut_lamports()? += sol_to_return;

        // D. Actualizar estado
        curve.total_supply -= amount_tokens;
        curve.reserve_balance -= sol_to_return;

        Ok(())
    }
}`;

export const Protocol: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manifesto' | 'architecture'>('manifesto');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(RUST_CONTRACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
             <h1 className="text-3xl font-bold text-white tracking-tight font-[Space_Grotesk]">
                Kinectic <span className="text-amber-500">Protocol</span>
            </h1>
            <p className="text-slate-400 text-sm">The architecture of the Awakening.</p>
        </div>

        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 inline-flex">
            <button 
                onClick={() => setActiveTab('manifesto')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'manifesto' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
                Manifesto
            </button>
            <button 
                onClick={() => setActiveTab('architecture')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'architecture' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
                <Code size={16} /> Architecture (Tech Spec)
            </button>
        </div>
      </div>

      {/* --- TAB: MANIFESTO --- */}
      {activeTab === 'manifesto' && (
          <div className="animate-in fade-in duration-300">
            {/* Hero Manifesto */}
            <div className="text-center mb-16 bg-gradient-to-b from-amber-900/10 to-transparent p-8 rounded-3xl border border-amber-500/10">
                <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-6 border border-amber-500/20">
                    <ScrollText size={32} className="text-amber-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 font-[Space_Grotesk]">
                    Attention is <span className="text-amber-400">Equity</span>
                </h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    We are architecting the <span className="text-white font-bold">Great Awakening</span>.
                    Kinectic is the first decentralized mechanism to turn human attention into verifiable, tradeable equity on the Solana blockchain.
                </p>
            </div>

            {/* The Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/30 transition-colors group">
                    <Shield size={24} className="text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Quantum Security</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Biometric 3-Factor authentication prevents bot manipulation. The protocol ensures Proof-of-Personhood for every trade.
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/30 transition-colors group">
                    <Zap size={24} className="text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Viral Tokenomics</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Every video is a bonding curve. As attention grows, liquidity deepens. Content creators become central bankers.
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/30 transition-colors group">
                    <Users size={24} className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Decentralized Mind</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        A network owned by the awakened. Governance rights are distributed to those who provide value, not just capital.
                    </p>
                </div>
            </div>

            {/* Roadmap */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Target className="text-red-500" /> Strategic Roadmap
                </h2>
                
                <div className="space-y-0 relative border-l-2 border-slate-800 ml-3">
                    <div className="mb-10 ml-8 relative group">
                        <div className="absolute -left-[41px] top-1 w-6 h-6 bg-green-500 rounded-full border-4 border-black shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                        <h3 className="text-lg font-bold text-green-400 mb-1">Phase 1: The Genesis (Current)</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Launch Beta on Solana Devnet</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Implement Veo AI Video Generation</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Quantum Biometric Integration</li>
                        </ul>
                    </div>

                    <div className="mb-10 ml-8 relative group opacity-80">
                        <div className="absolute -left-[41px] top-1 w-6 h-6 bg-slate-700 rounded-full border-4 border-black group-hover:bg-amber-500 transition-colors"></div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">Phase 2: The Expansion (Q3 2025)</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>• Launchpad for "Immortal" Assets</li>
                            <li>• Cross-chain bridging (Ethereum/Base)</li>
                            <li>• Mobile App Native Release (iOS/Android)</li>
                        </ul>
                    </div>

                    <div className="ml-8 relative group opacity-60">
                        <div className="absolute -left-[41px] top-1 w-6 h-6 bg-slate-800 rounded-full border-4 border-black"></div>
                        <h3 className="text-lg font-bold text-slate-400 mb-1">Phase 3: The Singularity (2026)</h3>
                        <ul className="space-y-2 text-slate-500 text-sm">
                            <li>• Full DAO Governance handover</li>
                            <li>• AI Autonomous Agents trading</li>
                            <li>• Global "Awakening" Event</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
      )}

      {/* --- TAB: ARCHITECTURE (TECH SPEC) --- */}
      {activeTab === 'architecture' && (
          <div className="animate-in fade-in duration-300 space-y-8">
            
            {/* Budget Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Coins className="text-amber-400" /> Deployment Budget (Mainnet)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div>
                                <div className="text-white font-bold">Contract Rent (Storage)</div>
                                <div className="text-xs text-slate-500">Refundable Deposit</div>
                            </div>
                            <div className="text-right">
                                <div className="text-amber-400 font-mono font-bold">7.0 SOL</div>
                                <div className="text-xs text-slate-500">~$1,015</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div>
                                <div className="text-white font-bold">Initial Liquidity</div>
                                <div className="text-xs text-slate-500">Bonding Curve Seed</div>
                            </div>
                            <div className="text-right">
                                <div className="text-amber-400 font-mono font-bold">1.0 SOL</div>
                                <div className="text-xs text-slate-500">~$145</div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div>
                                <div className="text-white font-bold">Token Metadata</div>
                                <div className="text-xs text-slate-500">Metaplex Registration</div>
                            </div>
                            <div className="text-right">
                                <div className="text-amber-400 font-mono font-bold">0.02 SOL</div>
                                <div className="text-xs text-slate-500">~$3</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/20 p-3 rounded-xl border border-amber-500/30 flex justify-between items-center">
                            <div className="font-bold text-amber-100">Total Required</div>
                            <div className="font-mono font-bold text-xl text-amber-400">~8.02 SOL</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Contract Blueprint */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Database className="text-cyan-400" size={18} />
                        <span className="font-bold text-slate-200">contracts/kinectic_program.rs</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2">Rust / Anchor</span>
                    </div>
                    <button 
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'COPIED' : 'COPY CODE'}
                    </button>
                </div>
                <div className="relative group">
                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        SHOW TO DEVELOPER
                    </div>
                    <pre className="p-6 overflow-x-auto text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                        <code>{RUST_CONTRACT_CODE}</code>
                    </pre>
                </div>
                <div className="bg-slate-900 border-t border-slate-800 p-4 text-xs text-slate-500 flex gap-4">
                    <span>• Dependencies: anchor-lang, anchor-spl</span>
                    <span>• License: MIT / Apache-2.0</span>
                </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex gap-3 items-start">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Code size={20} className="text-blue-400" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-100 text-sm">Developer Instruction</h4>
                    <p className="text-xs text-blue-200/70 mt-1">
                        This code defines the <span className="font-mono text-white">initialize</span>, <span className="font-mono text-white">buy</span>, and <span className="font-mono text-white">sell</span> logic for the Bonding Curve. Implement this in a standard Anchor project structure. Ensure PDA seeds match the client-side derivation.
                    </p>
                </div>
            </div>

          </div>
      )}

    </div>
  );
};
