import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, X, Star, Zap } from 'lucide-react';
import { supabase } from './supabase';

const ATSDashboard = () => {

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    minScore: 0,
    maxScore: 100,
    experience: 'all',
    skills: []
  });

  const [sortBy, setSortBy] = useState('match-high');

  useEffect(() => {
    fetchCandidates();
  }, []);

const fetchCandidates = async () => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('score', { ascending: false });

  console.log("DATA FROM SUPABASE:", data);
  console.log("ERROR FROM SUPABASE:", error);

  if (error) {
    console.error(error);
    return;
  }

  const formatted = data.map((c) => ({
    id: c.id,
    name: c.candidate_name,
    role: c.current_position || c.current_role || "Not Specified",
    experience: c.experience_years || 0,
    matchScore: c.score || 0,
    summary: c.summary || "",
    education: c.education || "",
    matchedSkills: c.matched_skills || [],
    skills: c.matched_skills || [],
    highlights: c.strengths || [],
    appliedDate: new Date().toISOString(),
    matchReason: c.recommendation || ""
  }));

  console.log("FORMATTED DATA:", formatted);

  setCandidates(formatted);
};


  // Get unique skills from all candidates
  const allSkills = useMemo(() => {
    const skillSet = new Set();
    candidates.forEach(c => c.skills.forEach(s => skillSet.add(s)));
    return Array.from(skillSet).sort();
  }, [candidates]);

  // Filter and search candidates
  const filteredCandidates = useMemo(() => {
    let result = candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesScore = candidate.matchScore >= filters.minScore && 
                          candidate.matchScore <= filters.maxScore;
      
      const matchesExp = filters.experience === 'all' ||
                        (filters.experience === 'junior' && candidate.experience < 3) ||
                        (filters.experience === 'mid' && candidate.experience >= 3 && candidate.experience < 6) ||
                        (filters.experience === 'senior' && candidate.experience >= 6);
      
      const matchesSkills = filters.skills.length === 0 ||
                           filters.skills.some(skill => candidate.skills.includes(skill));
      
      return matchesSearch && matchesScore && matchesExp && matchesSkills;
    });

    // Sort
    if (sortBy === 'match-high') result.sort((a, b) => b.matchScore - a.matchScore);
    if (sortBy === 'match-low') result.sort((a, b) => a.matchScore - b.matchScore);
    if (sortBy === 'recent') result.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [candidates, searchQuery, filters, sortBy]);

  const toggleSkillFilter = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'from-emerald-500 to-teal-600';
    if (score >= 80) return 'from-blue-500 to-teal-600';
    if (score >= 70) return 'from-amber-500 to-orange-600';
    return 'from-orange-500 to-red-600';
  };

  const getExperienceLabel = (years) => {
    if (years < 3) return 'Junior';
    if (years < 6) return 'Mid-level';
    return 'Senior';
  };

  return (
    <div style={{ background: 'var(--color-background-tertiary)', minHeight: '100vh', padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2rem' }}>
        <div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            Candidate screening
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            AI-powered resume analysis for Senior Engineer role • {filteredCandidates.length} candidates match your filters
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', width: '18px', height: '18px', color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'var(--color-background-primary)',
                color: 'var(--color-text-primary)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-border-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border-secondary)'}
            />
          </div>

          {/* Filters Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
            {/* Match Score Range */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Match score</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: Math.min(parseInt(e.target.value), filters.maxScore) }))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: '500', minWidth: '35px' }}>
                  {filters.minScore}-{filters.maxScore}%
                </span>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Level</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: '24px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
              >
                <option value="all">All levels</option>
                <option value="junior">Junior (0-3 yrs)</option>
                <option value="mid">Mid-level (3-6 yrs)</option>
                <option value="senior">Senior (6+ yrs)</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: '24px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
              >
                <option value="match-high">Highest match</option>
                <option value="match-low">Lowest match</option>
                <option value="recent">Recently applied</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Skills Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter by skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '0.5px solid',
                    borderColor: filters.skills.includes(skill) ? 'var(--color-border-info)' : 'var(--color-border-tertiary)',
                    backgroundColor: filters.skills.includes(skill) ? 'var(--color-background-info)' : 'var(--color-background-primary)',
                    color: filters.skills.includes(skill) ? 'var(--color-text-info)' : 'var(--color-text-primary)',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        {filteredCandidates.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredCandidates.map(candidate => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                style={{
                  backgroundColor: 'var(--color-background-primary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  gap: '1.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                  e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-primary)';
                  e.currentTarget.style.borderColor = 'var(--color-border-tertiary)';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)', margin: 0 }}>
                      {candidate.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-background-secondary)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {getExperienceLabel(candidate.experience)}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 10px 0' }}>
                    {candidate.role} • {candidate.yearsExp}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {candidate.matchedSkills.map(skill => (
                      <span
                        key={skill}
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'var(--color-background-info)',
                          color: 'var(--color-text-info)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', margin: '0 0 4px 0', fontWeight: '500' }}>Match score</p>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, #10b981, #0d9488)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      {candidate.matchScore}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-background-primary)', borderRadius: '12px', border: '0.5px solid var(--color-border-tertiary)' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>No candidates match your filters</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCandidate && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-background-primary)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '2rem', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
                  {selectedCandidate.name}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {selectedCandidate.role} • {selectedCandidate.yearsExp}
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              {/* Match Score Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #10b981, #0d9488)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ fontSize: '12px', opacity: 0.9, margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>AI match score</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{selectedCandidate.matchScore}%</p>
                </div>
                <div style={{ fontSize: '48px' }}>⚡</div>
              </div>

              {/* Match Reason */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Why this match</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', margin: 0, lineHeight: '1.6' }}>
                  {selectedCandidate.matchReason}
                </p>
              </div>

              {/* Key Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-background-secondary)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Experience</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                    {selectedCandidate.experience} years
                  </p>
                </div>
                <div style={{ backgroundColor: 'var(--color-background-secondary)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Applied</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                    {new Date(selectedCandidate.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Professional summary</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', margin: 0, lineHeight: '1.6' }}>
                  {selectedCandidate.summary}
                </p>
              </div>

              {/* All Skills */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedCandidate.skills.map(skill => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '12px',
                        backgroundColor: selectedCandidate.matchedSkills.includes(skill) ? 'var(--color-background-success)' : 'var(--color-background-secondary)',
                        color: selectedCandidate.matchedSkills.includes(skill) ? 'var(--color-text-success)' : 'var(--color-text-secondary)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Key achievements</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {selectedCandidate.highlights.map((highlight, idx) => (
                    <li key={idx} style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: '8px 0', lineHeight: '1.5' }}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Education */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Education</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', margin: 0 }}>
                  {selectedCandidate.education}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '1.5rem', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
                <button
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '0.5px solid var(--color-border-secondary)',
                    backgroundColor: 'var(--color-background-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)'}
                >
                  Save for later
                </button>
                <button
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  Schedule interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSDashboard;
