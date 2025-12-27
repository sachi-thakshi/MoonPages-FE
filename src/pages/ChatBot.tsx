import React, { useState, useRef, useEffect, type FormEvent } from 'react'
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react'
import { sendChatMessage } from '../services/chat'

interface Message {
  role: 'user' | 'bot'
  content: string
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi! I am your library assistant. Ask me about our books!' }
  ])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const data = await sendChatMessage(currentInput)
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }])
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "I'm having trouble connecting to the library servers." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
            <Bot className="text-indigo-400" size={20} />
            <h3 className="font-semibold text-white">MoonPages Assistant</h3>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Loader2 className="animate-spin text-indigo-400" size={20} />
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              className="flex-1 bg-slate-950 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
            />
            <button type="submit" disabled={isLoading} className="text-indigo-500 hover:text-indigo-400">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot