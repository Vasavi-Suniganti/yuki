import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Briefcase, Plus, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  saveToShelf,
  removeFromShelf,
  isItemInShelf,
  addToWorkspace,
  removeFromWorkspace,
  isItemInWorkspace,
  addToWatch,
  removeFromWatch,
  isItemWatched,
  subscribeSignatureFeatures,
  ShelfItem,
  WorkspaceItem,
  WatchedItem,
} from '../lib/signatureFeatures';
import { useNavigate } from 'react-router-dom';

interface SaveToShelfProps {
  item: {
    id: string;
    type: 'expedition' | 'publication' | 'report' | 'media' | 'lesson' | 'story' | 'scientist' | 'dataset';
    title: string;
    subtitle?: string;
    url?: string;
  };
  compact?: boolean;
}

export function SaveToShelfButton({ item, compact }: SaveToShelfProps) {
  const { profile } = useAuth();
  const [saved, setSaved] = useState(() => isItemInShelf(profile?.uid, item.id));

  useEffect(() => {
    const unsub = subscribeSignatureFeatures(() => {
      setSaved(isItemInShelf(profile?.uid, item.id));
    });
    return unsub;
  }, [profile?.uid, item.id]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (saved) {
      removeFromShelf(profile?.uid, item.id);
    } else {
      saveToShelf(profile?.uid, {
        itemId: item.id,
        type: item.type,
        title: item.title,
        subtitle: item.subtitle,
        url: item.url,
      });
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        title={saved ? 'Remove from Polar Shelf' : 'Save to Polar Shelf'}
        className={`inline-flex items-center justify-center p-2 rounded-xl transition ${
          saved
            ? 'bg-[#183647] text-white shadow-md'
            : 'bg-white/80 text-[#487b91] hover:bg-[#183647] hover:text-white border border-[#183647]/15'
        }`}
      >
        {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
        saved
          ? 'bg-[#183647] text-white shadow-md'
          : 'bg-white/80 text-[#183647] hover:bg-[#183647] hover:text-white border border-[#183647]/20'
      }`}
    >
      {saved ? <BookmarkCheck size={14} className="text-[#5abed8]" /> : <Bookmark size={14} />}
      <span>{saved ? 'Saved to Shelf' : 'Save to Shelf'}</span>
    </button>
  );
}

interface AddToWorkspaceProps {
  item: {
    id: string;
    type: 'expedition' | 'dataset' | 'publication' | 'report' | 'media' | 'researcher';
    title: string;
    subtitle?: string;
    region?: string;
    category?: string;
  };
  compact?: boolean;
}

export function AddToWorkspaceButton({ item, compact }: AddToWorkspaceProps) {
  const { profile } = useAuth();
  const [inWorkspace, setInWorkspace] = useState(() => isItemInWorkspace(profile?.uid, item.id));

  useEffect(() => {
    const unsub = subscribeSignatureFeatures(() => {
      setInWorkspace(isItemInWorkspace(profile?.uid, item.id));
    });
    return unsub;
  }, [profile?.uid, item.id]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inWorkspace) {
      removeFromWorkspace(profile?.uid, item.id);
    } else {
      addToWorkspace(profile?.uid, {
        itemId: item.id,
        type: item.type,
        title: item.title,
        subtitle: item.subtitle,
        region: item.region,
        category: item.category,
      });
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        title={inWorkspace ? 'Remove from Workspace' : 'Add to Workspace'}
        className={`inline-flex items-center justify-center p-2 rounded-xl transition ${
          inWorkspace
            ? 'bg-[#183647] text-emerald-400 shadow-md'
            : 'bg-white/80 text-[#487b91] hover:bg-[#183647] hover:text-white border border-[#183647]/15'
        }`}
      >
        <Briefcase size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
        inWorkspace
          ? 'bg-[#183647] text-white shadow-md'
          : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
      }`}
    >
      <Briefcase size={14} className={inWorkspace ? 'text-emerald-400' : ''} />
      <span>{inWorkspace ? 'In Workspace' : '+ Add to Workspace'}</span>
    </button>
  );
}

interface WatchItemProps {
  item: {
    id: string;
    type: 'expedition' | 'pending_verification' | 'repository_issue' | 'outreach' | 'research_activity';
    title: string;
    status: string;
    urgency?: 'high' | 'medium' | 'normal';
  };
  compact?: boolean;
}

export function WatchItemButton({ item, compact }: WatchItemProps) {
  const { profile } = useAuth();
  const [watched, setWatched] = useState(() => isItemWatched(profile?.uid, item.id));

  useEffect(() => {
    const unsub = subscribeSignatureFeatures(() => {
      setWatched(isItemWatched(profile?.uid, item.id));
    });
    return unsub;
  }, [profile?.uid, item.id]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (watched) {
      removeFromWatch(profile?.uid, item.id);
    } else {
      addToWatch(profile?.uid, {
        itemId: item.id,
        type: item.type,
        title: item.title,
        status: item.status,
        urgency: item.urgency || 'normal',
      });
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        title={watched ? 'Unwatch Item' : 'Watch Item'}
        className={`inline-flex items-center justify-center p-2 rounded-xl transition ${
          watched
            ? 'bg-amber-600 text-white shadow-md'
            : 'bg-white/80 text-[#487b91] hover:bg-amber-600 hover:text-white border border-[#183647]/15'
        }`}
      >
        {watched ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
        watched
          ? 'bg-amber-700 text-white shadow-md'
          : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-600 hover:text-white'
      }`}
    >
      <Eye size={14} />
      <span>{watched ? 'Watching' : '+ Watch Item'}</span>
    </button>
  );
}

interface RemixStoryProps {
  item: {
    id: string;
    type: 'publication' | 'dataset' | 'report' | 'expedition';
    title: string;
    authorOrDoi?: string;
  };
  compact?: boolean;
}

export function RemixStoryButton({ item, compact }: RemixStoryProps) {
  const navigate = useNavigate();

  const handleRemix = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/media-manager?tab=storyforge&sourceId=${encodeURIComponent(item.id)}&sourceTitle=${encodeURIComponent(item.title)}&sourceType=${item.type}`);
  };

  if (compact) {
    return (
      <button
        onClick={handleRemix}
        title="Remix into Story (Story Forge Studio)"
        className="inline-flex items-center justify-center p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-600 hover:text-white transition shadow-sm"
      >
        <Sparkles size={16} className="text-purple-600 hover:text-white" />
      </button>
    );
  }

  return (
    <button
      onClick={handleRemix}
      className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-900 border border-purple-300 hover:bg-purple-600 hover:text-white transition shadow-sm"
    >
      <Sparkles size={14} className="text-purple-600 group-hover:text-white" />
      <span>Remix into Story</span>
    </button>
  );
}
