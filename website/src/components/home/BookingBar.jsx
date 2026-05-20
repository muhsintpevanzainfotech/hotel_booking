import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const BookingBar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    navigate('/rooms');
  };

  return (
    <div className="booking-box">
      <div className="input-group">
        <label>
          <Calendar size={14} className="inline-block mr-2" /> 
          {t('Check In', 'आगमन')}
        </label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          placeholderText={t('Select Date', 'तिथि चुनें')}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className="input-group">
        <label>
          <Calendar size={14} className="inline-block mr-2" /> 
          {t('Check Out', 'प्रस्थान')}
        </label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          placeholderText={t('Select Date', 'तिथि चुनें')}
          minDate={checkIn || new Date()}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className="input-group">
        <label>
          <Users size={14} className="inline-block mr-2" /> 
          {t('Guests', 'अतिथि')}
        </label>
        <select 
          value={guests} 
          onChange={(e) => setGuests(e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} {t('Persons', 'व्यक्ति')}</option>
          ))}
        </select>
      </div>

      <button 
        className="btn btn-primary h-[50px] shadow-lg"
        onClick={handleSearch}
      >
        <Search size={20} className="mr-2" />
        {t('Check Availability', 'उपलब्धता जांचें')}
      </button>
    </div>
  );
};

export default BookingBar;
