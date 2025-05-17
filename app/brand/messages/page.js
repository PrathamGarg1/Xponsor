// app/brand/messages/page.js and app/influencer/messages/page.js

'use client';

import { useEffect, useState, useRef } from 'react';
import { useConversations, useConversation } from '@/hooks/useMessages';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function BrandMessages() { // Replace with BrandMessages or InfluencerMessages as needed
  const { data: session, status } = useSession();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || null);
  
  const { 
    conversations, 
    loading: loadingConversations, 
    error: conversationsError 
  } = useConversations();
  
  const { 
    messages, 
    loading: loadingMessages, 
    error: messagesError, 
    newMessage, 
    setNewMessage, 
    sendMessage,
    currentUserId
  } = useConversation(selectedUserId);

  // Set initial user ID from query params
  useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(initialUserId);
    }
  }, [initialUserId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle message sending with optimistic updates
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // sendMessage (in hook) now handles optimistic updates
    setTimeout(() => {
      sendMessage();
    }, 0);
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden container mx-auto px-4 py-4">
        {/* Conversations sidebar */}
        <div className="w-1/3 mr-4 bg-white rounded shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="p-4 text-center">
                <Loading />
              </div>
            ) : conversationsError ? (
              <div className="p-4">
                <Error message={conversationsError} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet.
              </div>
            ) : (
              <div>
                {conversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center ${
                      selectedUserId === conversation.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedUserId(conversation.id);
                      router.push(`/brand/messages?userId=${conversation.id}`, { scroll: false });
                    }}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                      {conversation.user.image ? (
                        <Image
                          src={conversation.user.image}
                          alt={conversation.user.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {conversation.user.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Messages panel */}
        <div className="flex-1 bg-white rounded shadow overflow-hidden flex flex-col">
          {selectedUserId ? (
            <>
              {/* Selected conversation header */}
              <div className="p-4 border-b">
                {conversations.find(c => c.id === selectedUserId)?.user && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                      {conversations.find(c => c.id === selectedUserId)?.user.image ? (
                        <Image
                          src={conversations.find(c => c.id === selectedUserId)?.user.image}
                          alt={conversations.find(c => c.id === selectedUserId)?.user.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {conversations.find(c => c.id === selectedUserId)?.user.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold">
                      {conversations.find(c => c.id === selectedUserId)?.user.name}
                    </h3>
                  </div>
                )}
              </div>
              
              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
              >
                {loadingMessages ? (
                  <div className="text-center">
                    <Loading />
                  </div>
                ) : messagesError ? (
                  <div className="text-center">
                    <Error message={messagesError} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <div>
                    {messages.map((message, index) => {
                      const isCurrentUserSender = message.sender.id === currentUserId;
                      
                      return (
                        <div 
                          key={message.id || `temp-${index}`}
                          className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'} mb-3`}
                        >
                          <div 
                            className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${
                              isCurrentUserSender
                                ? 'bg-blue-500 text-white rounded-br-none' 
                                : 'bg-white text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <div>{message.content}</div>
                            <div className={`text-xs mt-1 ${isCurrentUserSender ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="p-3 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="mb-2">Select a conversation to start messaging</p>
                {conversations.length === 0 && !loadingConversations && (
                  <p>You don't have any conversations yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}