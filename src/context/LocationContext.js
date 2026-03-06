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


/**
 * Sijaintikonteksti tarjoaa sijaintien hallinnan tilamuuttujat ja funktiot koko sovellukselle.
 */

const LocationContext = createContext();


/**
 * LocationProvider käärii lapsikomponentit kontekstin tarjoajaan. Hallinnoi käyttäjän omia sijainteja sekä kaikkien jakamia sijainteja.
 */


export const LocationProvider = ({ children }) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [sharedLocations, setSharedLocations] = useState([]);


 /**
   * Haetaan käyttäjän sijainnit automaattisesti, kun kirjautumistila muuttuu, jos käyttäjä kirjautuu ulos tyhjennetään sijaintilista.
   */

  useEffect(() => {
    if (user?.uid) {
      fetchLocations();
    } else {
      setLocations([]);
    }
  }, [user]);


/**
   * Hakee kirjautuneen käyttäjän omat sijainnit Firestoresta. Suodattaa tulokset käyttäjän uid:n perusteella.
   */

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


/**
   * Lisää uuden sijainnin Firestoreen.
   * Jos isShared on true, tallennetaan sijainti myös sharedLocations kokoelmaan.
   * Päivittää sijaintilistan tallennuksen jälkeen.
   * @param {string} name - Sijainnin nimi
   * @param {string} description - Sijainnin kuvaus
   * @param {number} rating - Arvosana (1–5)
   * @param {boolean} isShared - Jaetaanko sijainti kaikille käyttäjille
   */

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


 /**
   * Hakee kaikki julkisesti jaetut sijainnit Firestoresta. 
   * Ei suodata käyttäjän mukaan näyttää kaikkien jakaman sisällön.
   */

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


/**
 * useLocations  mukautettu hook sijaintikontekstin käyttämiseen.
 * Käytä tätä kaikissa komponenteissa, jotka tarvitsevat sijaintitietoja.
 * Esimerkki: const { locations, addLocation } = useLocations();
 */


export const useLocations = () => useContext(LocationContext);