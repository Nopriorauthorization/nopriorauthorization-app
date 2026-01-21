import { CycleEntry, CyclePrediction, GeneticInsight, TreatmentCorrelation, FertilityInsights } from './types';
import { CycleAnalytics, DateUtils } from './utils';

// AI Prediction Engine with Genetic Integration
export class AIPredictionEngine {
  private static readonly MODEL_VERSION = '1.0.0';

  // Generate comprehensive cycle predictions
  static async generateCyclePredictions(
    cycles: CycleEntry[],
    geneticInsights: GeneticInsight[],
    treatments: TreatmentCorrelation[]
  ): Promise<CyclePrediction> {
    const lastCycle = cycles.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    if (!lastCycle) throw new Error('No cycle data available');

    const averageLength = CycleAnalytics.calculateAverageCycleLength(cycles);
    const regularity = CycleAnalytics.calculateCycleRegularity(cycles);

    // Base prediction on historical data
    const nextPeriodStart = new Date(lastCycle.date);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + averageLength);

    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + 5); // Average period length

    // Adjust for genetic factors
    const geneticAdjustments = this.calculateGeneticAdjustments(geneticInsights);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + geneticAdjustments.periodOffset);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + geneticAdjustments.periodOffset);

    // Adjust for treatment impacts
    const treatmentAdjustments = this.calculateTreatmentAdjustments(treatments, nextPeriodStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + treatmentAdjustments.periodOffset);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + treatmentAdjustments.periodOffset);

    // Calculate ovulation (typically 14 days before next period)
    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    // Fertile window (5 days before to 1 day after ovulation)
    const fertileWindow = {
      start: new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000),
      end: new Date(ovulationDate.getTime() + 1 * 24 * 60 * 60 * 1000)
    };

    // Calculate confidence based on data quality and consistency
    const confidence = this.calculatePredictionConfidence(cycles, regularity, geneticInsights);

    // Identify influencing factors
    const factors = this.identifyInfluencingFactors(cycles, geneticInsights, treatments);

    return {
      id: crypto.randomUUID(),
      userId: lastCycle.userId,
      nextPeriodStart,
      nextPeriodEnd,
      ovulationDate,
      fertileWindow,
      confidence,
      factors,
      generatedAt: new Date(),
      modelVersion: this.MODEL_VERSION
    };
  }

  // Calculate genetic adjustments to cycle predictions
  private static calculateGeneticAdjustments(geneticInsights: GeneticInsight[]): { periodOffset: number } {
    let periodOffset = 0;

    // PCOS genetic markers can affect cycle length
    const pcosInsights = geneticInsights.filter(g => g.trait.toLowerCase().includes('pcos'));
    if (pcosInsights.some(g => g.riskLevel === 'high')) {
      periodOffset += 3; // Longer cycles with PCOS
    }

    // Thyroid-related genetics
    const thyroidInsights = geneticInsights.filter(g =>
      g.trait.toLowerCase().includes('thyroid') ||
      g.trait.toLowerCase().includes('autoimmune')
    );
    if (thyroidInsights.some(g => g.riskLevel === 'moderate' || g.riskLevel === 'high')) {
      periodOffset += 1; // Slight cycle irregularity
    }

    return { periodOffset };
  }

  // Calculate treatment adjustments
  private static calculateTreatmentAdjustments(
    treatments: TreatmentCorrelation[],
    predictionDate: Date
  ): { periodOffset: number } {
    let periodOffset = 0;

    // Recent treatments that might affect cycles
    const recentTreatments = treatments.filter(t =>
      Math.abs(predictionDate.getTime() - t.treatmentDate.getTime()) < 90 * 24 * 60 * 60 * 1000 // Within 90 days
    );

    // Hormonal treatments (Botox, fillers) can affect timing
    const hormonalTreatments = recentTreatments.filter(t =>
      t.outcome.toLowerCase().includes('hormonal') ||
      t.treatmentId.toLowerCase().includes('botox') ||
      t.treatmentId.toLowerCase().includes('filler')
    );

    if (hormonalTreatments.length > 0) {
      periodOffset += 1; // Slight delay due to hormonal disruption
    }

    return { periodOffset };
  }

  // Calculate prediction confidence
  private static calculatePredictionConfidence(
    cycles: CycleEntry[],
    regularity: number,
    geneticInsights: GeneticInsight[]
  ): number {
    let confidence = 50; // Base confidence

    // Data volume factor
    if (cycles.length >= 6) confidence += 20;
    else if (cycles.length >= 3) confidence += 10;

    // Regularity factor
    confidence += regularity * 0.2; // Up to 20 points for perfect regularity

    // Genetic data factor
    if (geneticInsights.length > 0) confidence += 10;

    return Math.min(100, Math.max(0, confidence));
  }

  // Identify factors influencing predictions
  private static identifyInfluencingFactors(
    cycles: CycleEntry[],
    geneticInsights: GeneticInsight[],
    treatments: TreatmentCorrelation[]
  ): string[] {
    const factors: string[] = [];

    // Cycle history factors
    if (cycles.length >= 6) {
      factors.push('6+ months of cycle data');
    }

    if (CycleAnalytics.calculateCycleRegularity(cycles) > 80) {
      factors.push('Highly regular cycles');
    }

    // Genetic factors
    const highRiskGenetics = geneticInsights.filter(g => g.riskLevel === 'high');
    if (highRiskGenetics.length > 0) {
      factors.push(`${highRiskGenetics.length} high-risk genetic factors`);
    }

    // Treatment factors
    const recentTreatments = treatments.filter(t =>
      new Date().getTime() - t.treatmentDate.getTime() < 90 * 24 * 60 * 60 * 1000
    );
    if (recentTreatments.length > 0) {
      factors.push(`${recentTreatments.length} recent treatments`);
    }

    // Environmental factors (based on symptoms and notes)
    const stressSymptoms = cycles.flatMap(c => c.symptoms)
      .filter(s => s.category === 'emotional' && s.severity >= 4);
    if (stressSymptoms.length > 0) {
      factors.push('Stress-related symptoms detected');
    }

    return factors;
  }

  // Generate fertility insights
  static async generateFertilityInsights(
    cycles: CycleEntry[],
    predictions: CyclePrediction,
    currentDate: Date
  ): Promise<FertilityInsights> {
    const fertileWindow = predictions.fertileWindow;
    const ovulationDate = predictions.ovulationDate;

    // Determine current fertility status
    let currentFertilityStatus: FertilityInsights['currentFertilityStatus'] = 'low';

    if (currentDate >= fertileWindow.start && currentDate <= fertileWindow.end) {
      const daysFromOvulation = Math.abs(currentDate.getTime() - ovulationDate.getTime()) / (24 * 60 * 60 * 1000);
      if (daysFromOvulation <= 1) {
        currentFertilityStatus = 'peak';
      } else {
        currentFertilityStatus = 'high';
      }
    } else if (Math.abs(currentDate.getTime() - ovulationDate.getTime()) / (24 * 60 * 60 * 1000) <= 3) {
      currentFertilityStatus = 'moderate';
    }

    // Calculate ovulation likelihood
    const ovulationLikelihood = this.calculateOvulationLikelihood(cycles, currentDate);

    // Generate factors and recommendations
    const factors = this.generateFertilityFactors(cycles, predictions);
    const recommendations = this.generateFertilityRecommendations(currentFertilityStatus, predictions);

    return {
      userId: cycles[0]?.userId || '',
      currentFertilityStatus,
      nextFertileWindow: fertileWindow,
      ovulationLikelihood,
      factors,
      recommendations,
      generatedAt: new Date()
    };
  }

  // Calculate ovulation likelihood for a specific date
  private static calculateOvulationLikelihood(cycles: CycleEntry[], targetDate: Date): number {
    if (cycles.length < 3) return 0;

    const averageCycleLength = CycleAnalytics.calculateAverageCycleLength(cycles);
    const lastCycle = cycles.sort((a, b) => b.date.getTime() - a.date.getTime())[0];

    const daysSinceLastPeriod = Math.floor((targetDate.getTime() - lastCycle.date.getTime()) / (24 * 60 * 60 * 1000));
    const expectedOvulationDay = averageCycleLength - 14;

    // Calculate likelihood based on distance from expected ovulation
    const daysFromExpected = Math.abs(daysSinceLastPeriod - expectedOvulationDay);
    const likelihood = Math.max(0, 100 - (daysFromExpected * 10));

    return Math.min(100, likelihood);
  }

  // Generate fertility factors
  private static generateFertilityFactors(cycles: CycleEntry[], predictions: CyclePrediction): string[] {
    const factors: string[] = [];

    // Age factor (simplified - would need actual age data)
    factors.push('Age-appropriate fertility patterns');

    // Cycle regularity
    const regularity = CycleAnalytics.calculateCycleRegularity(cycles);
    if (regularity > 80) {
      factors.push('Regular menstrual cycles');
    } else {
      factors.push('Irregular cycle patterns');
    }

    // Recent activity
    const recentCycles = cycles.filter(c =>
      new Date().getTime() - c.date.getTime() < 90 * 24 * 60 * 60 * 1000
    );
    factors.push(`${recentCycles.length} recent cycles analyzed`);

    // Prediction confidence
    if (predictions.confidence > 80) {
      factors.push('High prediction confidence');
    }

    return factors;
  }

  // Generate fertility recommendations
  private static generateFertilityRecommendations(
    status: FertilityInsights['currentFertilityStatus'],
    predictions: CyclePrediction
  ): string[] {
    const recommendations: string[] = [];

    switch (status) {
      case 'peak':
        recommendations.push('Peak fertility window - optimal time for conception');
        recommendations.push('Consider timing important treatments outside this window');
        break;
      case 'high':
        recommendations.push('High fertility period - good time for conception planning');
        break;
      case 'moderate':
        recommendations.push('Moderate fertility - monitor closely for peak window');
        break;
      case 'low':
        recommendations.push('Low fertility period - focus on cycle tracking and health optimization');
        break;
    }

    // Treatment timing recommendations
    const fertileWindow = predictions.fertileWindow;
    recommendations.push(`Avoid elective procedures during fertile window: ${DateUtils.formatDateRange(fertileWindow.start, fertileWindow.end)}`);

    // General health recommendations
    recommendations.push('Maintain consistent sleep and stress management for optimal hormonal balance');

    return recommendations;
  }

  // Analyze treatment correlations with cycles
  static async analyzeTreatmentCorrelations(
    cycles: CycleEntry[],
    treatments: TreatmentCorrelation[]
  ): Promise<TreatmentCorrelation[]> {
    const correlations: TreatmentCorrelation[] = [];

    for (const treatment of treatments) {
      // Find cycles around treatment date
      const treatmentCycles = cycles.filter(cycle => {
        const daysDiff = Math.abs(cycle.date.getTime() - treatment.treatmentDate.getTime()) / (24 * 60 * 60 * 1000);
        return daysDiff <= 30; // Within 30 days of treatment
      });

      if (treatmentCycles.length > 0) {
        // Analyze impact on subsequent cycles
        const subsequentCycles = cycles.filter(cycle =>
          cycle.date > treatment.treatmentDate
        ).slice(0, 3); // Next 3 cycles

        if (subsequentCycles.length >= 2) {
          const avgLengthBefore = CycleAnalytics.calculateAverageCycleLength(
            cycles.filter(c => c.date < treatment.treatmentDate).slice(-3)
          );
          const avgLengthAfter = CycleAnalytics.calculateAverageCycleLength(subsequentCycles);

          const lengthChange = avgLengthAfter - avgLengthBefore;
          const impact = Math.abs(lengthChange) > 2 ? 'significant' : 'minimal';

          correlations.push({
            ...treatment,
            outcome: `${impact} impact on cycle length (${lengthChange > 0 ? '+' : ''}${lengthChange} days)`,
            sideEffects: [], // Would be populated from user reports
            notes: `Treatment on ${DateUtils.formatDate(treatment.treatmentDate)} during ${treatment.cyclePhase} phase`
          });
        }
      }
    }

    return correlations;
  }
}