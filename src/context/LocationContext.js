import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [sharedLocations, setSharedLocations] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      fetchLocations();
    } else {
      setLocations([]);
    }
  }, [user]);

  const fetchLocations = async () => {
    try {
      const q = query(
        collection(db, 'locations'),
        where('uid', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLocations(data);
    } catch (e) {
      console.log('Fetch locations error:', e);
    }
  };

  const addLocation = async (name, description, rating, isShared = false) => {
    const locationData = {
      name,
      description,
      rating,
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
    };


    await addDoc(collection(db, 'locations'), locationData);

    if (isShared) {
      await addDoc(collection(db, 'sharedLocations'), {
        ...locationData,
        sharedBy: user.email,
      });
    }

    await fetchLocations();
  };

  const fetchSharedLocations = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'sharedLocations'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSharedLocations(data);
    } catch (e) {
      console.log('Fetch shared error:', e);
    }
  };

  return (
    <LocationContext.Provider
      value={{ locations, sharedLocations, addLocation, fetchLocations, fetchSharedLocations }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => useContext(LocationContext);