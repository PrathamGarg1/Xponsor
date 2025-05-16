// app/influencer/messages/page.js
'use client';

import { useEffect, useState } from 'react';
import { useConversations, useConversation } from '@/hooks/useMessages';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useSession } from 'next-auth/react';
import { useRouter,useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function InfluencerMessages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || null);

  // Add this effect to handle URL parameters
  useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(initialUserId);
    }
  }, [initialUserId]);


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

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    router.push('/');
    return null;
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Store message before clearing input
    const messageToSend = newMessage;
    
    // Clear input immediately for better UX
    setNewMessage('');
    
    // Send the message in an asynchronous context
    setTimeout(async () => {
      try {
        const success = await sendMessage(messageToSend);
        
        if (!success) {
          // If failed, show error
          alert('Failed to send message. Please try again.');
          // Put text back in input
          setNewMessage(messageToSend);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        alert('Failed to send message. Please try again.');
        setNewMessage(messageToSend);
      }
    }, 0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations sidebar */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            
            {loadingConversations ? (
              <Loading />
            ) : conversationsError ? (
              <Error message={conversationsError} />
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              <ul>
                {conversations.map((conversation) => (
                  <li 
                    key={conversation.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      selectedUserId === conversation.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedUserId(conversation.id)}
                  >
                    <div className="flex items-center">
                      {conversation.user.image ? (
                        <Image 
                          src={conversation.user.image} 
                          alt={conversation.user.name} 
                          width={40} 
                          height={40} 
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600">{conversation.user.name?.charAt(0) || '?'}</span>
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="font-medium">{conversation.user.name}</div>
                        <div className="text-sm text-gray-500 truncate w-48">
                          {conversation.lastMessage.content}
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Message content */}
          <div className="w-2/3 flex flex-col">
            {!selectedUserId ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold">
                    {conversations.find(c => c.id === selectedUserId)?.user.name || 'Chat'}
                  </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {loadingMessages ? (
                    <Loading />
                  ) : messagesError ? (
                    <Error message={messagesError} />
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                  <div id="messages-list" className="flex-1 overflow-y-auto p-4 space-y-4">



                    {messages.map((message) => {
                      // Check if current user is the sender
                      const isCurrentUserSender = message.sender.id === currentUserId;
                      
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs rounded-lg px-4 py-2 ${
                              isCurrentUserSender
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {message.content}
                            <div className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      );
                    })}




                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
