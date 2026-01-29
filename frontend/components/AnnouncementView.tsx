import React, { useState } from 'react';
import { Announcement, Reply, User } from '../types';

const AnnouncementView: React.FC<{
    announcements: Announcement[],
    replies: Reply[],
    onReply: (aid: string, c: string) => void,
    isAdmin: boolean,
    onPost: (t: string, c: string) => void,
    user: User
}> = ({ announcements, replies, onReply, isAdmin, onPost, user }) => {
    const [newAnn, setNewAnn] = useState({ title: '', content: '' });
    const [replyText, setReplyText] = useState<Record<string, string>>({});

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Communication Portal</h2>

            <div className="bg-[#1e2329] p-6 rounded-xl border border-[#2b3139] space-y-4">
                <h3 className="font-bold text-xs text-[#fcd535] uppercase">Post New Message</h3>
                <input
                    placeholder="Topic / Subject"
                    className="w-full bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-sm"
                    value={newAnn.title}
                    onChange={e => setNewAnn({ ...newAnn, title: e.target.value })}
                />
                <textarea
                    placeholder="Write your message here..."
                    className="w-full bg-[#0b0e11] border border-[#2b3139] p-2 rounded h-24 text-sm"
                    value={newAnn.content}
                    onChange={e => setNewAnn({ ...newAnn, content: e.target.value })}
                />
                <button
                    onClick={() => { if (newAnn.title && newAnn.content) { onPost(newAnn.title, newAnn.content); setNewAnn({ title: '', content: '' }); } }}
                    className="bg-[#fcd535] text-black px-6 py-2 rounded font-bold text-xs uppercase"
                >
                    Post Message
                </button>
            </div>

            <div className="space-y-6">
                {announcements.map(ann => (
                    <div key={ann.id} className="bg-[#1e2329] border border-[#2b3139] rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-[#2b3139] bg-[#2b3139]/20">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-bold text-white uppercase">{ann.title}</h4>
                                <span className="text-[10px] text-[#848e9c]">{new Date(ann.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-[#eaecef]">{ann.content}</p>
                        </div>

                        <div className="p-4 space-y-4 bg-[#0b0e11]/30">
                            {replies.filter(r => r.announcementId === ann.id).map(r => (
                                <div key={r.id} className="flex gap-3">
                                    <div className="flex-1 bg-[#1e2329] p-3 rounded-lg border border-[#2b3139]">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-[#fcd535] uppercase">{r.userName}</span>
                                            <span className="text-[10px] text-[#848e9c]">{new Date(r.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-sm text-[#848e9c]">{r.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <input
                                    placeholder="Type a reply..."
                                    className="flex-1 bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-xs"
                                    value={replyText[ann.id] || ''}
                                    onChange={e => setReplyText({ ...replyText, [ann.id]: e.target.value })}
                                />
                                <button
                                    onClick={() => { if (replyText[ann.id]) { onReply(ann.id, replyText[ann.id]); setReplyText({ ...replyText, [ann.id]: '' }); } }}
                                    className="bg-[#2b3139] text-[#fcd535] px-4 py-1 rounded text-xs font-bold uppercase"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementView;
