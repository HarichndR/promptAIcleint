'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Prompt } from '../types';
import { promptApi } from '../services/api';

export const useInfinitePrompts = (initialParams: string = '') => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState(initialParams);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchPrompts = useCallback(async (pageNum: number, currentParams: string) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams(currentParams);
      query.set('page', pageNum.toString());
      query.set('limit', '12');

      const { data } = await promptApi.getPrompts(query.toString());
      
      setPrompts(prev => pageNum === 1 ? data.prompts : [...prev, ...data.prompts]);
      setHasMore(data.page < data.pages);
    } catch (err) {
      console.error('Failed to fetch prompts', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle parameter changes (reset)
  useEffect(() => {
    setPage(1);
    fetchPrompts(1, params);
  }, [params, fetchPrompts]);

  // Handle page changes
  useEffect(() => {
    if (page > 1) {
      fetchPrompts(page, params);
    }
  }, [page, params, fetchPrompts]);

  const updateParams = (newParams: string) => {
    setParams(newParams);
  };

  return { prompts, isLoading, hasMore, lastElementRef, updateParams };
};
