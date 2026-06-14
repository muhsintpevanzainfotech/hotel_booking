import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, X, Calendar, Users, CheckCircle, 
  AlertCircle, Phone, Mail, FileText, Sparkles, MapPin, 
  ArrowLeft, RefreshCw, HelpCircle, ChevronRight, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageHelper';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  // Guided flow states
  const [flowState, setFlowState] = useState({
    type: 'idle', // 'idle', 'booking', 'status', 'enquiry'
    step: 0,
    data: {}
  });

  const messagesEndRef = useRef(null);

  // Initialize chatbot with welcome message
  useEffect(() => {
    resetChat();
    fetchRooms();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error('Failed to fetch rooms for chatbot:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const resetChat = () => {
    setFlowState({ type: 'idle', step: 0, data: {} });
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Namaste! Welcome to Lake Breeze Resorts, Kumarakom. 🌿 I am your AI Concierge. How can I assist you with your paradise experience today?',
        timestamp: new Date(),
        showOptions: true
      }
    ]);
  };

  const addBotMessage = (text, options = null, component = null) => {
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'bot',
        text,
        timestamp: new Date(),
        showOptions: !!options,
        options,
        component
      }
    ]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'user',
        text,
        timestamp: new Date()
      }
    ]);
  };

  // Main input text submission
  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const text = inputValue.trim();
    addUserMessage(text);
    setInputValue('');

    // If we are in the middle of a form flow, typing might interrupt or we can try to interpret it
    if (flowState.type !== 'idle') {
      // Allow users to reset if they want
      if (text.toLowerCase().includes('cancel') || text.toLowerCase().includes('reset') || text.toLowerCase().includes('stop')) {
        addUserMessage('Cancel request');
        addBotMessage('I have cancelled the current flow. How else can I help you?');
        resetChat();
        return;
      }
      
      // Let the flow handler handle the text input if applicable, else show fallback
      handleFlowTextInput(text);
    } else {
      // Default: parse text for FAQ
      setTimeout(() => {
        handleFAQResponse(text);
      }, 600);
    }
  };

  // Process text messages when in a flow state
  const handleFlowTextInput = (text) => {
    // Basic text capturing for flow steps
    if (flowState.type === 'status' && flowState.step === 1) {
      handleStatusLookup(text);
    } else {
      // Fallback
      addBotMessage("I am currently guiding you through a request. You can finish it or type 'cancel' to return to the main menu.");
    }
  };

  // FAQ Keyword Matcher
  const handleFAQResponse = (query) => {
    const text = query.toLowerCase();
    
    if (text.includes('book') || text.includes('reserve') || text.includes('stay') || text.includes('room') || text.includes('rent')) {
      startBookingFlow();
      return;
    }
    if (text.includes('status') || text.includes('check booking') || text.includes('reference') || text.includes('id')) {
      startStatusFlow();
      return;
    }
    if (text.includes('enquiry') || text.includes('message') || text.includes('contact') || text.includes('support') || text.includes('complain')) {
      startEnquiryFlow();
      return;
    }
    if (text.includes('facility') || text.includes('amenities') || text.includes('service')) {
      showFacilities();
      return;
    }

    // Direct FAQ matches
    let reply = "";
    if (text.includes('wifi') || text.includes('internet')) {
      reply = "We offer high-speed complimentary Wi-Fi in all rooms, cottages, and public spaces throughout the resort.";
    } else if (text.includes('checkin') || text.includes('check-in') || text.includes('checkout') || text.includes('check-out') || text.includes('time')) {
      reply = "Our standard check-in time is 2:00 PM, and check-out time is 11:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges.";
    } else if (text.includes('location') || text.includes('address') || text.includes('where') || text.includes('directions')) {
      reply = "Lake Breeze Resorts is located on the serene banks of Vembanad Lake in Kumarakom, Kottayam, Kerala - 686563. Click the 'Map' option on our contact page to see routes!";
    } else if (text.includes('breakfast') || text.includes('food') || text.includes('restaurant') || text.includes('dining') || text.includes('meal')) {
      reply = "Our lakeside restaurant serves authentic Kerala dishes as well as continental and North Indian cuisines. Complimentary breakfast is included with most bookings!";
    } else if (text.includes('pool') || text.includes('swimming')) {
      reply = "Yes, we feature a stunning infinity swimming pool overlooking Vembanad Lake, open for guests from 7:00 AM to 7:00 PM.";
    } else if (text.includes('spa') || text.includes('massage') || text.includes('ayurveda')) {
      reply = "We offer a professional Ayurvedic Wellness Spa. You can view therapies and book slots at the front desk upon arrival.";
    } else if (text.includes('parking')) {
      reply = "Complimentary secure private parking is available on-site for all resort guests.";
    } else if (text.includes('price') || text.includes('cost') || text.includes('rates') || text.includes('cheap')) {
      reply = "Our seasonal room rates range from ₹4,000 for budget rooms to ₹15,000+ for premium lakeview cottages. Select 'Book a Room' to check real-time rates!";
    } else if (text.includes('activity') || text.includes('boating') || text.includes('houseboat') || text.includes('tour')) {
      reply = "We organize sunset motorboat cruises, backwater houseboat trips, local village visits, and traditional fishing. Our travel desk can help book these.";
    } else if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('namaste')) {
      reply = "Hello there! How can I help you today?";
    } else {
      reply = "I'm not sure I fully understand that. I can assist you with booking a room, checking booking status, submitting an enquiry, or answering standard FAQs. What would you like to do?";
    }

    addBotMessage(reply, [
      { label: '🏨 Book a Room', action: 'book' },
      { label: '🔑 Check Booking Status', action: 'status' },
      { label: '✉️ Send Enquiry', action: 'enquiry' },
      { label: '🌿 Explore Facilities', action: 'facilities' }
    ]);
  };

  // Option select handler
  const handleOptionClick = (action, label) => {
    addUserMessage(label);

    setTimeout(() => {
      switch (action) {
        case 'book':
          startBookingFlow();
          break;
        case 'status':
          startStatusFlow();
          break;
        case 'enquiry':
          startEnquiryFlow();
          break;
        case 'facilities':
          showFacilities();
          break;
        case 'faq':
          showFAQMenu();
          break;
        case 'reset':
          resetChat();
          break;
        default:
          resetChat();
      }
    }, 400);
  };

  // Flows: 1. Booking
  const startBookingFlow = () => {
    setFlowState({
      type: 'booking',
      step: 1, // Step 1: Select room
      data: {}
    });

    if (rooms.length === 0) {
      addBotMessage("Checking our room database... Please wait a moment.");
      fetchRooms().then(() => {
        addBotMessage("Please select one of our premium sanctuaries to start booking:", null, 'room_select');
      });
    } else {
      addBotMessage("Please select one of our premium sanctuaries to start booking:", null, 'room_select');
    }
  };

  const handleRoomSelect = (room) => {
    setFlowState(prev => ({
      ...prev,
      step: 2, // Step 2: Date select
      data: { ...prev.data, room }
    }));

    addBotMessage(`Perfect! You've selected **${room.name}** (₹${room.price.toLocaleString()}/night). Let's choose your check-in and check-out dates:`, null, 'date_select');
  };

  const handleDatesSubmit = (checkIn, checkOut) => {
    // Validate dates
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (start < today) {
      toast.error('Check-in date cannot be in the past');
      return;
    }
    if (end <= start) {
      toast.error('Check-out date must be after check-in');
      return;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * flowState.data.room.price;

    setFlowState(prev => ({
      ...prev,
      step: 3, // Step 3: Guests select
      data: { 
        ...prev.data, 
        checkIn, 
        checkOut,
        days: diffDays,
        totalPrice 
      }
    }));

    addBotMessage(`Nice! A ${diffDays}-night stay. Total price: **₹${totalPrice.toLocaleString()}**. How many guests will be staying?`, null, 'guests_select');
  };

  const handleGuestsSubmit = (adults, children) => {
    setFlowState(prev => ({
      ...prev,
      step: 4, // Step 4: Contact details
      data: { ...prev.data, adults, children }
    }));

    addBotMessage("Got it. Lastly, please fill in your contact information to finalize the reservation:", null, 'contact_select');
  };

  const handleContactSubmit = async (guestName, email, phone, specialRequests) => {
    // Basic validations
    if (!guestName || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    const bookingPayload = {
      ...flowState.data,
      guestName,
      email,
      phone,
      specialRequests,
      room: flowState.data.room._id
    };

    setFlowState(prev => ({ ...prev, step: 5 })); // Loading state
    addBotMessage("Reserving your sanctuary... Please wait.");

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();
      if (response.ok) {
        setFlowState({ type: 'idle', step: 0, data: {} });
        addBotMessage(`✨ booking confirmed! ✨\n\nYour sanctuary **${bookingPayload.room.name}** is reserved for **${bookingPayload.days} nights** (${bookingPayload.checkIn} to ${bookingPayload.checkOut}).\n\n📝 **Booking Reference:** ${data.bookingReference}\n\nWe have sent a confirmation email to **${email}**. Thank you for choosing Lake Breeze Resorts!`);
      } else {
        toast.error(data.message || 'Booking failed');
        setFlowState(prev => ({ ...prev, step: 4 })); // Go back to details
        addBotMessage("Sorry, I could not complete the booking. Please review your information and try again:", null, 'contact_select');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error during booking');
      setFlowState(prev => ({ ...prev, step: 4 }));
      addBotMessage("A network error occurred. Please try confirming again:", null, 'contact_select');
    }
  };

  // Flows: 2. Status check
  const startStatusFlow = () => {
    setFlowState({
      type: 'status',
      step: 1, // Step 1: Input Booking Ref
      data: {}
    });

    addBotMessage("Please enter your 8-digit **Booking Reference ID** (e.g. LBR-XXXXX or similar ID received via email):", null, 'status_input');
  };

  const handleStatusLookup = async (refCode) => {
    if (!refCode || refCode.trim().length < 4) {
      toast.error("Please enter a valid Booking Reference");
      return;
    }

    addBotMessage(`Searching database for: **${refCode.trim()}**...`);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/bookings/reference/${refCode.trim()}`);
      const data = await res.json();

      if (res.ok && data) {
        setFlowState({ type: 'idle', step: 0, data: {} });
        
        const checkInFormatted = new Date(data.checkIn).toLocaleDateString();
        const checkOutFormatted = new Date(data.checkOut).toLocaleDateString();

        const statusHTML = (
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-xs space-y-3 font-poppins mt-2">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="font-black text-[#0F4C4C] uppercase tracking-wider">Booking Status</span>
              <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                data.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                data.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                {data.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-600 font-medium">
              <div>Reference:</div>
              <div className="font-bold text-gray-900 text-right">{data.bookingReference}</div>
              <div>Room:</div>
              <div className="font-bold text-gray-900 text-right">{data.room?.name || 'Sanctuary'}</div>
              <div>Guest Name:</div>
              <div className="font-bold text-gray-900 text-right">{data.guestName}</div>
              <div>Check-in:</div>
              <div className="font-bold text-gray-900 text-right">{checkInFormatted}</div>
              <div>Check-out:</div>
              <div className="font-bold text-gray-900 text-right">{checkOutFormatted}</div>
              <div>Guests:</div>
              <div className="font-bold text-gray-900 text-right">{data.adults} Adults, {data.children} Children</div>
              <div className="border-t border-gray-100 pt-2 font-bold text-primary">Total:</div>
              <div className="border-t border-gray-100 pt-2 font-black text-right text-primary">₹{data.totalPrice.toLocaleString()}</div>
            </div>
          </div>
        );

        addBotMessage("Here is what I found for your booking:", null, statusHTML);
      } else {
        addBotMessage("I couldn't find any booking matching that reference. Please check your booking code and try again.", null, 'status_input');
      }
    } catch (err) {
      console.error(err);
      addBotMessage("An error occurred while fetching booking details. Please try again.", null, 'status_input');
    }
  };

  // Flows: 3. Enquiry
  const startEnquiryFlow = () => {
    setFlowState({
      type: 'enquiry',
      step: 1,
      data: {}
    });

    addBotMessage("Fill out this message form, and our front desk concierge will get back to you shortly:", null, 'enquiry_form');
  };

  const handleEnquirySubmit = async (name, email, message) => {
    if (!name || !email || !message) {
      toast.error("Please fill all fields");
      return;
    }

    addBotMessage("Sending enquiry... Please wait.");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: 'Concierge Chat Inquiry', message })
      });
      if (res.ok) {
        setFlowState({ type: 'idle', step: 0, data: {} });
        addBotMessage("Thank you! Your inquiry has been submitted successfully. Our staff will respond via email shortly.");
      } else {
        addBotMessage("Sorry, I failed to send the enquiry. Please try again:", null, 'enquiry_form');
      }
    } catch (err) {
      console.error(err);
      addBotMessage("A network error occurred. Please try sending again:", null, 'enquiry_form');
    }
  };

  // Flows: 4. Facilities Display
  const showFacilities = () => {
    const facilitiesList = (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {[
          { name: 'Infinity Pool 🏊‍♂️', desc: 'Overlooking Vembanad Lake' },
          { name: 'Ayurvedic Spa 💆‍♀️', desc: 'Authentic wellness treatments' },
          { name: 'Sunset Boating ⛵', desc: 'Complementary lake tours' },
          { name: 'Lakeside Restaurant 🍽️', desc: 'Local & Global delicacies' },
          { name: 'Free Wi-Fi 🌐', desc: 'High-speed resort-wide' },
          { name: 'Private Gardens 🌸', desc: 'Lush tropical greenery' }
        ].map((fac, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-2.5 rounded-xl shadow-xs text-[10px] flex flex-col justify-center">
            <span className="font-bold text-[#0F4C4C]">{fac.name}</span>
            <span className="text-gray-400 font-medium text-[8px] leading-tight mt-0.5">{fac.desc}</span>
          </div>
        ))}
      </div>
    );

    addBotMessage("Lake Breeze Resorts offers premium luxury amenities to ensure a memorable stay. Here are our main facilities:", null, facilitiesList);
  };

  // Flows: 5. FAQ Menu
  const showFAQMenu = () => {
    addBotMessage("Choose a topic below or type your question directly in the chat bar:", [
      { label: '⏰ Check-in / Check-out Times', action: 'faq_time' },
      { label: '📍 Resort Location & Directions', action: 'faq_location' },
      { label: '🍽️ Restaurant & Food Options', action: 'faq_food' },
      { label: '🏊‍♂️ Spa & Swimming Pool', action: 'faq_spa' },
      { label: '🛶 Boating & Lake Activities', action: 'faq_activities' }
    ]);
  };

  // Render Custom Component inside Bot Messages
  const renderCustomComponent = (type, messageId) => {
    if (typeof type === 'object') {
      return type; // React element passed directly
    }

    switch (type) {
      case 'room_select':
        return (
          <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar max-w-full">
            {rooms.length === 0 ? (
              <div className="text-xs text-gray-400 italic p-3">Loading available sanctuaries...</div>
            ) : (
              rooms.map((room) => (
                <div 
                  key={room._id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-[200px] max-w-[200px] flex flex-col flex-shrink-0"
                >
                  <img 
                    src={room.images?.[0]?.url ? getImageUrl(room.images[0].url) : '/room_deluxe.png'} 
                    alt={room.name} 
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-primary text-xs line-clamp-1">{room.name}</h4>
                      <p className="text-[10px] font-black text-secondary">₹{room.price.toLocaleString()} <span className="text-[8px] font-normal text-gray-400">/ night</span></p>
                      <p className="text-[8px] text-gray-400 font-medium">Cap: {room.capacity} Guests</p>
                    </div>
                    <button 
                      onClick={() => handleRoomSelect(room)}
                      className="w-full bg-primary text-white py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-secondary transition-all active:scale-95"
                    >
                      Choose
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'date_select':
        return <DateSelectForm onSubmit={handleDatesSubmit} />;

      case 'guests_select':
        return <GuestsSelectForm onSubmit={handleGuestsSubmit} />;

      case 'contact_select':
        return <ContactSelectForm onSubmit={handleContactSubmit} roomPrice={flowState.data.room?.price} checkIn={flowState.data.checkIn} checkOut={flowState.data.checkOut} />;

      case 'status_input':
        return <StatusInputForm onSubmit={handleStatusLookup} />;

      case 'enquiry_form':
        return <EnquiryForm onSubmit={handleEnquirySubmit} />;

      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-8 z-[9999]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-gradient-to-tr from-[#0F4C4C] to-[#2E7D7D] text-white rounded-full shadow-[0_15px_30px_-5px_rgba(15,76,76,0.5)] hover:shadow-[0_20px_40px_-5px_rgba(15,76,76,0.7)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border border-white/10`}
          title="AI Assistant"
        >
          {isOpen ? (
            <X size={24} className="animate-in spin-in duration-300" />
          ) : (
            <div className="relative">
              <MessageSquare size={24} className="animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-primary animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-primary"></span>
            </div>
          )}
          {/* Tooltip */}
          {!isOpen && (
            <span className="absolute right-18 bg-primary text-white px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
              AI Concierge
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-[88px] right-4 sm:right-8 z-[9999] w-[calc(100vw-2rem)] sm:w-[380px] h-[calc(100vh-120px)] sm:h-[540px] max-h-[600px] bg-white/95 backdrop-blur-lg rounded-[28px] border border-gray-100 shadow-[0_30px_70px_-15px_rgba(15,76,76,0.3)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#0F4C4C] p-4 text-white flex items-center justify-between shadow-md relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#B8860B]"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                  <Sparkles size={18} className="text-[#B8860B]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight font-poppins">Lake Breeze AI</h3>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-teal-300 uppercase tracking-widest leading-none mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online Concierge
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetChat} 
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                  title="Reset conversation"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-grow p-4 overflow-y-auto no-scrollbar space-y-4 bg-[#F8FAFA]">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-poppins shadow-xs whitespace-pre-wrap ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  
                  {/* Option Button shortcuts */}
                  {msg.sender === 'bot' && msg.showOptions && msg.options && (
                    <div className="flex flex-wrap gap-2 pt-1 pl-1">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt.action, opt.label)}
                          className="px-3 py-2 bg-white hover:bg-primary hover:text-white border border-gray-100 text-primary text-[10px] font-bold rounded-full shadow-xs hover:shadow-sm transition-all active:scale-95"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Custom Forms/Sliders if specified */}
                  {msg.sender === 'bot' && msg.component && (
                    <div className="pt-2 pl-1">
                      {renderCustomComponent(msg.component, msg.id)}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Footer - Default menu */}
            {flowState.type === 'idle' && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto no-scrollbar flex gap-2">
                <button 
                  onClick={() => handleOptionClick('book', '🏨 Book a Room')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-[#0F4C4C] hover:text-white border border-teal-100 text-[#0F4C4C] text-[9px] font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap"
                >
                  Book 🏨
                </button>
                <button 
                  onClick={() => handleOptionClick('status', '🔑 Booking Status')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-[#0F4C4C] hover:text-white border border-teal-100 text-[#0F4C4C] text-[9px] font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap"
                >
                  Status 🔑
                </button>
                <button 
                  onClick={() => handleOptionClick('enquiry', '✉️ Contact Us')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-[#0F4C4C] hover:text-white border border-teal-100 text-[#0F4C4C] text-[9px] font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap"
                >
                  Enquire ✉️
                </button>
                <button 
                  onClick={() => handleOptionClick('facilities', '🌿 Facilities')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-[#0F4C4C] hover:text-white border border-teal-100 text-[#0F4C4C] text-[9px] font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap"
                >
                  Facilities 🌿
                </button>
                <button 
                  onClick={() => handleOptionClick('faq', '💬 FAQ / Info')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-[#0F4C4C] hover:text-white border border-teal-100 text-[#0F4C4C] text-[9px] font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap"
                >
                  FAQ 💬
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSendText} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  flowState.type === 'status' && flowState.step === 1
                    ? 'Enter Reference ID...'
                    : 'Type a message (e.g. WiFi, Location)...'
                }
                className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-medium text-gray-800 focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-primary disabled:bg-gray-100 text-white disabled:text-gray-300 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* Helper Components for Guided Forms */

// Date Select Form
const DateSelectForm = ({ onSubmit }) => {
  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: ''
  });

  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDatesSubmit = (e) => {
    e.preventDefault();
    if (!dates.checkIn || !dates.checkOut) return;
    onSubmit(dates.checkIn, dates.checkOut);
  };

  return (
    <form onSubmit={handleDatesSubmit} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-xs space-y-3 font-poppins mt-2">
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-gray-500">Check-in Date</label>
        <input 
          type="date"
          min={getTodayString()}
          required
          value={dates.checkIn}
          onChange={(e) => setDates(prev => ({ ...prev, checkIn: e.target.value }))}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-gray-500">Check-out Date</label>
        <input 
          type="date"
          min={dates.checkIn || getTodayString()}
          required
          value={dates.checkOut}
          onChange={(e) => setDates(prev => ({ ...prev, checkOut: e.target.value }))}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-[#0F4C4C] hover:bg-[#2E7D7D] text-white py-2 rounded-lg font-black uppercase text-[9px] tracking-wider flex items-center justify-center gap-2 mt-2 transition-colors"
      >
        Continue <ChevronRight size={12} />
      </button>
    </form>
  );
};

// Guests Select Form
const GuestsSelectForm = ({ onSubmit }) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(adults, children);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-xs space-y-3 font-poppins mt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-gray-500">Adults</label>
          <select 
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C] bg-white"
          >
            {[1, 2, 3, 4].map(n => <option key={n} value={n} className="text-gray-800 bg-white">{n}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-gray-500">Children</label>
          <select 
            value={children}
            onChange={(e) => setChildren(parseInt(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C] bg-white"
          >
            {[0, 1, 2, 3].map(n => <option key={n} value={n} className="text-gray-800 bg-white">{n}</option>)}
          </select>
        </div>
      </div>
      <button 
        type="submit"
        className="w-full bg-[#0F4C4C] hover:bg-[#2E7D7D] text-white py-2 rounded-lg font-black uppercase text-[9px] tracking-wider flex items-center justify-center gap-2 mt-2 transition-colors"
      >
        Continue <ChevronRight size={12} />
      </button>
    </form>
  );
};

// Contact Details & Confirmation Form
const ContactSelectForm = ({ onSubmit, roomPrice, checkIn, checkOut }) => {
  const [form, setForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const getDaysCount = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.abs(end - start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const days = getDaysCount();
  const totalPrice = days * roomPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form.guestName, form.email, form.phone, form.specialRequests);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-xs space-y-3 font-poppins mt-2">
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-gray-500">Full Name *</label>
        <input 
          type="text" 
          required
          placeholder="Jane Doe"
          value={form.guestName}
          onChange={(e) => setForm(prev => ({ ...prev, guestName: e.target.value.replace(/\b\w/g, char => char.toUpperCase()) }))}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-gray-500">Email *</label>
          <input 
            type="email" 
            required
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-gray-500">Phone *</label>
          <input 
            type="tel" 
            required
            placeholder="+91..."
            value={form.phone}
            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-gray-500">Special Request</label>
        <textarea 
          placeholder="Extra bed, late check-in, etc."
          rows="1.5"
          value={form.specialRequests}
          onChange={(e) => setForm(prev => ({ ...prev, specialRequests: e.target.value.length > 0 ? e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) : '' }))}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C] resize-none"
        />
      </div>
      
      {/* Total pricing details */}
      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex justify-between items-center text-[10px]">
        <div>
          <span className="font-bold text-[#0F4C4C]">Total Price ({days} nights):</span>
        </div>
        <span className="font-black text-[#0F4C4C] text-xs">₹{totalPrice.toLocaleString()}</span>
      </div>

      <button 
        type="submit"
        className="w-full bg-[#0F4C4C] text-white py-2 rounded-lg font-black uppercase text-[9px] tracking-wider flex items-center justify-center gap-2 mt-2 hover:bg-[#2E7D7D] transition-colors"
      >
        Confirm Booking <Check size={12} />
      </button>
    </form>
  );
};

// Booking Status Input Form
const StatusInputForm = ({ onSubmit }) => {
  const [refCode, setRefCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!refCode.trim()) return;
    onSubmit(refCode);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-xs flex gap-2 font-poppins mt-2">
      <input 
        type="text" 
        required
        placeholder="Enter Reference (e.g. LBR-12345)"
        value={refCode}
        onChange={(e) => setRefCode(e.target.value)}
        className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
      />
      <button 
        type="submit"
        className="bg-[#0F4C4C] hover:bg-[#2E7D7D] text-white px-4 py-2 rounded-lg font-black uppercase text-[9px] tracking-wider flex items-center justify-center transition-colors"
      >
        Search
      </button>
    </form>
  );
};

// Contact Enquiry Submission Form
const EnquiryForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form.name, form.email, form.message);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-xs space-y-3 font-poppins mt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-gray-500">Name *</label>
          <input 
            type="text" 
            required
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value.replace(/\b\w/g, char => char.toUpperCase()) }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-gray-500">Email *</label>
          <input 
            type="email" 
            required
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C]"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-gray-500">Message *</label>
        <textarea 
          required
          placeholder="How can we help you plan your stay?"
          rows="3"
          value={form.message}
          onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value.length > 0 ? e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) : '' }))}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#0F4C4C] resize-none"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-[#0F4C4C] hover:bg-[#2E7D7D] text-white py-2 rounded-lg font-black uppercase text-[9px] tracking-wider flex items-center justify-center gap-2 mt-1 transition-colors"
      >
        Send Message <Send size={12} />
      </button>
    </form>
  );
};

export default Chatbot;
