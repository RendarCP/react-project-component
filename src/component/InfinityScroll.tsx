import React, { useRef } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface Airline {
  id: number;
  name: string;
  country: string;
  logo: string;
  slogen: string;
  head_guaters: string;
  website: string;
  established: string;
}

interface Passenger {
  _id: string;
  name: string;
  trips: number;
  airline: Airline;
  __v: number;
}

interface Props {
  isLastItem: boolean;
  onFetchMorePassengers: () => void;
}

const Passenger: React.FC<Props> = ({ isLastItem, onFetchMorePassengers, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isIntersecting = !!entry?.isIntersecting;

  useEffect(() => {
    isLastItem && isIntersecting && onFetchMorePassengers();
  }, [isLastItem, isIntersecting])

  return (
    <div
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        border: '1px dashed #00'
      }}
    >
      {children}
    </div>
  )
}

const InfinityScroll = () => {

  const [passengers, setPassengers] = useState<Array<Passenger>>([])
  const [isLast, setIsLast] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0)

  const getPassengers = async () => {

    const params = { size: 10, page };

    try {
      const res = await axios.get('https://api.instantwebtools.net/v1/passenger', { params });

      const passengers = res.data.data;
      const isLast = res.data.totlPage === page;

      setPassengers(prev => [...prev, ...passengers]);
      setIsLast(isLast);
    }
    catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {

    !isLast && getPassengers();
  }, [page])

  return (
    <div>
      {
        passengers.map((passenger, idx) => (
          <Passenger
            key={passenger._id}
            isLastItem={passengers.length - 1 === idx}
            onFetchMorePassengers={() => setPage(prev => prev + 1)}
          >
            {passenger.name}
          </Passenger>
        ))
      }
    </div>
  )
}

export default InfinityScroll