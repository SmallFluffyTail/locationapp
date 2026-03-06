import { useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { COLORS, globalStyles } from '../theme/theme';



/**
 * Maiden hakunäyttö.
 * Käyttäjä voi hakea maita nimellä sekä tarkastella kunkin maan perustietoja.
 */
export default function CountrySearchScreen() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); 

  const searchCountries = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(query.trim())}`
      );
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError(`No countries found for "${query}".`);
    } finally {
      setLoading(false);
    }
  };

/**
 * Suodatetaan hakutulokset aktiivisen suodattimen mukaan
 */

  const filteredResults = results.filter((c) => {
    if (filter === 'europe') return c.region === 'Europe';
    if (filter === 'large') return c.population > 50_000_000;
    if (filter === 'un') return c.unMember === true;
    return true;
  });


/**
   Yksittäisen maan kortti hakutuloslistassa.
   Näyttää lipun, nimen, alueen, väkiluvun, pääkaupungin, kielet sekä YK-jäsenyyden, jos se on voimassa.
*/

  const renderItem = ({ item }) => (
    <Card style={[globalStyles.card, styles.countryCard]}>
      <View style={styles.row}>
        <Image source={{ uri: item.flags?.png }} style={styles.flag} />
        <View style={styles.info}>
          <Text style={styles.countryName}>{item.name?.common}</Text>
          <Text style={styles.detail}>🌍 {item.region} › {item.subregion}</Text>
          <Text style={styles.detail}>
            👥 {item.population?.toLocaleString()} people
          </Text>
          <Text style={styles.detail}>🏙️ Capital: {item.capital?.[0] ?? 'N/A'}</Text>
          <Text style={styles.detail}>
            💬 {Object.values(item.languages ?? {}).join(', ') || 'N/A'}
          </Text>
          {item.unMember && (
            <Chip
              compact
              style={styles.chip}
              textStyle={{ color: COLORS.primary, fontSize: 10 }}
            >
              🇺🇳 UN Member
            </Chip>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emailText}>{user?.email}</Text>
        <Button mode="text" onPress={logout} textColor={COLORS.error} compact>
          Logout
        </Button>
      </View>

      <View style={styles.searchArea}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          mode="outlined"
          placeholder="Search country..."
          style={styles.searchInput}
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
          onSubmitEditing={searchCountries}
          right={
            <TextInput.Icon icon="magnify" onPress={searchCountries} color={COLORS.primary} />
          }
        />

        {/* Filter chips */}
        <View style={styles.filters}>
          {['all', 'europe', 'large', 'un'].map((f) => (
            <Chip
              key={f}
              selected={filter === f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.activeChip]}
              textStyle={{ color: filter === f ? COLORS.white : COLORS.text, fontSize: 12 }}
            >
              {f === 'all' ? 'All' : f === 'europe' ? '🌍 Europe' : f === 'large' ? '👥 50M+' : '🇺🇳 UN Member'}
            </Chip>
          ))}
        </View>
      </View>

      {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.cca3}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        ListEmptyComponent={
          !loading && !error && results.length === 0 ? (
            <Text style={styles.emptyText}>Search for a country above</Text>
          ) : null
        }
      />
    </View>
  );
}


/*Tyylit*/
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
  },
  emailText: { color: COLORS.white, fontSize: 13 },
  searchArea: { padding: 12 },
  searchInput: { backgroundColor: COLORS.surface },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  filterChip: { backgroundColor: COLORS.cardBg },
  activeChip: { backgroundColor: COLORS.primary },
  countryCard: { marginHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  flag: { width: 70, height: 50, borderRadius: 4, marginTop: 4 },
  info: { flex: 1 },
  countryName: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  detail: { fontSize: 12, color: COLORS.darkText, marginTop: 2 },
  chip: { backgroundColor: COLORS.accent, marginTop: 6, alignSelf: 'flex-start' },
  errorText: { color: COLORS.error, textAlign: 'center', margin: 20 },
  emptyText: { color: COLORS.textLight, textAlign: 'center', marginTop: 40 },
});