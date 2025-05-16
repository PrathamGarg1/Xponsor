// hooks/useMessages.js
'use client';

import { useState, useEffect } from 'react';
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
        
        console.log(`Fetching messages for conversation with ${userId}`);
        const response = await fetch(`/api/messages/${userId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch messages');
        }
        
        const data = await response.json();
        
        if (isMounted) {
          console.log(`Received ${data.messages?.length || 0} messages`);
          setMessages(data.messages || []);
          setError(null);
          
          // Mark initial load as complete
          if (isInitialLoad) {
            setInitialLoadComplete(true);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
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
    if (!content.trim() || !userId) return;
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverId: userId,
          content: content
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      const data = await response.json();
      
      // Add the new message to the list immediately for better UX
      if (data.message) {
        // Use a callback to properly update state
        setMessages(prev => [...prev, data.message]);
      }
      
      // Clear the input
      setNewMessage('');
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };
  
  return {
    messages,
    loading: loading && !initialLoadComplete, // Only show loading on initial fetch
    error,
    newMessage,
    setNewMessage,
    sendMessage,
    currentUserId,
    setMessages  // Add this line to export setMessages

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