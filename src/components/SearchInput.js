import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { darkTheme } from '../utils/theme';
import { searchAssets as searchAssetsAPI } from '../utils/api';

export default function SearchInput({
  value,
  onSelect,
  assetType,
  placeholder = 'Search...',
  onSearchStart,
  onSearchEnd,
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      searchAssets(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, assetType]);

  const searchAssets = async (searchQuery) => {
    setLoading(true);
    setShowSuggestions(true);
    onSearchStart?.();

    try {
      const results = await searchAssetsAPI(searchQuery, assetType);
      
      // Filter by asset type
      const filteredResults = assetType !== 'all' 
        ? results.filter(r => r.type === assetType)
        : results;
      
      setSuggestions(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
      onSearchEnd?.();
    }
  };

  const handleSelect = (item) => {
    setQuery(item.symbol || item.name);
    setShowSuggestions(false);
    setSuggestions([]);
    onSelect(item);
  };

  const handleChangeText = (text) => {
    setQuery(text);
    if (text.length < 2) {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.suggestionInfo}>
        <Text style={styles.suggestionSymbol}>{item.symbol || item.name}</Text>
        <Text style={styles.suggestionName} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(item.type) }]}>
        <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  const getTypeBadgeColor = (type) => {
    const colors = {
      stock: darkTheme.primary,
      etf: darkTheme.secondary,
      crypto: darkTheme.accent,
    };
    return colors[type.toLowerCase()] || darkTheme.primary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={darkTheme.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color={darkTheme.primary}
            style={styles.loader}
          />
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => `${item.symbol || item.id}-${index}`}
            keyboardShouldPersistTaps="handled"
            style={styles.suggestionsList}
            nestedScrollEnabled={true}
          />
        </View>
      )}

      {showSuggestions && !loading && suggestions.length === 0 && query.length >= 2 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: darkTheme.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: darkTheme.text,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  loader: {
    position: 'absolute',
    right: 12,
  },
  suggestionsContainer: {
    backgroundColor: darkTheme.surface,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: darkTheme.border,
    ...darkTheme.shadow,
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.border,
  },
  suggestionInfo: {
    flex: 1,
    marginRight: 12,
  },
  suggestionSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 2,
  },
  suggestionName: {
    fontSize: 12,
    color: darkTheme.textSecondary,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: darkTheme.text,
  },
  noResultsContainer: {
    backgroundColor: darkTheme.surface,
    borderRadius: 8,
    marginTop: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  noResultsText: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    textAlign: 'center',
  },
});
