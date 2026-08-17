"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { PackageSuggestion } from "@/lib/types";
import { useToast } from "./Toast";

const MAX_PACKAGES = 2;

interface SearchBoxProps {
  selected: string[];
  onChange: (names: string[]) => void;
  onCompare: () => void;
  loading: boolean;
}

export function SearchBox({ selected, onChange, onCompare, loading }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PackageSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data: { suggestions: PackageSuggestion[] } = await res.json();
        setSuggestions(data.suggestions.filter((s) => !selected.includes(s.name)));
        setOpen(true);
        setHighlighted(0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Suggestion fetch failed:", error);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, selected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectPackage(name: string) {
    if (selected.includes(name)) return;
    if (selected.length >= MAX_PACKAGES) {
      notify("You can only select 2 packages for comparison");
      return;
    }
    onChange([...selected, name]);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  }

  function removePackage(name: string) {
    onChange(selected.filter((n) => n !== name));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (event.key === "Backspace" && query === "" && selected.length > 0) {
        removePackage(selected[selected.length - 1]);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectPackage(suggestions[highlighted].name);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const canCompare = selected.length === MAX_PACKAGES && !loading;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
      <div ref={containerRef} className="relative flex gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2 rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/40">
          {selected.map((name, index) => (
            <span
              key={name}
              className={`flex items-center gap-1.5 rounded border px-2 py-1 text-sm ${
                index === 0
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {name}
              <button
                type="button"
                onClick={() => removePackage(name)}
                aria-label={`Remove ${name}`}
                className="text-current opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (!value.trim()) {
                setSuggestions([]);
                setOpen(false);
              }
            }}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? "Select two packages to compare" : ""}
            className="min-w-40 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>

        <button
          type="button"
          onClick={onCompare}
          disabled={!canCompare}
          className="flex items-center gap-2 rounded-md bg-linear-to-r from-blue-500 to-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-md shadow-blue-950/40 transition-all hover:from-blue-400 hover:to-emerald-400 disabled:cursor-not-allowed disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <SearchIcon />
          )}
          Compare
        </button>

        {open && suggestions.length > 0 && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-full max-w-md overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl shadow-black/40">
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.name}>
                <button
                  type="button"
                  onClick={() => selectPackage(suggestion.name)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={`block w-full px-4 py-2 text-left text-sm text-slate-200 ${
                    index === highlighted ? "bg-slate-800" : "bg-transparent"
                  }`}
                >
                  {suggestion.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
