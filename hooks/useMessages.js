// hooks/useMessages.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFetch } from './useFetch';
import { useSession } from 'next-auth/react';

export function useConversations() {
  const { data, loading, error } = useFetch('/api/messages');
  
  return {
    conversations: data?.conversations || [],
    loading,
    error
  };
}

export function useConversation(userId) {
  const { data: session } = useSession();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Get the database user ID first
  useEffect(() => {
    const getUserId = async () => {
      try {
        // Fetch the current user's database ID
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error("Failed to get user ID:", error);
      }
    };
    
    if (session?.user) {
      getUserId();
    }
  }, [session]);
  
  // Fetch conversation messages
  useEffect(() => {
    if (!userId) return;
    
    let isMounted = true;
    
    // Reset state when userId changes
    if (isMounted) {
      setInitialLoadComplete(false);
      setLoading(true);
    }
    
    const fetchMessages = async (isInitialLoad = false) => {
      try {
        if (!isMounted) return;
        
        // Only show loading indicator on initial load
        if (isInitialLoad && isMounted) {
          setLoading(true);
        }
        
        const response = await fetch(`/api/messages/${userId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch messages');
        }
        
        const data = await response.json();
        
        if (isMounted) {
          setMessages(data.messages || []);
          setError(null);
          
          // Mark initial load as complete
          if (isInitialLoad) {
            setInitialLoadComplete(true);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isInitialLoad && isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Initial load with loading indicator
    fetchMessages(true);
    
    // Poll for new messages every 5 seconds without showing loader
    const interval = setInterval(() => fetchMessages(false), 5000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);
  
  const sendMessage = async (content = newMessage) => {
    if (!content.trim() || !userId) return false;
    
    // Create optimistic message for immediate display
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId,
        name: session?.user?.name || 'You',
        image: session?.user?.image || null
      },
      receiverId: userId,
      senderId: currentUserId,
      isRead: false
    };
    
    // Update UI immediately with optimistic message
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Clear input field
    setNewMessage('');
    
    // Send actual API request
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverId: userId,
          content
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      // On success, replace optimistic message with real one
      const data = await response.json();
      
      if (data.message) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? data.message : msg
          )
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // On failure, remove the optimistic message
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      return false;
    }
  };
  
  return {
    messages,
    loading: loading && !initialLoadComplete,
    error,
    newMessage,
    setNewMessage,
    sendMessage,
    currentUserId,
    setMessages
  };
}

// Direct message function
export async function sendDirectMessage(receiverId, content) {
  if (!content || !content.trim()) {
    return { success: false, error: 'Message content is required' };
  }
  
  if (!receiverId) {
    return { success: false, error: 'Receiver ID is required' };
  }
  
  try {
    console.log(`Sending message to ${receiverId}: "${content}"`);
    
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receiverId,
        content
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("API error:", data);
      return { 
        success: false, 
        error: data.message || 'Failed to send message' 
      };
    }
    
    return { success: true, message: data.message };
  } catch (error) {
    console.error('Error sending direct message:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}