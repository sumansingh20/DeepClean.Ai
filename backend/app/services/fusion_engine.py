"""
Fusion Engine and Risk Scoring System
Combines multi-modal analysis results into single Fraud Risk Score
"""

from typing import Dict, List, Tuple
from dataclasses import dataclass
import numpy as np
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


@dataclass
class RiskScoreBreakdown:
    """Detailed risk score breakdown"""
    voice_score: float
    video_score: float
    document_score: float
    scam_score: float
    liveness_score: float
    weighted_score: float
    final_score: float
    confidence: float
    risk_category: str  # low, medium, high
    action: str  # allow, challenge, escalate, block
    factors: Dict[str, List[str]]


class FusionEngine:
    """
    Fusion Engine: Combine component scores into single Fraud Risk Score
    
    Algorithm:
    1. Normalize component scores to 0-1 range
    2. Apply configurable weights (voice, video, document, scam, liveness)
    3. Apply user history modifier
    4. Calculate confidence as weighted average of component confidences
    5. Generate risk category and recommended action
    """
    
    def __init__(self):
        self.weights = settings.RISK_SCORE_WEIGHTS
        self.thresholds = settings.RISK_SCORE_THRESHOLDS
        self.actions = settings.RISK_ACTIONS
    
    def calculate_risk_score(self,
                            voice_result: Dict = None,
                            video_result: Dict = None,
                            document_result: Dict = None,
                            scam_result: Dict = None,
                            liveness_result: Dict = None,
                            user_history: Dict = None) -> RiskScoreBreakdown:
        """
        Calculate final fraud risk score from component results
        
        Args:
            voice_result: Voice deepfake analysis result
            video_result: Video deepfake analysis result
            document_result: Document forgery analysis result
            scam_result: Scam call analysis result
            liveness_result: Liveness detection result
            user_history: User's session history (for risk adjustment)
        
        Returns:
            RiskScoreBreakdown with all metrics
        """
        
        # Extract component scores
        scores = {
            'voice': voice_result.get('score', 0.5) if voice_result else None,
            'video': video_result.get('score', 0.5) if video_result else None,
            'document': document_result.get('score', 0.5) if document_result else None,
            'scam': scam_result.get('score', 0.5) if scam_result else None,
            'liveness': liveness_result.get('score', 0.5) if liveness_result else None,
        }
        
        confidences = {
            'voice': voice_result.get('confidence', 0.5) if voice_result else 0.5,
            'video': video_result.get('confidence', 0.5) if video_result else 0.5,
            'document': document_result.get('confidence', 0.5) if document_result else 0.5,
            'scam': scam_result.get('confidence', 0.5) if scam_result else 0.5,
            'liveness': liveness_result.get('confidence', 0.5) if liveness_result else 0.5,
        }
        
        # Apply weighted sum
        weighted_score = self._calculate_weighted_score(scores)
        
        # Apply user history modifier
        history_factor = self._calculate_history_factor(user_history)
        adjusted_score = weighted_score * history_factor
        
        # Calculate overall confidence
        overall_confidence = self._calculate_confidence(scores, confidences)
        
        # Final score (clamp to 0-1)
        final_score = min(1.0, max(0.0, adjusted_score))
        
        # Determine risk category
        if final_score < self.thresholds['low']:
            risk_category = 'low'
        elif final_score < self.thresholds['medium']:
            risk_category = 'medium'
        elif final_score < self.thresholds['high']:
            risk_category = 'high'
        else:
            risk_category = 'critical'
        
        # Determine action
        action = self.actions.get(risk_category, 'escalate')
        
        # Generate explanatory factors
        factors = self._generate_risk_factors(scores, confidences, risk_category)
        
        return RiskScoreBreakdown(
            voice_score=scores['voice'],
            video_score=scores['video'],
            document_score=scores['document'],
            scam_score=scores['scam'],
            liveness_score=scores['liveness'],
            weighted_score=weighted_score,
            final_score=final_score,
            confidence=overall_confidence,
            risk_category=risk_category,
            action=action,
            factors=factors
        )
    
    def _calculate_weighted_score(self, scores: Dict[str, float]) -> float:
        """Calculate weighted average of component scores"""
        total_weight = 0.0
        weighted_sum = 0.0
        
        for component, score in scores.items():
            if score is not None:
                weight = self.weights.get(component, 0.0)
                weighted_sum += score * weight
                total_weight += weight
        
        if total_weight == 0:
            return 0.5  # Default neutral score
        
        return weighted_sum / total_weight
    
    def _calculate_history_factor(self, user_history: Dict = None) -> float:
        """
        Calculate modifier based on user's history
        
        Factors:
        - User with clean history: 0.8 (more lenient)
        - User with fraud history: 1.2 (more strict)
        - New user: 1.0 (neutral)
        """
        if not user_history:
            return 1.0
        
        # Count previous incidents
        incident_count = user_history.get('incident_count', 0)
        successful_sessions = user_history.get('successful_sessions', 0)
        
        # Calculate factor
        if incident_count > 5:
            factor = 1.3  # High risk user
        elif incident_count > 2:
            factor = 1.15  # Moderate risk
        elif successful_sessions > 50:
            factor = 0.85  # Trusted user
        else:
            factor = 1.0  # Default
        
        # Clamp between 0.7 and 1.5
        return min(1.5, max(0.7, factor))
    
    def _calculate_confidence(self, scores: Dict[str, float], confidences: Dict[str, float]) -> float:
        """Calculate overall model confidence"""
        # Average confidence of non-None scores
        valid_confidences = [c for s, c in zip(scores.values(), confidences.values()) if s is not None]
        
        if not valid_confidences:
            return 0.5
        
        return np.mean(valid_confidences)
    
    def _generate_risk_factors(self, scores: Dict[str, float], 
                              confidences: Dict[str, float], 
                              risk_category: str) -> Dict[str, List[str]]:
        """Generate human-readable risk factors and mitigations"""
        factors = {
            'risk_factors': [],
            'mitigating_factors': [],
            'recommendations': []
        }
        
        # Identify high-scoring components
        high_components = [k for k, v in scores.items() if v and v > 0.65]
        low_components = [k for k, v in scores.items() if v and v < 0.35]
        
        # Risk factors
        if 'voice' in high_components:
            factors['risk_factors'].append("Voice deepfake characteristics detected")
        if 'video' in high_components:
            factors['risk_factors'].append("Video deepfake indicators found")
        if 'document' in high_components:
            factors['risk_factors'].append("Document forgery signs detected")
        if 'scam' in high_components:
            factors['risk_factors'].append("Scam call patterns identified")
        if 'liveness' in high_components:
            factors['risk_factors'].append("Liveness test failed")
        
        # Mitigating factors
        if 'voice' in low_components:
            factors['mitigating_factors'].append("Voice analysis shows authentic characteristics")
        if 'video' in low_components:
            factors['mitigating_factors'].append("Video analysis shows natural patterns")
        if 'liveness' in low_components:
            factors['mitigating_factors'].append("Liveness test passed")
        
        # Recommendations
        if risk_category == 'critical':
            factors['recommendations'].append("Block transaction immediately")
            factors['recommendations'].append("Escalate to fraud team for investigation")
        elif risk_category == 'high':
            factors['recommendations'].append("Request additional verification (2FA)")
            factors['recommendations'].append("Perform manual review")
        elif risk_category == 'medium':
            factors['recommendations'].append("Request liveness challenge")
            factors['recommendations'].append("Monitor account for unusual activity")
        else:
            factors['recommendations'].append("Allow transaction")
            factors['recommendations'].append("Continue routine monitoring")
        
        return factors


class ResponseEngine:
    """
    Autonomous Response Engine: Make decisions based on risk scores
    
    Policy-based system that:
    1. Evaluates risk score against thresholds
    2. Applies custom policies per client
    3. Executes automated actions or escalations
    4. Logs all decisions
    """
    
    def __init__(self):
        self.actions = settings.RISK_ACTIONS
    
    def determine_action(self, risk_score: float, risk_category: str, 
                        confidence: float, user_profile: Dict = None) -> Dict:
        """
        Determine automated action based on risk score
        
        Returns:
            {
                'action': 'allow' | 'challenge' | 'escalate' | 'block',
                'reason': str,
                'next_steps': [str],
                'is_automated': bool,
                'requires_review': bool,
            }
        """
        
        # Base action from risk category
        base_action = self.actions.get(risk_category, 'escalate')
        
        # Confidence-based adjustments
        if confidence < 0.6:
            # Low confidence = escalate to human review
            action = 'escalate'
            reason = f"Low model confidence ({confidence:.1%}) - requires human review"
            requires_review = True
        elif risk_score > 0.95:
            action = 'block'
            reason = "Critical fraud risk detected"
            requires_review = True
        elif risk_score > 0.85:
            action = 'escalate'
            reason = "High fraud risk requires immediate review"
            requires_review = True
        elif risk_score > 0.6:
            action = 'challenge'
            reason = "Additional verification required"
            requires_review = False
        else:
            action = 'allow'
            reason = "Low fraud risk"
            requires_review = False
        
        # Apply user-specific policies (if available)
        if user_profile:
            action, reason = self._apply_user_policies(action, reason, user_profile, risk_score)
        
        # Generate next steps
        next_steps = self._generate_next_steps(action, risk_category)
        
        return {
            'action': action,
            'reason': reason,
            'next_steps': next_steps,
            'is_automated': True,
            'requires_review': requires_review,
            'risk_score': risk_score,
            'confidence': confidence,
        }
    
    def _apply_user_policies(self, action: str, reason: str, 
                            user_profile: Dict, risk_score: float) -> Tuple[str, str]:
        """Apply custom policies for user"""
        
        # Example policies
        if user_profile.get('is_vip'):
            # VIP users get more lenient treatment
            if action in ['block', 'escalate']:
                action = 'challenge'
                reason = "VIP customer - requesting verification instead of block"
        
        if user_profile.get('recent_fraud_report'):
            # Users reported by fraud team get stricter treatment
            if action in ['allow', 'challenge']:
                action = 'escalate'
                reason = "User flagged for fraud - escalating for review"
        
        # Geographic velocity check
        if user_profile.get('impossible_travel'):
            action = 'escalate'
            reason = "Impossible travel pattern detected - geographic anomaly"
        
        return action, reason
    
    def _generate_next_steps(self, action: str, risk_category: str) -> List[str]:
        """Generate next steps for the action"""
        
        next_steps_map = {
            'allow': [
                "Transaction approved",
                "Continue normal monitoring",
                "Update risk profile"
            ],
            'challenge': [
                "Send liveness challenge to user",
                "Wait for challenge response (60 seconds)",
                "Re-evaluate based on challenge result"
            ],
            'escalate': [
                "Create incident ticket",
                "Alert fraud team via Slack/email",
                "Pending manual review (target: 30 minutes)",
                "Webhook notification to client"
            ],
            'block': [
                "Block transaction immediately",
                "Send alert to user",
                "Disable account (optional)",
                "Report to SIEM for correlation",
                "Generate forensic report"
            ]
        }
        
        return next_steps_map.get(action, ["Unknown action"])


class ExplainabilityGenerator:
    """Generate human-readable explanations for fraud risk scores"""
    
    @staticmethod
    def generate_explanation(risk_breakdown: RiskScoreBreakdown) -> Dict[str, str]:
        """Generate user-friendly and analyst-friendly explanations"""
        
        user_friendly = ExplainabilityGenerator._generate_user_explanation(risk_breakdown)
        analyst_detailed = ExplainabilityGenerator._generate_analyst_explanation(risk_breakdown)
        
        return {
            'user_friendly': user_friendly,
            'analyst_detailed': analyst_detailed,
            'technical': risk_breakdown.factors
        }
    
    @staticmethod
    def _generate_user_explanation(rb: RiskScoreBreakdown) -> str:
        """User-friendly explanation"""
        
        if rb.risk_category == 'low':
            return "Your verification was successful. You can proceed."
        elif rb.risk_category == 'medium':
            return "We need additional verification to proceed. Please complete the security challenge."
        elif rb.risk_category == 'high':
            return "We detected unusual activity. Please contact support or try again later."
        else:  # critical
            return "This transaction cannot be processed due to security concerns. Please contact support."
    
    @staticmethod
    def _generate_analyst_explanation(rb: RiskScoreBreakdown) -> str:
        """Detailed analyst explanation"""
        
        explanation = f"""
FRAUD RISK ANALYSIS REPORT
==========================

RISK SCORE: {rb.final_score:.2%}
CONFIDENCE: {rb.confidence:.2%}
CATEGORY: {rb.risk_category.upper()}
RECOMMENDED ACTION: {rb.action.upper()}

COMPONENT SCORES:
- Voice Deepfake: {rb.voice_score:.2%}
- Video Deepfake: {rb.video_score:.2%}
- Document Forgery: {rb.document_score:.2%}
- Scam Call: {rb.scam_score:.2%}
- Liveness: {rb.liveness_score:.2%}

RISK FACTORS:
{chr(10).join(f"• {f}" for f in rb.factors['risk_factors'])}

MITIGATING FACTORS:
{chr(10).join(f"• {f}" for f in rb.factors['mitigating_factors'])}

RECOMMENDATIONS:
{chr(10).join(f"• {r}" for r in rb.factors['recommendations'])}
"""
        
        return explanation
