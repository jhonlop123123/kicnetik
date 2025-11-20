import React, { useState, useRef } from 'react';
import { X, Send, Image as ImageIcon, Heart, User } from 'lucide-react';
import { Post, Comment } from '../types';
import { Link } from 'react-router-dom';

interface CommentsModalProps {
  post: Post;
  onClose: () => void;
}

// Mock comments generator
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: { name: 'DegenDave', handle: '@dave_trades', avatar: 'https://picsum.photos/seed/dave/50/50' },
    text: 'This chart pattern looks bullish! 🚀',
    likes: 24,
    timestamp: '2m ago'
  },
  {
    id: 'c2',
    author: { name: 'SarahSol', handle: '@sarah_nft', avatar: 'https://picsum.photos/seed/sarah/50/50' },
    text: 'My reaction when the price dropped...',
    imageUrl: 'https://picsum.photos/seed/reaction/300/200',
    likes: 12,
    timestamp: '10m ago'
  }
];

export const CommentsModal: React.FC<CommentsModalProps> = ({ post, onClose }) => {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() && !selectedImage) return;

    const newComment: Comment = {
      id: `new-${Date.now()}`,
      author: { 
        name: 'Me', 
        handle: '@me', 
        avatar: 'https://picsum.photos/seed/me/50/50' // Current user mock
      },
      text: newCommentText,
      imageUrl: selectedImage || undefined,
      likes: 0,
      timestamp: 'Just now'
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    setSelectedImage(null);
  };

  const toggleLike = (id: string) => {
    setComments(comments.map(c => {
        if (c.id === id) {
            return { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked };
        }
        return c;
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full md:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl md:rounded-2xl h-[80vh] md:h-[700px] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-white">Discussion ({comments.length})</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Original Post Context */}
          <div className="bg-slate-800/30 p-3 rounded-xl mb-6 border border-slate-800/50 flex gap-3">
             <img src={post.author.avatar} className="w-10 h-10 rounded-full" alt="op" />
             <div>
                <div className="text-xs font-bold text-slate-400">Original Post by {post.author.handle}</div>
                <p className="text-sm text-slate-200 line-clamp-2">{post.content}</p>
             </div>
          </div>

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Link to={`/u/${comment.author.handle.replace('@', '')}`} onClick={onClose}>
                <img 
                    src={comment.author.avatar} 
                    alt={comment.author.handle} 
                    className="w-10 h-10 rounded-full border border-slate-700 object-cover hover:border-cyan-500 transition-colors" 
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <Link to={`/u/${comment.author.handle.replace('@', '')}`} onClick={onClose} className="font-bold text-sm text-white hover:text-cyan-400 transition-colors">
                        {comment.author.name}
                   </Link>
                   <span className="text-xs text-slate-500">{comment.timestamp}</span>
                </div>
                
                <div className="bg-slate-800/50 p-3 rounded-r-xl rounded-bl-xl border border-slate-700/50">
                    {comment.text && <p className="text-sm text-slate-200 leading-relaxed">{comment.text}</p>}
                    {comment.imageUrl && (
                        <img 
                            src={comment.imageUrl} 
                            alt="Comment attachment" 
                            className="mt-2 rounded-lg max-h-48 object-cover border border-slate-600"
                        />
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-1 ml-1">
                    <button 
                        onClick={() => toggleLike(comment.id)}
                        className={`text-xs font-bold flex items-center gap-1 transition-colors ${comment.isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}
                    >
                        <Heart size={12} fill={comment.isLiked ? "currentColor" : "none"} />
                        {comment.likes}
                    </button>
                    <button className="text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors">
                        Reply
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
           {selectedImage && (
               <div className="mb-2 relative inline-block">
                   <img src={selectedImage} alt="preview" className="h-16 w-16 object-cover rounded-lg border border-slate-600" />
                   <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                   >
                       <X size={12} />
                   </button>
               </div>
           )}
           <form onSubmit={handleSubmit} className="flex gap-2">
             <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
             >
                 <ImageIcon size={20} />
             </button>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
             />
             
             <div className="flex-1 bg-slate-800 rounded-xl flex items-center px-4">
                <input 
                    type="text" 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add a comment..." 
                    className="bg-transparent w-full outline-none text-slate-200 placeholder-slate-500 py-3"
                />
             </div>
             
             <button 
                type="submit" 
                disabled={!newCommentText && !selectedImage}
                className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-colors"
             >
                 <Send size={20} />
             </button>
           </form>
        </div>

      </div>
    </div>
  );
};