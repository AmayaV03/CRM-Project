// useLeads.jsx
// Custom hook for managing lead operations

import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchLeads, 
  addLead, 
  updateLead, 
  deleteLead as deleteLeadAction,
  setFilters as setFiltersAction,
  clearFilters as clearFiltersAction,
  setSort as setSortAction,
  setSelectedLead as setSelectedLeadAction
} from '../store/slices/leadsSlice.jsx';

export const useLeads = () => {
  const dispatch = useDispatch();
  const leads = useSelector((state) => state.leads.items);
  const loading = useSelector((state) => state.leads.loading);
  const error = useSelector((state) => state.leads.error);
  const filters = useSelector((state) => state.leads.filters);
  const selectedLead = useSelector((state) => state.leads.selectedLead);

  const fetchLeadsData = useCallback(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !leads.length) {
      fetchLeadsData();
    }
  }, [loading, leads, fetchLeadsData]);

  const createLead = useCallback((leadData) => {
    dispatch(addLead(leadData));
  }, [dispatch]);

  const updateLeadData = useCallback((data) => {
    // Ensure we have an ID and the data to update
    if (!data || !data.id) {
      console.error('No lead ID provided:', data);
      throw new Error('No lead ID provided');
    }

    dispatch(updateLead(data));
  }, [dispatch]);

  const deleteLead = useCallback((leadId) => {
    try {
      dispatch(deleteLeadAction(leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }, [dispatch]);

  const setFilters = useCallback((filters) => {
    dispatch(setFiltersAction(filters));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(clearFiltersAction());
  }, [dispatch]);

  const setSort = useCallback((sortBy, sortOrder) => {
    dispatch(setSortAction({ sortBy, sortOrder }));
  }, [dispatch]);

  const setSelectedLead = useCallback((lead) => {
    dispatch(setSelectedLeadAction(lead));
  }, [dispatch]);

  return {
    leads,
    loading,
    error,
    filters,
    selectedLead,
    fetchLeads: fetchLeadsData,
    createLead,
    updateLeadData,
    deleteLead: deleteLead,
    setFilters,
    clearFilters,
    setSort,
    setSelectedLead,
  };
};
