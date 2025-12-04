import { Link } from "react-router-dom"
import { useState } from 'react'
import { BookOpen, Moon, Star, Users, Sparkles, ChevronRight, Menu, X, MessageCircle, FileText, Zap, Brain } from 'lucide-react'

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const featuredBooks = [
    { 
      title: "The Midnight Library", 
      author: "Matt Haig", 
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      rating: 4.5
    },
    { 
      title: "Atomic Habits", 
      author: "James Clear", 
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
      rating: 4.8
    },
    { 
      title: "The Silent Patient", 
      author: "Alex Michaelides", 
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      rating: 4.3
    },
    { 
      title: "Educated", 
      author: "Tara Westover", 
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      rating: 4.7
    },
    { 
      title: "Where the Crawdads Sing", 
      author: "Delia Owens", 
      cover: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop",
      rating: 4.6
    },
    { 
      title: "The Seven Husbands", 
      author: "Taylor Jenkins Reid", 
      cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
      rating: 4.4
    },
  ]

  const features = [
    { icon: BookOpen, title: "Vast Library", desc: "Access thousands of books across all genres" },
    { icon: Brain, title: "AI Chat Assistant", desc: "Ask questions and discuss books with AI" },
    { icon: FileText, title: "AI Summaries", desc: "Get instant intelligent book summaries" },
    { icon: Moon, title: "Night Mode", desc: "Read comfortably any time of day or night" },
    { icon: Users, title: "Community", desc: "Connect with readers worldwide" },
    { icon: Sparkles, title: "Personalized", desc: "Get recommendations tailored to you" },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white">

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-indigo-900/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Moon className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                MoonPages
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div>
                <Link
                    to="/login"
                    className="px-4 py-2 text-indigo-400 border border-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition">
                        Sign In
                </Link>
              </div>
              <div>
                <Link
                    to="/register"
                    className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-yellow-500 transition">
                        Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <a href="#features" className="block hover:text-indigo-400 transition">Features</a>
              <a href="#library" className="block hover:text-indigo-400 transition">Library</a>
              <div className="md:hidden py-4 space-y-4">
                <div>
                <Link
                    to="/login"
                    className="w-full px-4 py-2 text-indigo-400 border border-indigo-400 rounded-lg hover:bg-indigo-400 hover:text-white transition"
                >
                        Sign In
                </Link>
              </div>
              <div>
                <Link
                    to="/register"
                    className="w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition">
                        Get Started
                </Link>
              </div>
              </div>
              
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-950/50 border border-indigo-800/30 rounded-full mb-8">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Join 100,000+ readers worldwide</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Gateway to
            <span className="block bg-linear-to-r from-indigo-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Infinite Stories
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
            Discover, read, and fall in love with books from every corner of the literary world. 
            All in one beautiful, distraction-free platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div>
                <Link
                    to="/register"
                    className="px-8 py-4 bg-linear-to-r from-yellow-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-indigo-500 hover:to-yellow-500 transition transform hover:scale-105 flex items-center justify-center gap-2">
                            Start Reading Free
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
          </div>
        </div>

        {/* Book Cards */}
        <div className="relative max-w-6xl mx-auto mt-20 h-96 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
                <div className="flex gap-6 animate-scroll">
                {[...featuredBooks, ...featuredBooks].map((book, idx) => (
                    <div 
                    key={idx}
                    className="shrink-0 w-48 aspect-2/3 rounded-lg shadow-2xl cursor-pointer overflow-hidden group relative"
                    >
                    <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <h3 className="font-bold text-sm mb-1">{book.title}</h3>
                        <p className="text-xs text-slate-300 mb-1">{book.author}</p>
                        <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{book.rating}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        <style>{`
            @keyframes scroll {
                0% {
                transform: translateX(0);
                }
                100% {
                transform: translateX(-50%);
                }
            }
            
            .animate-scroll {
                animation: scroll 30s linear infinite;
            }
         `}</style>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose <span className="font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent"> MoonPages</span>?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-indigo-500 transition group"
              >
                <feature.icon className="w-12 h-12 text-indigo-400 mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-950/50 border border-purple-800/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Powered by AI</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Your Personal <span className="text-purple-400">AI Reading Assistant</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the future of reading with intelligent features designed to enhance your journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Chat Assistant */}
            <div className="bg-linear-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-800/30 rounded-2xl p-8 hover:border-indigo-600 transition">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-indigo-600 rounded-xl">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">AI Chat Assistant</h3>
                  <p className="text-slate-300">Have deep conversations about any book</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <p className="text-sm text-slate-300">"What's the main theme of this chapter?"</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-sm text-slate-300">"Explain the character's motivation"</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-pink-500">
                  <p className="text-sm text-slate-300">"Compare this to similar books"</p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  Real-time answers to your questions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  Character analysis and plot discussions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  Contextual understanding of the story
                </li>
              </ul>
            </div>

            {/* AI Summary */}
            <div className="bg-linear-to-br from-purple-950/50 to-pink-950/50 border border-purple-800/30 rounded-2xl p-8 hover:border-purple-600 transition">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">AI Book Summaries</h3>
                  <p className="text-slate-300">Instant intelligent summaries at your fingertips</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 mb-6 border border-purple-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-400">AI Generated Summary</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Get comprehensive summaries of entire books, specific chapters, or key concepts. 
                  Perfect for quick reviews, study aids, or deciding what to read next.
                </p>
              </div>

              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Chapter-by-chapter breakdowns
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Key themes and takeaways
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Save time without missing details
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Begin Your Reading Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of readers discovering their next favorite book
          </p>
          <div>
            <Link
                to="/register"
                className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition transform hover:scale-105">
                    Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Moon className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold">MoonPages</span>
            </div>
            
            <p className="text-slate-400">© 2025 MoonPages. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}