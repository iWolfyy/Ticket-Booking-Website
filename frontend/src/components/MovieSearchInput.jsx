import React, { useState, useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import apiClient from '../lib/axios';

const MovieSearchInput = ({ onSelect, register, setValue, watch }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);
  
  const currentTitle = watch("title");

  // Debounced Search Function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/events/tmdb-search?query=${query}`);
        setResults(data.results || []);
        setShowResults(true);
      } catch (err) {
        console.error("TMDB Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (movie) => {
    setValue('title', movie.title); // Update react-hook-form value
    setValue('tmdbId', movie.id);    // Store for background enrichment
    setShowResults(false);
    if (onSelect) onSelect(movie);
  };

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <Label htmlFor="title" className="text-xs font-bold uppercase text-muted-foreground">
        Event Title
      </Label>
      <div className="relative">
        <Input
          id="title"
          {...register('title', { 
            required: "Title is required",
            onChange: (e) => debouncedSearch(e.target.value) 
          })}
          className="h-9 pr-8"
          placeholder="Search for a movie..."
          autoComplete="off"
        />
        <div className="absolute right-2.5 top-2.5">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-xl max-h-64 overflow-y-auto overflow-x-hidden border-primary/20">
          {results.slice(0, 6).map((movie) => (
            <div
              key={movie.id}
              className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors border-b last:border-0"
              onClick={() => handleSelect(movie)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-10 h-14 object-cover rounded shadow-sm"
                />
              ) : (
                <div className="w-10 h-14 bg-muted flex items-center justify-center rounded">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{movie.title}</p>
                <p className="text-xs text-muted-foreground">
                  {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieSearchInput;