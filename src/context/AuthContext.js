import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 Autentikointikonteksti tarjoaa kirjautumiseen liittyvät tilamuuttujat ja funktiot koko sovellukselle.
 */

const AuthContext = createContext();


/**
 * AuthProvider käärii sovelluksen lapsikomponentit kontekstin tarjoajaan.
 * Hallinnoi kirjautuneen käyttäjän tilaa, istunnon palauttamista sekä Firebasen autentikointitapahtumia.
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      
  const [loading, setLoading] = useState(true); 


 /**
   * Palautetaan tallennettu käyttäjäistunto AsyncStoragesta sovelluksen käynnistyessä.
   *Näin käyttäjä pysyy kirjautuneena, vaikka sulkisi sovelluksen.
   */

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = await AsyncStorage.getItem('user');
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {
        console.log('Session restore error:', e);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);


 /**
   * Kuunnellaan Firebasen autentikointitilan muutoksia.
   * Päivittää käyttäjätilan ja tallentaa tiedot AsyncStorageen, kun Firebase havaitsee aktiivisen kirjautumisen.
   */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = { uid: firebaseUser.uid, email: firebaseUser.email };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    });
    return unsubscribe;
  }, []);



   /**
   * Kirjaa käyttäjän sisään sähköpostilla ja salasanalla.
   * Tallentaa käyttäjätiedot AsyncStorageen pysyvää istuntoa varten.
   * @param {string} email - Käyttäjän sähköpostiosoite
   * @param {string} password - Käyttäjän salasana
   * @returns {object} Kirjautuneen käyttäjän tiedot (uid, email)
   */


  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = { uid: result.user.uid, email: result.user.email };
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userData = { uid: result.user.uid, email: result.user.email };
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

/**
   * Rekisteröi uuden käyttäjän sähköpostilla ja salasanalla.
   * Tallentaa käyttäjätiedot AsyncStorageen pysyvää istuntoa varten.
   * @param {string} email - Uuden käyttäjän sähköpostiosoite
   * @param {string} password - Uuden käyttäjän salasana
   * @returns {object} Luodun käyttäjän tiedot (uid, email)
   */



 /**
   * Kirjaa käyttäjän ulos
   * Poistaa istunnon sekä Firebasesta että AsyncStoragesta ja tyhjentää käyttäjätilan.
   */

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth – mukautettu hook autentikointikontekstin käyttämiseen.
 * Käytä tätä kaikissa komponenteissa, jotka tarvitsevat käyttäjätietoja.
 * Esimerkki: const { user, login, logout } = useAuth();
 */


export const useAuth = () => useContext(AuthContext);