import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, BookOpen, Star, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/imageHelper';
import useSEO from '../hooks/useSEO';
import bathroomImg from '../assets/images/bathroom.jpeg';
import bgImg from '../assets/images/bg.jpeg';
import familyImg from '../assets/images/family.jpeg';
import familyroomImg from '../assets/images/familyroom.jpeg';
import masterImg from '../assets/images/master.jpeg';
import masterbedroomImg from '../assets/images/masterbedroom.jpeg';
import roomImg from '../assets/images/room.jpeg';
import sitoutImg from '../assets/images/sitout.jpeg';

// Define the comprehensive list of mock posts with details
const MOCK_POSTS = {
  'ultimate-guide-to-hassle-free-hotel-booking': {
    title: 'The Ultimate Guide to Hassle Free Hotel Booking',
    description: 'Booking a hotel doesn\'t have to be a stressful chore. With the right strategies and tips, you can secure the perfect accommodation for your vacation effortlessly.',
    content: `Booking a hotel doesn't have to be a stressful chore. With the right strategies and tips, you can secure the perfect accommodation for your vacation effortlessly. 

    When planning a trip, accommodation is often the largest expense and the most critical component. A great hotel can elevate your travel experience, while a bad one can damp your spirits. Here is our step-by-step guide to booking your hotel like a professional:
    
    1. Plan and Book Early
    Booking early is the most reliable way to lock in the best rates and secure your choice of room. Resorts like Lake Breeze have high demand, especially during peak holiday seasons. Booking 2 to 3 months in advance is recommended.
    
    2. Understand Your Priorities
    Are you looking for a quiet family getaway, a wellness retreat, or an adventure-filled trip? Understanding your trip's nature helps choose the correct resort style. For a peaceful escape, lake views and garden settings are ideal.
    
    3. Look for Direct Booking Perks
    Many travelers make the mistake of using third-party sites without checking the hotel's direct website. Booking directly with the resort often unlocks exclusive deals, priority room upgrades, flexible cancellation terms, and complimentary amenities (such as a sunset cruise or guided nature walks).
    
    At Lake Breeze Resorts, direct bookings via WhatsApp or our official website enjoy special discounts and priority check-in options. Make sure to explore active campaign vouchers before making your reservation.`,
    image: masterbedroomImg,
    author: 'Robert Fox',
    date: 'Sep 09, 2026',
    category: 'Hotel Booking',
    tags: ['Hotel', 'Booking', 'Vacation'],
    readTime: '5 min read'
  },
  'top-10-tips-to-find-perfect-hotel': {
    title: 'Top 10 Tips to Find the Perfect Hotel for Your Next Trip',
    description: 'Looking for the perfect resort for your holiday? Here are our top 10 expert recommendations to find an accommodation that checks all your boxes.',
    content: `Finding the perfect hotel can make or break your vacation. With millions of choices globally, filtering down to the absolute best option requires a strategic check. Here are our top 10 expert recommendations:

    1. Match Location with Your Itinerary: Choose a resort that is centrally located or conveniently connected to the highlights of your destination.
    2. Check the Amenity List: Don't assume standard amenities. Ensure Wi-Fi, swimming pool access, parking, and gym facilities are included and active.
    3. Read Recent Guest Reviews: Reviews from the last 2-3 months give the most accurate status of service quality and cleanliness.
    4. Focus on Safety: Look for hotels with 24/7 security, medical support, and well-trained staff.
    5. Inquire About Dining Options: Having a good in-house restaurant serving authentic local and international cuisines is highly convenient.
    6. Explore Family-Friendly Services: If traveling with kids, look for kids' clubs, baby cot availability, and child-safe areas.
    7. Look at Room Layouts: Do you need a suite, interconnecting rooms, or a private balcony? Select the room layout that maximizes comfort.
    8. Check Loyalty Programs: Join loyalty networks or direct booking clubs to enjoy immediate rewards.
    9. Review Cancellation Policies: Travel plans can change. Choose refundable or flexible options whenever possible.
    10. Call the Hotel Directly: If you have special requests or want to negotiate custom packages, calling the resort manager directly can yield incredible results.`,
    image: familyroomImg,
    author: 'Robert Fox',
    date: 'Sep 12, 2026',
    category: 'Holiday',
    tags: ['Hotel', 'Trip', 'Planning'],
    readTime: '6 min read'
  },
  'wonderful-17-places-in-paris': {
    title: 'Wonderful 17 places you cannot ignore in Paris',
    description: 'Paris, the City of Light, holds countless secrets and famous sights. Here are the 17 absolute best spots you must visit on your next Parisian escape.',
    content: `Paris is a city that captures the heart of every traveler. Beyond the iconic Eiffel Tower, there are numerous hidden gems, scenic walkways, and cultural monuments that are absolutely unmissable. 

    From the artistic streets of Montmartre to the majestic halls of the Louvre, this guide explores 17 places you cannot ignore. Learn where to grab the best croissants, find quiet parks with stunning views, and experience the local side of Paris.
    
    Additionally, we cover how to plan your stays, handle local transportation, and enjoy the city at a relaxed, leisurely pace. Make sure to add these to your travel bucket list!`,
    image: bgImg,
    author: 'Robert Fox',
    date: 'Sep 18, 2026',
    category: 'Destination',
    tags: ['Destination', 'Beautiful', 'Road Trip'],
    readTime: '8 min read'
  },
  'offers-exclusive-services-and-facilities': {
    title: 'Offers Exclusive Services & Facilities to Guests',
    description: 'At Lake Breeze, we believe in pampering our guests. Explore the list of premium facilities and exclusive services that await you during your stay.',
    content: `Luxury is in the details. At Lake Breeze Resorts, we pride ourselves on providing bespoke services that exceed expectations. From custom-crafted backwater cruises to curated dining experiences, we ensure your stay is magical.

    Our premium services include:
    - Traditional Ayurvedic Wellness Massages
    - Private Sunset Motorboat Cruises
    - Chef-led Culinary Workshops on Kerala Spices
    - 24/7 Butler Service for Luxury Suites
    
    Discover how we merge nature and modern luxury to construct a tranquil sanctuary for mind, body, and soul.`,
    image: sitoutImg,
    author: 'Robert Fox',
    date: 'Sep 23, 2026',
    category: 'Events',
    tags: ['Room', 'Destination', 'Vacation'],
    readTime: '4 min read'
  },
  'top-6-hotel-trends-to-watch': {
    title: 'Top 6 Hotel Trends to Watch in 2026',
    description: 'From smart room automations to ultra-personalized experiences, discover the top hospitality trends shaping the future of travel.',
    content: `The hospitality industry is evolving rapidly, driven by technological breakthroughs and changing traveler preferences. Here are the top 6 trends shaping the hotel experience:

    1. Smart Room Customization: Voice-activated lighting, personalized climate control, and digital key entries are becoming standard.
    2. Eco-Friendly Operations: Solar energy, plastic-free amenities, and localized farming integrations are highly demanded by guests.
    3. Wellness Tourism: Dedicated yoga studios, sleep-enhancing rooms, and organic spa treatments.
    4. Bleisure Travel: Combining business with leisure, requiring high-speed connectivity and functional workspaces in rooms.
    5. Hyper-Local Dining: Menus showcasing local cultural culinary heritage and ingredients sourced within a 10-mile radius.
    6. Immersive Local Tours: Guided activities designed to connect travelers with native communities and history.`,
    image: roomImg,
    author: 'Robert Fox',
    date: 'Nov 25, 2026',
    category: 'Holiday',
    tags: ['Hotel', 'Trends', 'Vacation'],
    readTime: '5 min read'
  },
  'booking-your-family-vacation-in-japan': {
    title: 'Booking Your Family Vacation in Japan',
    description: 'Planning a family holiday to Japan? Read our comprehensive itinerary guide to make your trip comfortable, smooth, and enjoyable.',
    content: `Japan is an incredible family destination, offering a perfect blend of ancient heritage and futuristic sights. However, planning a family trip with children requires careful scheduling.

    In this article, we outline best practices for booking accommodations in Tokyo, Kyoto, and Osaka, navigating bullet trains with luggage, finding kid-friendly dining options, and reserving spots at popular attractions (like theme parks and museums) ahead of time.`,
    image: familyImg,
    author: 'Robert Fox',
    date: 'Nov 17, 2026',
    category: 'Vacation',
    tags: ['Japan', 'Family', 'Planning'],
    readTime: '7 min read'
  },
  'merging-nature-with-luxury-hotel': {
    title: 'Merging Nature with Luxury Hotel: The New Standard',
    description: 'Biophilic design and sustainable materials are redefining luxury resorts. Explore how we implement these principles at Lake Breeze.',
    content: `Modern travelers seek connection with the environment without compromising on comfort. This has birthed a new standard in resort architecture: merging nature with luxury.

    At Lake Breeze, we utilize biophilic layouts, open-air lobbies, indigenous spice gardens, and natural wooden furnishings. This aesthetic brings the peacefulness of nature directly into your room, helping you de-stress and rejuvenate completely.`,
    image: bathroomImg,
    author: 'Robert Fox',
    date: 'Nov 02, 2026',
    category: 'Destination',
    tags: ['Hotel', 'Nature', 'Luxury'],
    readTime: '6 min read'
  }
};

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);

  useSEO(
    post ? post.title : t('Travel Stories', 'यात्रा ब्लॉग'),
    post ? post.description : t('Read this travel blog post from Lake Breeze Resorts.', 'लेक ब्रीज रिसॉर्ट्स ब्लॉग पढ़ें।')
  );

  // Fetch blog data
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        // 1. Try to fetch from backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/blogs/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost({
            title: data.title,
            description: data.content,
            content: data.content,
            image: data.image,
            author: data.author || 'Admin',
            date: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            category: data.category || 'Holiday',
            tags: ['Hotel', 'Vacation'],
            readTime: '4 min read'
          });
        } else {
          // 2. Check local mock data if backend returns 404
          if (MOCK_POSTS[slug]) {
            setPost(MOCK_POSTS[slug]);
          } else {
            setPost(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch blog details", error);
        // Fallback to local mock data
        if (MOCK_POSTS[slug]) {
          setPost(MOCK_POSTS[slug]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [slug]);

  // Fetch recent posts list (combines DB blogs and MOCK keys)
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/blogs`);
        if (response.ok) {
          const data = await response.json();
          const dbList = data.slice(0, 4).map(b => ({
            slug: b.slug || b._id,
            title: b.title,
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            image: b.image
          }));
          
          // Combine with some mocks to ensure sidebar is rich
          const mockList = Object.keys(MOCK_POSTS)
            .filter(key => key !== slug)
            .slice(0, 4 - dbList.length)
            .map(key => ({
              slug: key,
              title: MOCK_POSTS[key].title,
              date: MOCK_POSTS[key].date,
              image: MOCK_POSTS[key].image
            }));
            
          setRecentPosts([...dbList, ...mockList].slice(0, 4));
        } else {
          loadMockRecent();
        }
      } catch (err) {
        loadMockRecent();
      }
    };

    const loadMockRecent = () => {
      const list = Object.keys(MOCK_POSTS)
        .filter(key => key !== slug)
        .slice(0, 4)
        .map(key => ({
          slug: key,
          title: MOCK_POSTS[key].title,
          date: MOCK_POSTS[key].date,
          image: MOCK_POSTS[key].image
        }));
      setRecentPosts(list);
    };

    fetchRecent();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#F8FAFA] min-h-screen flex items-center justify-center py-24">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-teal-100 border-t-teal-700 animate-spin" />
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{t('Loading Article...', 'लेख लोड हो रहा है...')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#F8FAFA] min-h-screen py-24 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-300" />
          <h2 className="text-2xl font-black text-slate-800">{t('Article Not Found', 'लेख नहीं मिला')}</h2>
          <p className="text-gray-500 text-sm">{t('The article you are looking for does not exist or has been removed.', 'आप जो लेख ढूंढ रहे हैं वह मौजूद नहीं है या हटा दिया गया है।')}</p>
          <button 
            onClick={() => navigate('/blog')}
            className="w-full py-4 bg-neutral-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> {t('Back to Blog', 'ब्लॉग पर वापस जाएं')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFA] min-h-screen">
      {/* 1. Header Card */}
      <section className="px-4 py-4 md:px-8 md:py-6 bg-white w-full max-w-[1400px] mx-auto">
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col justify-center items-center text-center shadow-md">
          {/* Background image & Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={post.image ? getImageUrl(post.image) : bgImg}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Dark green gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C4C]/95 via-[#0F4C4C]/85 to-teal-900/70 backdrop-blur-[1px]" />
          </div>
          
          {/* Header Text Content */}
          <div className="relative z-10 text-white space-y-3 px-4 sm:px-6 max-w-4xl">
            <div className="flex items-center justify-center gap-2 text-teal-300 opacity-80">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">{post.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-teal-200">
              <Link to="/" className="hover:text-white transition-colors">{t('Home', 'होम')}</Link>
              <span>•</span>
              <Link to="/blog" className="hover:text-white transition-colors">{t('Blog', 'ब्लॉग')}</Link>
              <span>•</span>
              <span className="text-white truncate max-w-[200px]">{post.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 w-full">
          
          {/* Left Column: Post details */}
          <article className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-[32px] border border-gray-100 shadow-sm">
            
            {/* Back Button */}
            <button 
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0f4c4c] transition-colors"
            >
              <ArrowLeft size={14} /> {t('Back to Blog', 'ब्लॉग पर वापस जाएं')}
            </button>

            {/* Featured Image */}
            <div className="relative rounded-[24px] overflow-hidden bg-gray-100 shadow-sm aspect-[16/9]">
              <img
                src={post.image ? getImageUrl(post.image) : bgImg}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 border-y border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
              <div className="flex items-center gap-2 text-slate-800">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#0F4C4C] font-black text-xs">
                  {post.author?.charAt(0).toUpperCase()}
                </div>
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#0F4C4C]" />
                <span>Published: {post.date}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto sm:ml-0 md:ml-auto">
                <Clock size={14} className="text-[#0F4C4C]" />
                <span>{post.readTime || '5 min read'}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-6 font-poppins">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Tags footer */}
            <div className="flex flex-wrap items-center gap-2.5 pt-8 border-t border-gray-150">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Tags:', 'टैग:')}</span>
              {post.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-50 text-slate-600 border border-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>

          </article>

          {/* Right Column: Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Widget 1: Blog Bio or Promotion */}
            <div className="bg-gradient-to-br from-[#0F4C4C] to-teal-900 p-8 rounded-[24px] text-white shadow-xl space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">
                <Sparkles size={100} className="text-white" />
              </div>
              <div className="space-y-2 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-teal-300 border border-white/10">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-black tracking-tight">Lake Breeze Chronicles</h3>
                <p className="text-teal-100/80 text-xs leading-relaxed font-medium">
                  Discover stories of local culture, resort updates, travel guides, and exclusive offers straight from the Kerala backwaters.
                </p>
              </div>
              <div className="pt-2 relative z-10">
                <Link 
                  to="/rooms"
                  className="w-full py-3.5 bg-white text-[#0F4C4C] rounded-xl text-center text-xs font-black uppercase tracking-widest hover:bg-teal-50 transition-all flex items-center justify-center shadow-lg"
                >
                  Book Your Sanctuary
                </Link>
              </div>
            </div>

            {/* Widget 2: Recent Posts */}
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-gray-100 pb-3">{t('Recent Post', 'हालिया पोस्ट')}</h3>
              <div className="space-y-5">
                {recentPosts.map((rPost, idx) => (
                  <Link key={rPost.slug || idx} to={`/blog/${rPost.slug}`} className="flex gap-4 items-center group cursor-pointer">
                    {/* Small thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-sm relative">
                      <img
                        src={rPost.image ? getImageUrl(rPost.image) : bgImg}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Info */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-[#0F4C4C] transition-colors line-clamp-2">
                        {rPost.title}
                      </h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {rPost.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
