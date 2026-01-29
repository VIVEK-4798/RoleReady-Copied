import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/* ============================================================================
   🎓 VALIDATION UPDATE BANNER - STEP 4
   ============================================================================
   
   This component shows when mentor validation has occurred since the user's
   last readiness calculation. It prompts the user to recalculate.
   
   FLOW:
   1. On mount, check /readiness/validation-updates/:user_id
   2. If hasUpdates=true, show banner with:
      - How many skills were validated
      - How many skills were rejected
      - "Recalculate Readiness" button
   3. On recalculate, call /readiness/recalculate-after-validation
   4. On success, trigger parent callback to refresh readiness data
   
   ============================================================================ */

const ValidationUpdateBanner = ({ 
  user_id, 
  onRecalculationComplete,
  apiBase = "http://localhost:5000/api" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [validationUpdates, setValidationUpdates] = useState(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check for validation updates on mount
  useEffect(() => {
    const checkValidationUpdates = async () => {
      if (!user_id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBase}/readiness/validation-updates/${user_id}`);
        const data = await response.json();

        if (response.ok && data.hasUpdates) {
          setValidationUpdates(data);
        } else {
          setValidationUpdates(null);
        }
      } catch (error) {
        console.error('[ValidationUpdateBanner] Error checking updates:', error);
        setValidationUpdates(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkValidationUpdates();
  }, [user_id, apiBase]);

  // Handle recalculation
  const handleRecalculate = async () => {
    setIsRecalculating(true);

    try {
      const response = await fetch(`${apiBase}/readiness/recalculate-after-validation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to recalculate');
      }

      // Show success toast with details
      const validated = data.validation_applied?.validated_skills || 0;
      const rejected = data.validation_applied?.rejected_skills || 0;
      
      toast.success(
        `✅ Readiness updated! ${validated} skill(s) received validation bonus, ${rejected} skill(s) excluded.`,
        { autoClose: 5000 }
      );

      // Dismiss banner and notify parent
      setIsDismissed(true);
      if (onRecalculationComplete) {
        onRecalculationComplete(data);
      }

    } catch (error) {
      console.error('[ValidationUpdateBanner] Recalculation error:', error);
      toast.error(error.message || 'Failed to recalculate readiness');
    } finally {
      setIsRecalculating(false);
    }
  };

  // Don't render if loading, no updates, or dismissed
  if (isLoading || !validationUpdates || isDismissed) {
    return null;
  }

  const { validated_count, rejected_count, validated_skills, rejected_skills, message } = validationUpdates;

  return (
    <div className="card border-primary mb-4">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-3">🎓</span>
            <div>
              <h5 className="card-title mb-0 text-primary">
                Your Skills Were Reviewed
              </h5>
              <small className="text-muted">
                A mentor has validated your skills since your last readiness check
              </small>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss"
          ></button>
        </div>

        {/* Summary */}
        <div className="row g-3 mb-3">
          {validated_count > 0 && (
            <div className="col-md-6">
              <div className="bg-success-subtle rounded p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-success">{validated_count}</span>
                  <strong className="text-success">Skill(s) Validated</strong>
                </div>
                <ul className="list-unstyled mb-0 small text-success-emphasis">
                  {validated_skills?.slice(0, 3).map((skill, i) => (
                    <li key={i}>
                      ✅ {skill.skill_name}
                      {skill.mentor_name && (
                        <span className="text-muted ms-1">by {skill.mentor_name}</span>
                      )}
                    </li>
                  ))}
                  {validated_skills?.length > 3 && (
                    <li className="text-muted">...and {validated_skills.length - 3} more</li>
                  )}
                </ul>
                <div className="mt-2 small text-success">
                  <strong>Bonus:</strong> These skills now receive 1.25× weight
                </div>
              </div>
            </div>
          )}
          
          {rejected_count > 0 && (
            <div className="col-md-6">
              <div className="bg-danger-subtle rounded p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-danger">{rejected_count}</span>
                  <strong className="text-danger">Skill(s) Rejected</strong>
                </div>
                <ul className="list-unstyled mb-0 small text-danger-emphasis">
                  {rejected_skills?.slice(0, 3).map((skill, i) => (
                    <li key={i}>
                      ❌ {skill.skill_name}
                      {skill.mentor_name && (
                        <span className="text-muted ms-1">by {skill.mentor_name}</span>
                      )}
                    </li>
                  ))}
                  {rejected_skills?.length > 3 && (
                    <li className="text-muted">...and {rejected_skills.length - 3} more</li>
                  )}
                </ul>
                <div className="mt-2 small text-danger">
                  <strong>Note:</strong> These will be excluded from your score
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="d-flex align-items-center justify-content-between">
          <p className="mb-0 text-muted small">
            Recalculate to see your updated readiness score with validation applied.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleRecalculate}
            disabled={isRecalculating}
          >
            {isRecalculating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Recalculating...
              </>
            ) : (
              <>🔄 Recalculate Readiness</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationUpdateBanner;
